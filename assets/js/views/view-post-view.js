
((m) => {
    function timeSince(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const secondsInMinute = 60;
        const secondsInHour = secondsInMinute * 60;
        const secondsInDay = secondsInHour * 24;
        const secondsInMonth = secondsInDay * 30; // Approximate month as 30 days
        const secondsInYear = secondsInDay * 365; // Approximate year as 365 days

        if (diffInSeconds < secondsInHour) {
            const minutes = Math.floor(diffInSeconds / secondsInMinute);
            return `${minutes} minut${minutes !== 1 ? 'i' : 'o'} fa`;
        } else if (diffInSeconds < secondsInDay) {
            const hours = Math.floor(diffInSeconds / secondsInHour);
            return `${hours} or${hours !== 1 ? 'e' : 'a'} fa`;
        } else if (diffInSeconds < secondsInMonth) {
            const days = Math.floor(diffInSeconds / secondsInDay);
            return `${days} giorn${days !== 1 ? 'i' : 'o'} fa`;
        } else if (diffInSeconds < secondsInYear) {
            const months = Math.floor(diffInSeconds / secondsInMonth);
            return `${months} mes${months !== 1 ? 'i' : 'e'} fa`;
        } else {
            let years = Math.floor(diffInSeconds / secondsInYear);
            
            if (isNaN(years) || years > 99) 
                years = '99+';

            return `${years} ann${years !== 1 ? 'i' : 'o'} fa`;
        }
    }

    function ytembed(yturl) {
        /*<iframe style="width: 100%" height="500" src="https://www.youtube.com/embed/2B0fznAtVzM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe>*/
        const iframeWrapper = document.createElement('div');

        iframeWrapper.classList.add('yt-iframe');
        iframeWrapper.innerHTML = `<iframe style="width: 100%; height: 100%" src="${yturl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe>`;
        return iframeWrapper;
    }

    function audioPlayer(audioUrl, audioCoverUrl, audioTitle, renderer) {
        const rpView = createComponent(RadioPlayerView, null, {
            audioUrl, audioCoverUrl, audioTitle
        }, renderer, null);
        renderer.renderComponent(rpView);

        return rpView;
    }

    class ViewPostPage {

   

        constructor(elementQuery) {
            this._targetElement = domSelect(elementQuery);

            this._page  = document.createElement('div');
            this._page.innerHTML = VIEW_POST_HTML;

            this._loadingElement     = this._createLoadingElement();
            this._renderer           = new DOMRenderer(null, null, '');

            this._titleElement       = this._page.querySelector('[--title]');
            this._timeElement        = this._page.querySelector('[--time]');
            this._authorElement      = this._page.querySelector('[--author]');
            this._avatarImageElement = this._page.querySelector('[--author-img]');
            this._avatarImageHolder  = this._avatarImageElement.querySelector('.img');
            this._contentElement     = this._page.querySelector('[--content]');
            this._authorDot          = this._page.querySelector('[--dot]');
            this._overlay            = this._page.querySelector('[--overlay]');
            this._mediaArea          = this._overlay.querySelector('media-area');

            this._audioPlayer        = null;

            this._avatarImageElement.style.display = 'none';
        }
        
        onPageSwitch() {
            if (this._audioPlayer)
                this._renderer.clearView(this._audioPlayer);
        }

        onPageActive() {
            this.renderLoading();
            this.fetchFeed();
        }

        async fetchFeed() {
            const url    = new URL(window.location.href);
            
            const id     = url.searchParams.get('id')   || 0;
            const type   = url.searchParams.get('type') || '';

            try {
                const data = await http_fetch({
                    endpoint: `${rg_config.VIEW_FEED_ENDPOINT}?t=${type}&id=${id}`
                });
    
                if ('status' in data && data.status !== 'OK')
                    this.onFetchError();
                else
                    this.onFeedFetched(data);
            } catch(ex) {
                this.onFetchError();
            }
        }

        onFeedFetched(feed) {
            this._titleElement.textContent  = feed.title || 'Nessun titolo';
            this._authorElement.textContent = feed.author || null;

            if (!feed.author || feed.author.length < 1)
                this._authorDot.classList.add('_hide');
            else
                this._authorDot.classList.remove('_hide');

            if (!feed.text_content || feed.text_content.length < 1)
                this._contentElement.classList.add('_hide');
            else {
                this._contentElement.classList.remove('_hide');
                this._contentElement.innerHTML = feed.text_content;
            }
        
            if (!feed.timestamp || isNaN(feed.timestamp))
                feed.timestamp = 0;

            this._timeElement.textContent  = timeSince(feed.timestamp * 1000);
            
            this._mediaArea.innerHTML = '';
            
            if (feed.video_urls)
                this._mediaArea.appendChild(ytembed(feed.video_urls));
            
            if (feed.audio_url) {
                this._audioPlayer = audioPlayer(feed.audio_url, feed.audio_cover_url, feed.audio_title, this._renderer);

                this._mediaArea.appendChild(this._audioPlayer.getViewElement());
            }
            
            this.renderFeed();
        }

        onFetchError() {
            this._targetElement.innerHTML = '<span class="vp-error-text">Qualcosa è andato storto! <span class="vp-reload" onclick="navigation.reload()">riprova</span>.</span>';
        }

        renderLoading() {
            this._targetElement.innerHTML = '';
            this._targetElement.appendChild(this._loadingElement);
        }

        renderFeed() {
            this._targetElement.innerHTML = '';
            this._targetElement.appendChild(this._page);
        }

        _createLoadingElement() {
            const element = document.createElement('div');
            element.classList.add('loading-wrapper');
           
            element.innerHTML = `<div class="loading-widget">
                <img src="/assets/tube-spinner.svg"/>
            </div>`;
            return element;
        }
        
        static create(elementQuery) {
            return new ViewPostPage(elementQuery);
        }
    }

    m.ViewPostPage = ViewPostPage;

    const VIEW_POST_HTML = `<div class="over" id="over">
        <div class="overlay" --overlay>
            <div class="new image" --author-img>
                <div class="img"></div>
            </div>
            <div class="new title-container">
                <div class="title" --title>Titolo dell'articolo</div>
                <div class="info">
                    <div --time>8 hours ago</div>
                    <div --dot style="font-size: 10px;align-self:center;">●</div>
                    <div --author stlye="color:black">Sanny J</div>
                </div>
            </div>
            <div class="new desc" --content>
                Articolo di prova
            </div>
            <media-area class="vp-margin"></media-area>
        </div>
    </div>`;
    
})(window);
