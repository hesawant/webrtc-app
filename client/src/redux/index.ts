import { applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";

import { devicesReducer, DevicesStore } from "./devices-store";
import { peersReducer, PeersStore } from "./peers-store";

export interface RootState {
    devices: DevicesStore;
    peers: PeersStore;
}

const rootReducer = combineReducers({
    devices: devicesReducer,
    peers: peersReducer
});

export const rootStore = createStore(rootReducer, applyMiddleware(thunk));

// This is for quick access to store in console
(window as any).store = rootStore;
