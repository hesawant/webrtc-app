import { RootState } from ".";

export const getActiveRoomId = (state: RootState) => state.activeRoom.id;
export const getActiveRoomName = (state: RootState) => state.activeRoom.name;
