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

            this._ctaSpanElement    = this._radioBarOverlay.querySelector('.cta span');
            this._ctaTextContent    = this._ctaSpanElement.textContent;
            
            this._playAfterLoaded   = false;
            this._audioError        = false;

            this._playButton.addEventListener('click', this.onPlayButtonClick.bind(this));
        }

        onAudioPlay() {
            if (this._playAfterLoaded)
                this._playAfterLoaded = false;
            
            this._playIcon.classList.add('playing');
        }

        onAudioPause() {
            this._playIcon.classList.remove('playing');
        }
        
        onAudioLoaded() {
            this._playButton.classList.remove('loading');
        
            this._playButton.classList.add('loaded');
            if (this._playAfterLoaded)
                this.getAudioPlayer().play();
        }

        onAudioLoading() {
            this._playButton.classList.add('loading');
        }
        
        onAudioError() {
            this._playButton.classList.add('error');
            this._audioError = true;

            this._ctaSpanElement.textContent = 'Qualcosa è andato storto, riprova più tardi!';

            setTimeout(() => {
                if (this._audioError) { 
                    this._audioError = false;
                    this._playButton.classList.remove('error');
                    this._playButton.classList.remove('loading');
                    this._ctaSpanElement.textContent = this._ctaTextContent;
                }
            }, 5000);
        }
        
        onAudioDispatch() {

        }
        
        onPlayButtonClick() {
            if (this._audioError) 
                return;
            

            this._soundBoxLoaded = this.getAudioPlayer().isSoundBoxLoaded(this.getSoundBox());
            if (!this._soundBoxLoaded) {
                this._playAfterLoaded = true;
                this.getAudioPlayer().loadSoundBox(this.getSoundBox());
            } else {
                this.getAudioPlayer().play();
            }
        }

        streamingUrl() {
            return this._radioStreamingURL;
        }

        getAudioPlayer() {
            return this._audioPlayer;
        }

        getSoundBox() {
            return this._soundBox;
        }

        static create(overlay) {
            return new RadioBar(overlay);
        }
    }

    m.RadioBar = RadioBar;

})(window);