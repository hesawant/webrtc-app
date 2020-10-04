import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import { RootState } from "../redux";
import {
    createSetMicrophonesAction,
    createSetCamerasAction,
    createSetSpeakersAction,
    createSetSelectedMicrophoneAction,
    createSetSelectedCameraAction,
    createSetSelectedSpeakerAction
} from "../redux/device-actions";

import { createSetSelfAudioStreamAction, createSetSelfVideoStreamAction } from "../redux/peers-actions";

import "./devices.less";

interface MappedProps {
    microphones: MediaDeviceInfo[];
    cameras: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
    selectedMicrophone?: MediaDeviceInfo;
    selectedCamera?: MediaDeviceInfo;
    selectedSpeaker?: MediaDeviceInfo;
}

interface DispatchProps {
    setMicrophones: (payload: MediaDeviceInfo[]) => void;
    setCameras: (payload: MediaDeviceInfo[]) => void;
    setSpeakers: (payload: MediaDeviceInfo[]) => void;
    setSelectedMicrophone: (payload: MediaDeviceInfo) => void;
    setSelectedCamera: (payload: MediaDeviceInfo) => void;
    setSelectedSpeaker: (payload: MediaDeviceInfo) => void;
    setAudioMediaStream: (payload: MediaStream) => void;
    setVideoMediaStream: (payload: MediaStream) => void;
}

type Props = MappedProps & DispatchProps;

class Devices extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);

        this.handleMicrophoneSelect = this.handleMicrophoneSelect.bind(this);
        this.handleCameraSelect = this.handleCameraSelect.bind(this);
        this.handleSpeakerSelect = this.handleSpeakerSelect.bind(this);
    }

    componentDidMount() {
        this.populateDevices();
        this.getAudioMediaStreams();
        this.getVideoMediaStreams();
    }

    render() {
        const { microphones, cameras, speakers } = this.props;
        return (
            <div className="device-grid">
                <div>Microphone</div>
                <div>Cameras</div>
                <div>Speakers</div>

                <select
                    className="device-select"
                    name="microphones"
                    id="microphones"
                    onChange={this.handleMicrophoneSelect}
                >
                    {microphones.map(microphone => (
                        <option key={microphone.deviceId} value={microphone.deviceId}>
                            {microphone.label}
                        </option>
                    ))}
                </select>

                <select className="device-select" name="cameras" id="cameras" onChange={this.handleCameraSelect}>
                    {cameras.map(camera => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label}
                        </option>
                    ))}
                </select>

                <select className="device-select" name="speakers" id="speakers" onChange={this.handleSpeakerSelect}>
                    {speakers.map(speaker => (
                        <option key={speaker.deviceId} value={speaker.deviceId}>
                            {speaker.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    private async populateDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphones = devices.filter(device => device.kind === "audioinput");
        const cameras = devices.filter(device => device.kind === "videoinput");
        const speakers = devices.filter(device => device.kind === "audiooutput");

        const { setMicrophones, setCameras, setSpeakers } = this.props;
        setMicrophones(microphones);
        setCameras(cameras);
        setSpeakers(speakers);
    }

    private async getAudioMediaStreams(device?: MediaDeviceInfo) {
        const { setAudioMediaStream } = this.props;

        await navigator.mediaDevices
            .getUserMedia({
                audio: device
                    ? {
                          deviceId: { exact: device.deviceId }
                      }
                    : true
            })
            .then(mediaStream => {
                setAudioMediaStream(mediaStream);
            });
    }

    private async getVideoMediaStreams(device?: MediaDeviceInfo) {
        const { setVideoMediaStream } = this.props;

        await navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: 320,
                    height: 240,
                    deviceId: device ? { exact: device.deviceId } : undefined
                }
            })
            .then(mediaStream => {
                setVideoMediaStream(mediaStream);
            });
    }

    private handleMicrophoneSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { microphones, setSelectedMicrophone } = this.props;
        const selected = microphones.find(microphone => microphone.deviceId === event.target.value);
        setSelectedMicrophone(selected);
        this.getAudioMediaStreams(selected);
    }

    private handleCameraSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { cameras, setSelectedCamera } = this.props;
        const selected = cameras.find(camera => camera.deviceId === event.target.value);
        setSelectedCamera(selected);
        this.getVideoMediaStreams(selected);
    }

    private handleSpeakerSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { speakers, setSelectedSpeaker } = this.props;
        const selected = speakers.find(speaker => speaker.deviceId === event.target.value);
        setSelectedSpeaker(selected);
    }
}

const mapStateToProps = (state: RootState): MappedProps => ({
    microphones: state.devices.microphones,
    cameras: state.devices.cameras,
    speakers: state.devices.speakers,
    selectedMicrophone: state.devices.selectedMicrophone,
    selectedCamera: state.devices.selectedCamera,
    selectedSpeaker: state.devices.selectedSpeaker
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    setMicrophones: (payload: MediaDeviceInfo[]) => dispatch(createSetMicrophonesAction(payload)),
    setCameras: (payload: MediaDeviceInfo[]) => dispatch(createSetCamerasAction(payload)),
    setSpeakers: (payload: MediaDeviceInfo[]) => dispatch(createSetSpeakersAction(payload)),
    setSelectedMicrophone: (payload: MediaDeviceInfo) => dispatch(createSetSelectedMicrophoneAction(payload)),
    setSelectedCamera: (payload: MediaDeviceInfo) => dispatch(createSetSelectedCameraAction(payload)),
    setSelectedSpeaker: (payload: MediaDeviceInfo) => dispatch(createSetSelectedSpeakerAction(payload)),
    setAudioMediaStream: (payload: MediaStream) => dispatch(createSetSelfAudioStreamAction(payload)),
    setVideoMediaStream: (payload: MediaStream) => dispatch(createSetSelfVideoStreamAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
