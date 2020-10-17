export interface ActiveRoomStore {
    id?: string;
    name?: string;
}

export enum ActiveRoomActions {
    SET_ID = "SET_ID",
    SET_NAME = "SET_NAME"
}

const initialState: ActiveRoomStore = {
    id: undefined,
    name: undefined
};

export interface SetActiveRoomId {
    type: ActiveRoomActions.SET_ID;
    payload: string;
}

export interface SetActiveRoomName {
    type: ActiveRoomActions.SET_NAME;
    payload: string;
}

export type ActiveRoomActionsType = SetActiveRoomId | SetActiveRoomName;

export const activeRoomReducer = (state = initialState, action: ActiveRoomActionsType) => {
    switch (action.type) {
        case ActiveRoomActions.SET_ID: {
            return Object.assign({}, state, {
                id: action.payload
            });
        }
        case ActiveRoomActions.SET_NAME: {
            return Object.assign({}, state, {
                name: action.payload
            });
        }
        default:
            return Object.assign({}, state);
    }
};
