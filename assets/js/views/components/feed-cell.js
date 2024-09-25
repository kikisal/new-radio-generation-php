((m) => {

    class PlayComponent extends CustomComponent {
        constructor(props) {
            super();
            this._audioUrl = props.audioUrl;
        }

        onViewCreated() {
            this.setKey('play-button'); // for querying.
            this.setClassList(['fc-audio-play-wrapper']);
        }

        render() {
            return this.markup_builder({
                component: 'div',
                classList: ['fc-audio-play-icon'],
                children: [
                    {
                        component: 'div',
                        classList: ['fc-audio-play-icon-img']
                    }
                ]
            }, false);
        }
    }

    class FeedCell extends CustomComponent /* implements ISoundBox */{
        constructor(data) {
            super();

            this._postData       = data;
            this._soundBox       = null;
            this._audioPlayer    = null;
            this._playComponent  = null;
            
            this._soundBoxLoaded  = false;
            this._playAfterLoaded = false;
            this._loadingSoundBox = false;
            
            if ('audio_url' in data && data.audio_url && data.audio_url.length > 0)
                this._soundBox = SoundBox.create(this, data.audio_url);
        }

        onViewCreated() {
            this.setAttribute('feed-id', this.getPostData().id);
            this.addEventListener('click', this.onClick.bind(this));

            this._audioPlayer = this.getRenderer().getModule('AudioPlayer');
        }

        togglePlay() {
            if (this._loadingSoundBox)
                return;

            this._soundBoxLoaded = this.getAudioPlayer().isSoundBoxLoaded(this.getSoundBox());

            if (!this._soundBoxLoaded) {
                this._playAfterLoaded = true;
                this._loadingSoundBox = true;
                this.getAudioPlayer().loadSoundBox(this.getSoundBox());
            } else {
                this.getAudioPlayer().play();
            }
        }

        onClick(e) {
            const playComponent = this.getPlayComponent();

            if (playComponent && playComponent.getViewElement()) {
                const view = playComponent.getViewElement();
                if (view.contains(e.target)) {
                    this.togglePlay();     
                    return;
                }
            }

            const router = this.getRenderer().getModule('GlobalRouting')
            if (!router)
                return;

            router.redirectTo(`/view-post?id=${this.getPostData().id}&type=${this.getPostData().type}`);
            window.scrollTo(0, 200);
        }

        getPlayComponent() {
            if (!this._playComponent)
                this._playComponent = this.getByKey('play-button');

            return this._playComponent;
        }

        
        onAudioPlay() {

            if (this._playAfterLoaded)
                this._playAfterLoaded = false;
            
            const playComponent = this.getPlayComponent();
            if (!playComponent || !playComponent.getViewElement())
                return;

            playComponent.getViewElement().classList.add('playing');
        }

        onAudioPause() {
            
            const playComponent = this.getPlayComponent();
            if (!playComponent || !playComponent.getViewElement())
                return;

            playComponent.getViewElement().classList.remove('playing');
        }
        
        onAudioLoaded() {
            console.log(this, 'onAudioLoaded()');

            this._loadingSoundBox = false;

            const playComponent = this.getPlayComponent();
            if (!playComponent || !playComponent.getViewElement())
                return;

            playComponent.getViewElement().classList.remove('loading');

            if (this._playAfterLoaded)
                this.getAudioPlayer().play();
        }

        onAudioLoading() {
            console.log(this, 'onAudioLoading()');

            const playComponent = this.getPlayComponent();
            if (!playComponent || !playComponent.getViewElement())
                return;

            playComponent.getViewElement().classList.add('loading');
        }

        onCleared() {
            try {
                if (this._audioPlayer.getCurrentSoundBox() == this.getSoundBox())
                    this._audioPlayer.pause();
            } catch(ex) {

            }
        }
        
        onAudioError() {
            console.log(this, 'onAudioError()');

            this._loadingSoundBox = false;
            this._playAfterLoaded = false;

            const playComponent = this.getPlayComponent();
            if (!playComponent || !playComponent.getViewElement())
                return;


            playComponent.getViewElement().classList.remove('loading');
            playComponent.getViewElement().classList.remove('playing');
            playComponent.getViewElement().classList.add('error');

            setTimeout(() => {
                playComponent.getViewElement().classList.remove('error');
            }, 5000);
        }
        
        onAudioDispatch() {
            console.log(this, 'onAudioDispatch()');

            const playComponent = this.getPlayComponent();
            if (!playComponent || !playComponent.getViewElement())
                return;

            playComponent.getViewElement().classList.remove('playing');
            playComponent.getViewElement().classList.remove('error');
        }
    
        getPostData() {
            return this._postData;
        }

        getAudioPlayer() {
            return this._audioPlayer;
        }

        getSoundBox() {
            return this._soundBox;
        }
    }

    class SmallFeedCell extends FeedCell {
        constructor(data) {
            super(data);
    
            this._postData = data;
        }
    
        onViewCreated() {
            this.setClassList(['news-item-small', 'pr-3']);
            super.onViewCreated();
        }

        
        /*
            <div class="news-image"></div>
            <div class="text-container">
                <div class="text-title-place"></div>
    
                <div class="vertical-sep"></div>
                <div class="text-date-place"></div>
            </div>
        */
        render() {
            this.markup_builder({
                component: 'div',
                extractAll: true,
                children: [
                    {
                        component: 'div',
                        classList: ['news-image'],
                        children: [
                            {
                                component: 'img',
                                src: this.getPostData().image_url + `?c=${++_globalCacheIndex}`
                            },
                            ('audio_url' in this.getPostData() && this.getPostData().audio_url) ? this.markupComponent(PlayComponent, {
                                id:  this.getPostData().id,
                                audioUrl: this.getPostData().audio_url
                            }) : {}
                        ]
                    },
                    {
                        component: 'div',
                        classList: ['text-container'],
                        children: [
                            {
                                component: 'div',
                                classList: ['text-title'],
                                textContent: this.getPostData().title
                            },
                            {
                                component: 'div',
                                classList: ['vertical-sep']
                            },
                            {
                                component: 'div',
                                classList: ['text-date'],
                                textContent: new Date(this.getPostData().timestamp * 1000).format('d, D F Y - H:i')
                            }
                        ]
                    }
                ]
            }, false);
        }
    }
    
    class BigFeedCell extends FeedCell {
        constructor(data) {
            super(data);

        }
    
        onViewCreated() {
            this.setClassList(['news-item', 'flex-shrink-0', 'grow', 'br-3']);
            super.onViewCreated();
        }
    
        /*
            <div class="news-image-place"></div>
            <div class="text-container initial-display">
                <div class="text-title-place"></div>
                <div class="vertical-sep"></div>
                <div class="text-date-place"></div>
            </div>
        */
        render() {
    
            return this.markup_builder({
                component: 'div',
                extractAll: true,
                children: [
                    {
                        component: 'div',
                        classList: ['news-image'],
                        children: [
                            {
                                component: 'img',
                                src: this.getPostData().image_url + `?c=${++_globalCacheIndex}`
                            },
                            ('audio_url' in this.getPostData() && this.getPostData().audio_url) ? this.markupComponent(PlayComponent, {
                                id:  this.getPostData().id,
                                audioUrl: this.getPostData().audio_url
                            }) : {}
                        ]
                    },
                    {
                        component: 'div',
                        classList: ['text-container'],
                        children: [
                            {
                                component: 'div',
                                classList: ['text-title'],
                                textContent: this.getPostData().title
                            },
                            {
                                component: 'div',
                                classList: ['vertical-sep']
                            },
                            {
                                component: 'div',
                                classList: ['text-date'],
                                textContent: new Date(this.getPostData().timestamp * 1000).format('d, D F Y - H:i')
                            }
                        ]
                    }
                ]
            }, false);
        }
    }

    m.SmallFeedCell = SmallFeedCell;
    m.BigFeedCell   = BigFeedCell;
})(window);