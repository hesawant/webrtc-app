import { SetActiveRoomId, SetActiveRoomName, ActiveRoomActions } from "./active-room-store";

export function createSetActiveRoomId(payload: string): SetActiveRoomId {
    return {
        type: ActiveRoomActions.SET_ID,
        payload
    };
}
export function createSetActiveRoomName(payload: string): SetActiveRoomName {
    return {
        type: ActiveRoomActions.SET_NAME,
        payload
    };
}
