export interface Peer {
    id: string;
    muted: boolean;
    videoEnabled: boolean;
    audioMediaStream?: MediaStream;
    videoMediaStream?: MediaStream;
}

export interface PeersStore {
    self: Peer;
    byId: { [key: string]: Peer };
}

export enum PeersActions {
    SET_SELF_ID = "SET_SELF_ID",
    SET_SELF_MUTED = "SET_SELF_MUTED",
    SET_SELF_VIDEO_ENABLED = "SET_SELF_VIDEO_ENABLED",
    SET_SELF_AUDIO_STREAM = "SET_SELF_AUDIO_STREAM",
    SET_SELF_VIDEO_STREAM = "SET_SELF_VIDEO_STREAM",

    SET_PEER_MUTED = "SET_PEER_MUTED",
    SET_PEER_VIDEO_ENABLED = "SET_PEER_VIDEO_ENABLED",
    SET_PEER_AUDIO_STREAM = "SET_PEER_AUDIO_STREAM",
    SET_PEER_VIDEO_STREAM = "SET_PEER_VIDEO_STREAM"
}

const initialState: PeersStore = {
    self: {
        id: "",
        muted: false,
        videoEnabled: false,
        audioMediaStream: undefined,
        videoMediaStream: undefined
    },
    byId: {}
};

export interface SetSelfId {
    type: PeersActions.SET_SELF_ID;
    payload: string;
}

export interface SetSelfMuted {
    type: PeersActions.SET_SELF_MUTED;
    payload: boolean;
}

export interface SetSelfVideoEnabled {
    type: PeersActions.SET_SELF_VIDEO_ENABLED;
    payload: boolean;
}

export interface SetSelfAudioStream {
    type: PeersActions.SET_SELF_AUDIO_STREAM;
    payload?: MediaStream;
}

export interface SetSelfVideoStream {
    type: PeersActions.SET_SELF_VIDEO_STREAM;
    payload?: MediaStream;
}

export interface PeerMutedPayload {
    peerId: string;
    muted: boolean;
}

export interface SetPeerMuted {
    type: PeersActions.SET_PEER_MUTED;
    payload: PeerMutedPayload;
}

export interface PeerVideoEnabledPayload {
    peerId: string;
    videoEnabled: boolean;
}

export interface SetPeerVideoEnabled {
    type: PeersActions.SET_PEER_VIDEO_ENABLED;
    payload: PeerVideoEnabledPayload;
}

export interface PeerStreamPayload {
    peerId: string;
    stream?: MediaStream;
}

export interface SetPeerAudioStream {
    type: PeersActions.SET_PEER_AUDIO_STREAM;
    payload: PeerStreamPayload;
}

export interface SetPeerVideoStream {
    type: PeersActions.SET_PEER_VIDEO_STREAM;
    payload: PeerStreamPayload;
}

export type PeersActionsType =
    | SetSelfId
    | SetSelfMuted
    | SetSelfVideoEnabled
    | SetSelfAudioStream
    | SetSelfVideoStream
    | SetPeerMuted
    | SetPeerVideoEnabled
    | SetPeerAudioStream
    | SetPeerVideoStream;

export const peersReducer = (state = initialState, action: PeersActionsType) => {
    switch (action.type) {
        case PeersActions.SET_SELF_ID: {
            return Object.assign({}, state, {
                self: {
                    ...state.self,
                    id: action.payload
                }
            });
        }
        case PeersActions.SET_SELF_MUTED: {
            return Object.assign({}, state, {
                self: {
                    ...state.self,
                    muted: action.payload
                }
            });
        }
        case PeersActions.SET_SELF_VIDEO_ENABLED: {
            return Object.assign({}, state, {
                self: {
                    ...state.self,
                    videoEnabled: action.payload
                }
            });
        }
        case PeersActions.SET_SELF_AUDIO_STREAM: {
            return Object.assign({}, state, {
                self: {
                    ...state.self,
                    audioMediaStream: action.payload
                }
            });
        }
        case PeersActions.SET_SELF_VIDEO_STREAM: {
            return Object.assign({}, state, {
                self: {
                    ...state.self,
                    videoMediaStream: action.payload
                }
            });
        }

        case PeersActions.SET_PEER_MUTED: {
            return Object.assign({}, state, {
                byId: {
                    ...state.byId,
                    [action.payload.peerId]: {
                        ...state.byId[action.payload.peerId],
                        videoMediaStream: action.payload.muted
                    }
                }
            });
        }
        case PeersActions.SET_PEER_VIDEO_ENABLED: {
            return Object.assign({}, state, {
                byId: {
                    ...state.byId,
                    [action.payload.peerId]: {
                        ...state.byId[action.payload.peerId],
                        videoMediaStream: action.payload.videoEnabled
                    }
                }
            });
        }
        case PeersActions.SET_PEER_AUDIO_STREAM: {
            return Object.assign({}, state, {
                byId: {
                    ...state.byId,
                    [action.payload.peerId]: {
                        ...state.byId[action.payload.peerId],
                        videoMediaStream: action.payload.stream
                    }
                }
            });
        }
        case PeersActions.SET_PEER_VIDEO_STREAM: {
            return Object.assign({}, state, {
                byId: {
                    ...state.byId,
                    [action.payload.peerId]: {
                        ...state.byId[action.payload.peerId],
                        videoMediaStream: action.payload.stream
                    }
                }
            });
        }
        default:
            return Object.assign({}, state);
    }
};
