export interface DevicesStore {
    microphones: MediaDeviceInfo[];
    cameras: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
    selectedMicrophone?: MediaDeviceInfo;
    selectedCamera?: MediaDeviceInfo;
    selectedSpeaker?: MediaDeviceInfo;
}

export enum DevicesActions {
    SET_MICROPHONES = "SET_MICROPHONES",
    SET_CAMERAS = "SET_CAMERAS",
    SET_SPEAKERS = "SET_SPEAKERS",
    SET_SELECTED_MICROPHONE = "SET_SELECTED_MICROPHONE",
    SET_SELECTED_CAMERA = "SET_SELECTED_CAMERA",
    SET_SELECTED_SPEAKER = "SET_SELECTED_SPEAKER"
}

export interface SetMicrophonesAction {
    type: DevicesActions.SET_MICROPHONES;
    payload: MediaDeviceInfo[];
}

export interface SetCamerasAction {
    type: DevicesActions.SET_CAMERAS;
    payload: MediaDeviceInfo[];
}

export interface SetSpeakersAction {
    type: DevicesActions.SET_SPEAKERS;
    payload: MediaDeviceInfo[];
}

export interface SetSelectedMicrophoneAction {
    type: DevicesActions.SET_SELECTED_MICROPHONE;
    payload: MediaDeviceInfo;
}

export interface SetSelectedCameraAction {
    type: DevicesActions.SET_SELECTED_CAMERA;
    payload: MediaDeviceInfo;
}

export interface SetSelectedSpeakerAction {
    type: DevicesActions.SET_SELECTED_SPEAKER;
    payload: MediaDeviceInfo;
}

type DevicesActionsType =
    | SetMicrophonesAction
    | SetCamerasAction
    | SetSpeakersAction
    | SetSelectedMicrophoneAction
    | SetSelectedCameraAction
    | SetSelectedSpeakerAction;

const initialState: DevicesStore = {
    microphones: [],
    cameras: [],
    speakers: [],
    selectedMicrophone: undefined,
    selectedCamera: undefined,
    selectedSpeaker: undefined
};

export const devicesReducer = (state = initialState, action: DevicesActionsType) => {
    switch (action.type) {
        case DevicesActions.SET_MICROPHONES: {
            return Object.assign({}, state, {
                microphones: action.payload
            });
        }
        case DevicesActions.SET_CAMERAS: {
            return Object.assign({}, state, {
                cameras: action.payload
            });
        }
        case DevicesActions.SET_SPEAKERS: {
            return Object.assign({}, state, {
                speakers: action.payload
            });
        }
        case DevicesActions.SET_SELECTED_MICROPHONE: {
            return Object.assign({}, state, {
                selectedMicrophone: action.payload
            });
        }
        case DevicesActions.SET_SELECTED_CAMERA: {
            return Object.assign({}, state, {
                selectedCamera: action.payload
            });
        }
        case DevicesActions.SET_SELECTED_SPEAKER: {
            return Object.assign({}, state, {
                selectedSpeaker: action.payload
            });
        }
        default:
            return Object.assign({}, state);
    }
};
