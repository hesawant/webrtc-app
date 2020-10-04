import { Dispatch } from "redux";
import { SocketManager } from "../lib/socket-manager";

import { RootState } from "../redux";
import { createSetPeerVideoStreamAction } from "../redux/peers-actions";

const socketManager: SocketManager = new SocketManager();

// public STUN servers list → https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const pc = new RTCPeerConnection(configuration);

// https://www.html5rocks.com/en/tutorials/webrtc/basics/
export function initPC() {
    return (dispatch: Dispatch, getState: () => RootState) => {
        // send any ice candidates to the other peer
        pc.onicecandidate = ({ candidate }) => {
            console.log("ICE Candidate = ", candidate);
            socketManager.send(JSON.stringify({ candidate }));
        };

        // let the "negotiationneeded" event trigger offer generation
        pc.onnegotiationneeded = async () => {
            try {
                await pc.setLocalDescription(await pc.createOffer());
                console.log("Local Descriptor = ", pc.localDescription);
                // send the offer to the other peer
                socketManager.send(JSON.stringify({ desc: pc.localDescription }));
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

        socketManager.recv(async (message: string) => {
            const { desc, candidate } = JSON.parse(message);
            // console.log("desc received = ", desc);
            // console.log("candidate received = ", candidate);
            try {
                if (desc) {
                    // if we get an offer, we need to reply with an answer
                    if (desc.type === "offer") {
                        await pc.setRemoteDescription(desc);

                        const state = getState();
                        const stream = state.peers.self.videoMediaStream;

                        if (!stream) return;

                        stream.getTracks().forEach(track => pc.addTrack(track, stream));

                        await pc.setLocalDescription(await pc.createAnswer());

                        socketManager.send(JSON.stringify({ desc: pc.localDescription }));
                    } else if (desc.type === "answer") {
                        await pc.setRemoteDescription(desc);
                    } else {
                        console.log("Unsupported SDP type.");
                    }
                } else if (candidate) {
                    await pc.addIceCandidate(candidate);
                }
            } catch (err) {
                console.error(err);
            }
        });
    };
}

export function start() {
    return (_dispatch: Dispatch, getState: () => RootState) => {
        try {
            // get local stream, show it in self-view and add it to be sent
            const state = getState();
            const stream = state.peers.self.videoMediaStream;

            if (!stream) return;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        } catch (err) {
            console.error(err);
        }
    };
}
