/**
 * Radio Bar by weeki
 * @verion 1.0.0
 */
((m) => {
    class RadioBar extends Module /** implements ISoundBox */ {
        constructor(overlay) {
            super('RadioBar');

            this._overlayTarget   = overlay;

            // dom elements
            this._radioBarOverlay = domSelect(overlay);

            
            this._radioStreamingURL = window.rg_config.RADIO_STREAMING_URL;
            this._audioPlayer       = this.getModule('AudioPlayer');
            
            this._soundBox          = SoundBox.create(this, this._radioStreamingURL);
            
            this._playButton        = this._radioBarOverlay.querySelector('[--play-button]');
            this._playIcon          = this._radioBarOverlay.querySelector('[--play-icon]');

            this._playerPlaying     = false;

            this._playButton.addEventListener('click', this.onPlayButtonClick.bind(this));
        }

        getAudioPlayer() {
            return this._audioPlayer;
        }

        getSoundBox() {
            return this._soundBox;
        }

        onAudioPlay() {
            this._playIcon.classList.add('playing');
        }

        onAudioPause() {
            this._playIcon.classList.remove('playing');
        }
        
        onAudioLoaded() {
            this._playButton.classList.add('loaded');
        }
        
        onAudioLoaded() {
            console.log('RADIO-BAR: AUDIO ERROR THROWN');
        }
        
        
        onPlayButtonClick() {
            this._playerPlaying = this.getAudioPlayer().play(this.getSoundBox());
        }

        streamingUrl() {
            return this._radioStreamingURL;
        }

        static create(overlay) {
            return new RadioBar(overlay);
        }
    }

    m.RadioBar = RadioBar;

})(window);