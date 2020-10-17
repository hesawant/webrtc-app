import { RootState } from ".";

export const getSelfPeerId = (state: RootState) => state.peers.self.id;
