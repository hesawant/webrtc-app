import { Dispatch } from "redux";

import { RoomsAction } from "./type";
import { SocketManager } from "./socket-manager";

import { RootState } from "../redux";
import { createSetActiveRoomId, createSetActiveRoomName } from "../redux/active-room-actions";
import { getActiveRoomId } from "../redux/active-room-rules";
import { createSetSelfId, createSetPeerVideoStreamAction } from "../redux/peers-actions";
import { getSelfPeerId } from "../redux/peers-rules";

const socketManager: SocketManager = new SocketManager();

// public STUN servers list → https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const pc = new RTCPeerConnection(configuration);

// https://www.html5rocks.com/en/tutorials/webrtc/basics/
export function initPC() {
    return (dispatch: Dispatch, getState: () => RootState) => {
        addPeerConnectionListeners(dispatch, getState);

        socketManager.recv(RoomsAction.JOIN_ROOM, async (args: any) => {
            const { ok, type, room, attendee } = args;

            if (!ok || type !== RoomsAction.JOIN_ROOM) return;

            dispatch(createSetActiveRoomId(room.id));
            dispatch(createSetActiveRoomName(room.name));
            dispatch(createSetSelfId(attendee.id));
        });

        socketManager.recv(RoomsAction.MESSAGE, async (message: any) => {
            const { desc, candidate } = message;

            if (desc) {
                // if we get an offer, we need to reply with an answer
                if (desc.type === "offer") {
                    console.log("Offer received");
                    await pc.setRemoteDescription(desc);

                    const state = getState();
                    const stream = state.peers.self.videoMediaStream;

                    if (!stream) return;

                    stream.getTracks().forEach(track => pc.addTrack(track, stream));

                    await pc.setLocalDescription(await pc.createAnswer());

                    socketManager.send(RoomsAction.MESSAGE, {
                        id: getActiveRoomId(getState()),
                        attendeeId: getSelfPeerId(getState()),
                        desc: pc.localDescription
                    });
                } else if (desc.type === "answer") {
                    console.log("Answer received");
                    await pc.setRemoteDescription(desc);
                } else {
                    console.log("Unsupported SDP type.");
                }
            } else if (candidate) {
                console.log("candidate received = ", candidate);
                const newCandidate = new RTCIceCandidate(candidate);

                await pc.addIceCandidate(newCandidate).catch(reason => {
                    console.log("addIceCandidate error");
                    console.log(reason.name);
                    console.log(reason.message);
                });
            }
        });

        socketManager.send(RoomsAction.JOIN_ROOM, {
            name: "ROOM_NAME",
            attendeeName: "ATTENDEE_NAME_" + Date.now()
        });
    };
}

export function start() {
    return async (_dispatch: Dispatch, getState: () => RootState) => {
        try {
            // get local stream, show it in self-view and add it to be sent
            const state = getState();
            const stream = state.peers.self.videoMediaStream;

            if (!stream) return;
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });
        } catch (err) {
            console.error("error start() ", err);
        }
    };
}

function addPeerConnectionListeners(dispatch: Dispatch, getState: () => RootState) {
    // send any ice candidates to the other peer
    pc.onicecandidate = ({ candidate }) => {
        console.log("onicecandidate ", candidate);
        socketManager.send(RoomsAction.MESSAGE, {
            id: getActiveRoomId(getState()),
            attendeeId: getSelfPeerId(getState()),
            candidate
        });
    };

    // let the "negotiationneeded" event trigger offer generation
    pc.onnegotiationneeded = async () => {
        try {
            await pc.setLocalDescription(await pc.createOffer());
            console.log("Local Descriptor = ", pc.localDescription);
            // send the offer to the other peer
            socketManager.send(RoomsAction.MESSAGE, {
                id: getActiveRoomId(getState()),
                attendeeId: getSelfPeerId(getState()),
                desc: pc.localDescription
            });
        } catch (err) {
            console.error(err);
        }
    };

    // once remote track media arrives, show it in remote video element
    pc.ontrack = event => {
        dispatch(
            createSetPeerVideoStreamAction({
                peerId: "peer-1",
                stream: event.streams[0]
            })
        );
    };
}
