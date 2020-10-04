import * as React from "react";

import "./video-tile.less";

interface PassedProps {
    mediaStream: MediaStream;
}

type Props = PassedProps;

export default class VideoTile extends React.Component<Props, {}> {
    private videoRef: React.RefObject<HTMLVideoElement> = React.createRef<HTMLVideoElement>();

    componentDidMount() {
        this.attachMediaStream();
    }

    componentDidUpdate() {
        this.attachMediaStream();
    }

    componentWillUnmount() {
        this.releaseMediaStream();
    }

    render() {
        return <video className="video-tile" ref={this.videoRef} />;
    }

    private attachMediaStream() {
        const { mediaStream } = this.props;
        if (this.videoRef.current) {
            this.releaseMediaStream();
            this.videoRef.current.srcObject = mediaStream;
            this.videoRef.current.play();
        }
    }

    private releaseMediaStream() {
        if (this.videoRef.current) {
            this.videoRef.current.pause();
            this.videoRef.current.srcObject = null;
        }
    }
}
