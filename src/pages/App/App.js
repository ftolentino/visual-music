import React from 'react';

// import Error from '../../components/Error/Error';
// import SoundPlayer from '../../components/SoundPlayer/SoundPlayer.component';
import Visualizer from '../../components/Visualizer/Visualizer.component';
import PlayerBar from '../../components/PlayerBar/PlayerBar';
import classes from './App.module.scss';
// import UploadSong from '../../components/UploadSong/UploadSong';
import HamburgerToggle from '../../components/HamburgerToggle/HamburgerToggle';
import VisualPanel from '../../components/VisualPanel/VisualPanel';

let soundReset = {
    isPlaying: false
};

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            uploadedSong: null,
            isSongLoaded: false,
            volume: 0.5,
            ...soundReset,
            togglePanel: false
        };
    }

    /********************************************
        Handles changing of volume state upon
        slider interaction. State changes are sent to
        sketch file adjusting the sound's actual
        volume to change ellipse diameter on redraw.
    ********************************************/
    onVolumeChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    /*********************************************
        Handles toggling of pause/play button.
        Used to monitor if the user wants to pause/play
        the loaded sound. State changes are sent to
        sketch file which executes a .pause() or .play()
        command.
    *********************************************/
    onPlayPress = event => {
        const { uploadedSong } = this.state;

        if (uploadedSong) {
            this.setState({ isPlaying: !this.state.isPlaying }, () => {
                this.setState({
                    buttonText: this.state.isPlaying ? 'Pause' : 'Play'
                });
            });
        } else {
            alert('No file loaded');
        }
    };

    /********************************************
        Uploaded audio file duration converted in
        to proper format e.g. 3:14
    ********************************************/
    getTime(dur) {
        return (
            Math.floor(dur / 60) + ':' + ('0' + Math.floor(dur % 60)).slice(-2)
        );
    }

    /********************************************
        Handle file uploads. Uploaded file is saved
        as state and is passed down to the sketch file as props.
        Sketch then loads the file using p5.Sound library.
    *********************************************/
    onFileUpload = event => {
        const song = event.target.files[0];
        let blobUrl = URL.createObjectURL(song);
        let audio = this.player;
        audio.src = blobUrl;
        audio.preload = 'metadata';
        audio.addEventListener('loadedmetadata', () => {
            this.setState({ duration: this.getTime(audio.duration) });
        });
        this.setState({
            uploadedSong: song,
            isSongLoaded: true,
            volume: audio.volume,
            ...soundReset
        });
    };

    /********************************************
        Handle hamburger toggle callback. When 
        hamburger toggle's state changed, we need
        to set togglePanel state
    *********************************************/
    onTogglePanel = toggleState => {
        this.setState({ togglePanel: toggleState });
    };

    render() {
        const {
            uploadedSong,
            isSongLoaded,
            duration,
            volume,
            isPlaying,
            onSongEnd,
            togglePanel
        } = this.state;
        return (
            <div className={classes.pageContainer}>
                <div className={classes.visualContainer}>
                    <div
                        className={`${classes.visualmusic} ${
                            togglePanel ? classes.shrink : ''
                        }`}
                    >
                        <div className={classes.hamburger}>
                            <HamburgerToggle
                                initToggle={this.state.togglePanel}
                                onClick={this.onTogglePanel}
                            />
                        </div>
                        <Visualizer
                            volume={volume}
                            isPlaying={isPlaying}
                            uploadedSong={uploadedSong}
                            onSongEnd={onSongEnd}
                        />
                    </div>
                    <div
                        className={`${classes.visualPanel} ${
                            togglePanel ? classes.slideIn : ''
                        }`}
                    >
                        <VisualPanel />
                    </div>
                </div>
                <div>
                    <audio id="audio" ref={ref => (this.player = ref)}></audio>
                </div>
                <div className={classes.bar}>
                    <PlayerBar
                        volume={volume}
                        onVolumeChange={this.onVolumeChange}
                        onFileUpload={this.onFileUpload}
                        onPlayPress={this.onPlayPress}
                        isPlaying={isPlaying}
                        uploadedSong={uploadedSong}
                        isSongLoaded={isSongLoaded}
                        duration={duration}
                    />
                </div>
            </div>
        );
    }
}

export default App;
