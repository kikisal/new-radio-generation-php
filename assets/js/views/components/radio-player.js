((m) => {

 
    class PlayerAudioTitle extends StatefulComponent {

        constructor({title}) {
            super({
                title
            });
        }

        onViewCreated() {
            this.setClassList(['radio-player-title']);
            this.setKey('play-audio-title');
        }

        render() {
            if ('state' in this.getState() && this.getState().state == 'error')
                this.getViewElement().classList.add('error');
            else
                this.getViewElement().classList.remove('error');

            this.setTextContent(this.getState().title);
        }
    }

    class PlayerCircleView extends CustomComponent {
        constructor() {
            super();
            this._mode = 'pause';
        }

        onViewCreated() {
            this.setClassList(['radio-player-play-circle']);
            this.setKey('play-circle');
        }

        onStateUpdate(state) {
            this._mode = state.mode;
            return true;
        }

        render() {
            const viewElement = this.getViewElement();
            switch(this._mode) {
                case 'pause': {
                    viewElement.classList.remove('playing');
                    viewElement.classList.remove('loading');
                    viewElement.classList.remove('error');
                    break;
                }

                case 'loading':
                {

                    viewElement.classList.add('loading');
                    viewElement.classList.remove('playing');
                    viewElement.classList.remove('error');
                    break;
                }

                case 'error': {
                    viewElement.classList.remove('loading');
                    viewElement.classList.remove('playing');
                    viewElement.classList.add('error');
                    break;
                }

                case 'playing': {
                    viewElement.classList.add('playing');
                    viewElement.classList.remove('loading');
                    viewElement.classList.remove('error');
                    break;
                }
            }

            return this.markup_builder({
                    component: 'div',
                    classList: ['player-play-icon'],    
                }
            );
        }
    }

    class TimelineComponent extends CustomComponent {
        constructor() {
            super();
        }

        onViewCreated() {
            this.setClassList(['radio-player-timeline']);
            this.setKey('timeline');
        }

        render() {
            this.markup_builder({
                component: 'div',
                classList: ['radio-player-timeline-bar']
            });
        }
    }

    class RadioPlayerView extends CustomComponent /** implements ISoundBox */ {
        constructor({audioUrl, audioCoverUrl, audioTitle}) {
            super();
            this._audioUrl      = audioUrl;
            this._audioCoverUrl = audioCoverUrl;
            this._audioTitle    = audioTitle;
            
            this._audioPlayer   = null;
            this._soundBox      = SoundBox.create(this, audioUrl);

            this._timelineInterval      = setInterval(this.onUpdate.bind(this), 16.6666667);

            this._onMouseUpEvent        = this.onMouseUp.bind(this);
            this._onTouchEndEvent       = this.onTouchEnd.bind(this);

            this._onMouseMoveEvent      = this.onMouseMove.bind(this);
            this._onTouchMoveEvent      = this.onTouchMove.bind(this);
            

            // refs
            this._playComponent         = null;
            this._titleComponent        = null;
            this._timelineComponent     = null;
            this._timelineBar           = null;
            this._timeSpan              = null;
            
            this._soundBoxLoaded        = false;
            this._playAfterLoaded       = true;
            this._audioError            = false;

            this._mouseMoving           = false;
            this._mouseDown             = false;
            this._mouseX                = undefined;
        }

        safeTime(time) {
            if (isNaN(time))
                time = 0;

            if (time >= 1)
                time = 1;
            else if (time < 0)
                time = 0;

            return time;
        }

        formatTwo(n) {
            if (n < 10)
                return '0' + n;
            else 
                return n;
        }
        
        formatTime(time) {
            
            const seconds = Math.floor(time) % 60;
            const minutes = Math.floor(time / 60) % 60;

            return this.formatTwo(minutes) + ':' + this.formatTwo(seconds);
        }

        _clamp(n) {
            if (n < 0)
                return 0;
            if (n >= 1)
                return 1;
            
            return n;
        }

        smallScreen() {
            return window.innerWidth < 800;
        }

        onUpdate() {
            const timeline    = this.getTimeline();
            const timelineBar = this.getTimelineBar();
            const timeSpan    = this.getTimeSpan();

            if (!timeline || !timelineBar || !timeSpan)
                return;
            
            if (this.getAudioPlayer().getCurrentSoundBox() !== this.getSoundBox()) {
                timelineBar.style.width = '0%';
                timeSpan.innerText      = '00:00';
                return;
            }
            
            if (!this.getAudioPlayer().ready()) {
                timelineBar.style.width = '0%';
                timeSpan.innerText      = '00:00';
            } else {

                if (this._mouseDown && this._mouseMoving) {
                    if (this.smallScreen())
                        document.body.classList.add('lock-scrollbar');

                    this.getAudioPlayer().pause();

                    const pos = timeline.getBoundingClientRect().x;
                    const width = timeline.getBoundingClientRect().width;
                    
                    const offset = this._mouseX - pos;

                    const factor = this._clamp(offset / width);
                    const time   = factor * this.getAudioPlayer().duration();
                    const formattedTime = this.formatTime(time);

                    this.getAudioPlayer().setTime(time);

                    timelineBar.style.width = factor * 100 + '%';
                    timeSpan.innerText      = formattedTime;

                    return;
                } 

                if (this.smallScreen())
                    document.body.classList.remove('lock-scrollbar');
                
                const time = this.safeTime(this.getAudioPlayer().normalizedTime());
                const formattedTime = this.formatTime(this.getAudioPlayer().currentTime());

                timelineBar.style.width = time * 100 + '%';
                timeSpan.innerText      = formattedTime;

            }
        }

        onViewCreated() {
            this._audioPlayer = this.getRenderer().getModule('AudioPlayer');

            this.setClassList(['radio-player']);
            this.addEventListener('click', this.onClick.bind(this));

            this.addEventListener('touchstart', this.onTouchStart.bind(this));
            this.addEventListener('touchend',   this.onTouchEnd.bind(this));
            
            this.addEventListener('mousedown',  this.onMouseDown.bind(this));
            this.addEventListener('mouseup',    this.onMouseUp.bind(this));
            

            window.addEventListener('touchmove',  this._onTouchMoveEvent.bind(this));
            window.addEventListener('mousemove',  this._onMouseMoveEvent.bind(this));
            window.addEventListener('mouseup',    this._onMouseUpEvent);
            window.addEventListener('touchend',   this._onTouchEndEvent);
            
        }

        onTouchMove(e) {
            const touch = e.targetTouches[0];
            if (!touch)
                return;
           
            this._mouseMoving = true;
            this._mouseX      = touch.clientX;
        }
        
        onTouchStart(e) {
            const touch = e.targetTouches[0];
            if (!touch)
                return;
            
            const timeline = this.getTimeline();
            if (!timeline)
                return;

            if (timeline.contains(touch.target)) {
                this._mouseDown = true;
                this._mouseX    = touch.clientX;
            }
        }

        onTouchEnd(e) {
            this._mouseDown   = false;
            this._mouseMoving = false;
        }

        onMouseMove(e) {
            this._mouseMoving = true;
            this._mouseX = e.clientX;
        }

        onMouseDown(e) {
            
            const timeline = this.getTimeline();
            if (!timeline)
                return;

            if (timeline.contains(e.target)) {
                this._mouseDown = true;
                this._mouseX = e.clientX;
            }
        }

        onMouseUp(e) {
            this._mouseDown = false;
            this._mouseMoving = false;
        }

        onClick(e) {
            if (this._audioError)
                return;

            const play = this.getPlayComponent();
            if (!play)
                return;

            if (play.getViewElement().contains(e.target))
                this.togglePlayAudio();
        }

        togglePlayAudio() {
            this._soundBoxLoaded = this.getAudioPlayer().isSoundBoxLoaded(this.getSoundBox());
            if (!this._soundBoxLoaded) {
                this._playAfterLoaded = true;
                this.getAudioPlayer().loadSoundBox(this.getSoundBox());    
            } else {
                this.getAudioPlayer().play();
            }
        }
        
        getPlayComponent() {
            if (!this._playComponent)
                this._playComponent = this.getByKey('play-circle');
        
            return this._playComponent;
        }

        getTitleComponent() {
            if (!this._titleComponent)
                this._titleComponent = this.getByKey('play-audio-title');
        
            return this._titleComponent;
        }

        getTimeline() {
            if (!this._timelineComponent)
                this._timelineComponent = this.getByKey('timeline');

            const tcomp = this._timelineComponent.getViewElement();

            if (tcomp && !this._timelineBar)
                this._timelineBar = tcomp.querySelector('.radio-player-timeline-bar');
        
            if (this._timelineComponent && tcomp)
                return this._timelineComponent.getViewElement();
            else 
                return null;
        }

        getTimelineBar() {
            return this._timelineBar;
        }

        getTimeSpan() {
            if (this._timeSpan)
                return this._timeSpan;

            const view = this.getViewElement();
            if (!view)
                return null;
            
            return this._timeSpan = view.querySelector('.timeline-time span');;
        }

        render() {
            this.markup_builder({
                extractAll: true,
                component: 'div',
                children: [
                    {
                        component: 'div',
                        classList: ['radio-player-box', 'flex', 'column'],
                        children: [
                            {
                                component: 'div',
                                classList: ['flex', 'radio-media-container'],
                                children: [
                                    {
                                        component: 'div',
                                        classList: ['radio-cover'],
                                        children: [
                                            {
                                                component: 'div',
                                                classList: ['radio-conver-image-container'],
                                                children: [
                                                    {
                                                        component: 'div',
                                                        classList: ['radio-cover-image', 'default']
                                                    },
                                                ]
                                            },
                                            this.markupComponent(PlayerCircleView),
                                        ]
                                    },
                                    {
                                        component: 'div',
                                        classList: ['radio-content'],
                                        children: [
                                            this.markupComponent(PlayerAudioTitle, {title: this._audioTitle}),
                                            {
                                                component: 'div',
                                                classList: ['timeline-time'],
                                                children: [
                                                    {
                                                        component: 'span',
                                                        textContent: '00:00'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                ]
                            },
                            this.markupComponent(TimelineComponent),
                        ]
                    }
                ]
            }, false);

            // .radio-player-play-circle

        }

        onAudioPlay() {
            try {
                this.getPlayComponent().updateState({mode: 'playing'});
            } catch(ex) {
                console.log('[RadioPlayer Exception]: ', ex);
            }
        }

        onAudioPause() {
            try {
                this.getPlayComponent().updateState({mode: 'pause'});
            } catch(ex) {
                console.log('[RadioPlayer Exception]: ', ex);
            }
        }
        
        onAudioLoaded() {
            try {
                this.getPlayComponent().updateState({mode: 'pause'});
            } catch(ex) {
                console.log('[RadioPlayer Exception]: ', ex);
            }

            if (this._playAfterLoaded) {
                this._playAfterLoaded = false;
                this.getAudioPlayer().play();
            }
        }

        onAudioLoading() {
            const playComponent = this.getPlayComponent();
            if (!playComponent)
                return;

            playComponent.updateState({mode: 'loading'});
        }

        onAudioError() {
            this._audioError = true;
            
            try {
                this.getPlayComponent().updateState({mode: 'error'});
                this.getTitleComponent().updateState({title: 'Qualcosa è andata storta! Riprova più tardi', state: 'error'});
            } catch(ex) {
                console.log('[RadioPlayer Exception]: ', ex);
            }

            setTimeout(() => {
                if (this._audioError) {
                    this._audioError = false;
                    this.getPlayComponent().updateState({mode: 'pause'});
                    this.getTitleComponent().updateState({title: this._audioTitle});
                }
            }, 5000);
        }

        onAudioDispatch() {
            try {
                this._audioError = false;
                this.getPlayComponent().updateState({mode: 'pause'});
                this.getTitleComponent().updateState({title: this._audioTitle});
            } catch(ex) {
                console.log('[RadioPlayer Exception]: ', ex);
            }
        }

        onCleared() {
            window.removeEventListener('mouseup', this._onMouseUpEvent);
            window.removeEventListener('touchend', this._onTouchEndEvent);
            window.removeEventListener('touchmove',  this._onTouchMoveEvent.bind(this));
            window.removeEventListener('mousemove',  this._onMouseMoveEvent.bind(this));

            clearInterval(this._timelineInterval);
            this._timelineInterval = null;

            this.getAudioPlayer().pause();
        }

        getAudioTitle() {
            return this._audioTitle;
        }

        getCoverUrl() {
            return this._audioCoverUrl;
        }

        getAudioURL() {
            return this._audioUrl;
        }

        getAudioPlayer() {
            return this._audioPlayer;
        }

        getSoundBox() {
            return this._soundBox;
        }
    }

    m.RadioPlayerView = RadioPlayerView;
})(window);