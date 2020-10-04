import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import { RootState } from "../redux";

import Devices from "./devices";
import VideoTile from "./video-tile";

import { initPC, start } from "../lib/peer-connection";

import "./app.less";

interface MappedProps {
    selfVideoStream: MediaStream;
    peerVideoStream?: MediaStream;
}

interface DispatchProps {
    dispatchInitPC: () => void;
    dispatchStartCall: () => void;
}

type Props = MappedProps & DispatchProps;

class App extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props);
        this.handleStartCallClick = this.handleStartCallClick.bind(this);
    }

    componentDidMount() {
        this.props.dispatchInitPC();
    }

    render() {
        const { selfVideoStream, peerVideoStream } = this.props;

        return (
            <div>
                <Devices />
                <div>Self video</div>
                <VideoTile mediaStream={selfVideoStream} />
                <hr />
                <div>Peer video</div>
                {peerVideoStream && <VideoTile mediaStream={peerVideoStream} />}
                <button onClick={this.handleStartCallClick}>Start call</button>
            </div>
        );
    }

    private handleStartCallClick() {
        this.props.dispatchStartCall();
    }
}

const mapStateToProps = (state: RootState): MappedProps => ({
    selfVideoStream: state.peers.self.videoMediaStream,
    peerVideoStream: state.peers.byId["peer-1"]?.videoMediaStream
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    // TODO: Typecasting to any is a temp solution to TS compile errors.
    // https://github.com/reduxjs/redux-thunk/issues/103
    dispatchInitPC: () => dispatch(initPC() as any),
    dispatchStartCall: () => dispatch(start() as any)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
