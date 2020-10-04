require("es6-promise").polyfill();
require("isomorphic-fetch");

// Below block of code enables Hot module replacement only for local debugging.
declare const WEBPACK_DEFINE_ENABLE_HMR;
if (WEBPACK_DEFINE_ENABLE_HMR) {
    require("react-hot-loader/patch");
}

import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import { Store } from "redux";
import { Provider } from "react-redux";
import { rootStore } from "./redux";

import App from "./components/app";

interface Props {
    store: Store<any>;
}

export class Root extends React.Component<Props, {}> {
    render() {
        return (
            <Provider store={this.props.store}>
                <App />
            </Provider>
        );
    }
}

const HotRoot = hot(module)(Root);

const render = () => {
    ReactDOM.render(<HotRoot store={rootStore}></HotRoot>, document.getElementById("container"));
};

/* Initial render showing a progress bar */
render();
