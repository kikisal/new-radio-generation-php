/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 * 
 * AudioPlayer
 * @version 1.0.0 - Basic Stock Audio API Browser feature manipulatiton.
 * @deprecated
 */
((m) => {

    class AudioPlayer extends Module {
        constructor() {
            super('AudioPlayer');
            this._currentSoundBox = null;
            this._audioElement    = new Audio();
            

            this._soundBoxTable   = new Map();

            this._isLoaded        = false;
            this._isLoading       = false;

            this._audioElement.addEventListener('error', this.onAudioError.bind(this));
            this._audioElement.addEventListener('play',  this.onAudioPlay.bind(this));
            this._audioElement.addEventListener('pause', this.onAudioPause.bind(this));
            
            this._audioElement.addEventListener('loadeddata', this.onAudioLoad.bind(this));
        }


        onAudioPlay() {
            this.fireEvent('play');
        }
        
        onAudioPause() {
            this.fireEvent('pause');
        }

        onAudioError(e) {
            this._isLoaded  = false;
            this._isLoading = false;

            this.fireEvent('error');
        }

        onAudioLoad() {
            this._isLoaded  = true;
            this._isLoading = false;

            this.fireEvent('loaded');
        }

        ready() {
            return this._isLoaded;
        }

        play() {
            if (!this.ready())
                return false;

            if (this._audioElement.paused)
                this._audioElement.play();
            else
                this._audioElement.pause();
            
            return true;
        }

        pause() {
            if (!this.ready())
                return false;

            this._audioElement.pause();
            return true;
        }

        fireEvent(event) {
            if (!this._currentSoundBox)
                return;
            
            try {
                switch(event) {
                    case 'dispatch': {
                        this._currentSoundBox.objKey.onAudioDispatch();
                        break;
                    }
                    case 'loaded': {
                        this._currentSoundBox.objKey.onAudioLoaded();
                        break;
                    }
                    case 'loading': {
                        this._currentSoundBox.objKey.onAudioLoading();
                        break;
                    }
                    case 'play': {
                        this._currentSoundBox.objKey.onAudioPlay();
                        break;
                    }
                    case 'pause': {
                        this._currentSoundBox.objKey.onAudioPause();
                        break;
                    }
                    case 'error': {
                        this._currentSoundBox.objKey.onAudioError();
                        break;
                    }

                }
            } catch(exception) {
                console.error(`[AudioPlayer Exception]: ${exception}`);
            }
    
        }

        isSoundBoxLoaded(sb) {
            return this._currentSoundBox == sb && this._isLoaded;
        }

        loadSoundBox(sb) {
            if (this._isLoading)
                return;

            if (this.isSoundBoxLoaded())
                return;

            this._isLoaded        = false;
            
            this.fireEvent('dispatch');

            this._currentSoundBox = sb;

            this.fireEvent('loading');

            this._isLoading        = true;
            this._audioElement.src = sb.url;
            this._audioElement.load();
        }
        
        static create() {
            return new AudioPlayer();
        }
    }

    class SoundBox {
        static create(objKey, url) {
            return {
                objKey, url
            };
        }
    }

    m.AudioPlayer = AudioPlayer;
    m.SoundBox    = SoundBox;

})(window);