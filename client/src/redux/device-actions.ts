import {
    SetMicrophonesAction,
    SetCamerasAction,
    SetSpeakersAction,
    SetSelectedMicrophoneAction,
    SetSelectedCameraAction,
    SetSelectedSpeakerAction,
    DevicesActions
} from "./devices-store";

export function createSetMicrophonesAction(payload: MediaDeviceInfo[]): SetMicrophonesAction {
    return {
        type: DevicesActions.SET_MICROPHONES,
        payload
    };
}

export function createSetCamerasAction(payload: MediaDeviceInfo[]): SetCamerasAction {
    return {
        type: DevicesActions.SET_CAMERAS,
        payload
    };
}

export function createSetSpeakersAction(payload: MediaDeviceInfo[]): SetSpeakersAction {
    return {
        type: DevicesActions.SET_SPEAKERS,
        payload
    };
}

export function createSetSelectedMicrophoneAction(payload: MediaDeviceInfo): SetSelectedMicrophoneAction {
    return {
        type: DevicesActions.SET_SELECTED_MICROPHONE,
        payload
    };
}

export function createSetSelectedCameraAction(payload: MediaDeviceInfo): SetSelectedCameraAction {
    return {
        type: DevicesActions.SET_SELECTED_CAMERA,
        payload
    };
}

export function createSetSelectedSpeakerAction(payload: MediaDeviceInfo): SetSelectedSpeakerAction {
    return {
        type: DevicesActions.SET_SELECTED_SPEAKER,
        payload
    };
}
