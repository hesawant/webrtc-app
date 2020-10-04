import {
    SetSelfMuted,
    SetSelfVideoEnabled,
    SetSelfAudioStream,
    SetSelfVideoStream,
    SetPeerMuted,
    SetPeerVideoEnabled,
    SetPeerAudioStream,
    SetPeerVideoStream,
    PeerMutedPayload,
    PeerVideoEnabledPayload,
    PeerStreamPayload,
    PeersActions
} from "./peers-store";

export function createSetSelfMutedAction(payload: boolean): SetSelfMuted {
    return {
        type: PeersActions.SET_SELF_MUTED,
        payload
    };
}

export function createSetSelfVideoEnabledAction(payload: boolean): SetSelfVideoEnabled {
    return {
        type: PeersActions.SET_SELF_VIDEO_ENABLED,
        payload
    };
}

export function createSetSelfAudioStreamAction(payload: MediaStream): SetSelfAudioStream {
    return {
        type: PeersActions.SET_SELF_AUDIO_STREAM,
        payload
    };
}

export function createSetSelfVideoStreamAction(payload: MediaStream): SetSelfVideoStream {
    return {
        type: PeersActions.SET_SELF_VIDEO_STREAM,
        payload
    };
}

export function createSetPeerMutedAction(payload: PeerMutedPayload): SetPeerMuted {
    return {
        type: PeersActions.SET_PEER_MUTED,
        payload
    };
}

export function createSetPeerVideoEnabledAction(payload: PeerVideoEnabledPayload): SetPeerVideoEnabled {
    return {
        type: PeersActions.SET_PEER_VIDEO_ENABLED,
        payload
    };
}

export function createSetPeerAudioStreamAction(payload: PeerStreamPayload): SetPeerAudioStream {
    return {
        type: PeersActions.SET_PEER_AUDIO_STREAM,
        payload
    };
}

export function createSetPeerVideoStreamAction(payload: PeerStreamPayload): SetPeerVideoStream {
    return {
        type: PeersActions.SET_PEER_VIDEO_STREAM,
        payload
    };
}
