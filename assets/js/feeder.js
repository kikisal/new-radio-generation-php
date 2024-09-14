/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 */

((m) => {
    
    class Feeder extends Module /* implements SwitcherPage, ScrollListener */ {
    
        static FEEDER_ENDPOINT                = 'http://localhost/api/feeds';
        static FEEDER_CREATE_SESSION_ENDPOINT = 'http://localhost/api/fcs';
        static RETRY_FEED_TIMEOUT             = 5000; // 5sec
        static MAX_RETRYING_ATTEMPS           = 10;
    
        constructor(type, elementQuery) {
            super('Feeder');
    
            this._type             = type;
            this._devMode          = true;
            this._debugger         = Debugger.createDebugger(this);
            
            this._scheduler        = new SScheduler();
            this._domRenderer      = new DOMRenderer(elementQuery, this, CLEAR_HTML_PAGE);
    
            this._retryAttemps     = 0;
    
            this._feeds            = [];
            this._initialTimestamp = -1;
            
            this._loaded            = false;
            this._requestResetState = false;
    
            this._fetchingFeeds     = false;
            this._firstFetchedFeeds = true;
    
            this._debugger.registerListener(this);
        }
    
        resetState() {
            
        }
        
        onPageSwitch() {
            if (this._loaded) {
                this._domRenderer.clearAll();
                this._currentChunk = 0;
                this._feeds = [];
            }
        }
    
        onPageActive() {
            if (!this._loaded) {
                window.scrollTo(0, 0);
                this.load();
            }
            else {
                if (this.getModule('PageSwitcher').getActivePage() !== this)
                    return;
   
                
                this.getRenderer().clearTarget(CLEAR_HTML_PAGE);
                this.feeds();
    
                /*
                this._domRenderer.renderView("feeds-view", {
                    feeds: [],
                    hasNewFeeds: false,
                    keep: true
                });
                */
                
            }
        }
    
        onScrollBottom() {
            this.feeds();
        }
    
        getRenderer() {
            return this._domRenderer;
        }
    
        onDebugLog(message) {
            
            if (this.getModule('PageSwitcher').getActivePage() !== this)
                return;
            
            this._domRenderer.renderView('error-view', {
                message: message
            });
        }
    
        async createFeedSession() {
            
            const result = await http_fetch({
                endpoint: Feeder.FEEDER_CREATE_SESSION_ENDPOINT
            });
    
            if (!result)
                return false;
    
            if (!('timestamp' in result) || result.status != 'CREATED')
                return false;
    
            this._initialTimestamp = result.timestamp;
    
            return true;
        }
    
        async load() { 
            if (this._loaded)
                return;
    
            this._loading = true;
    
            this.clear();

            this.getRenderer().clearTarget(CLEAR_HTML_PAGE);

            if (!await this.createFeedSession()) {
                
                const retryingText = textConditional(
                    `, retrying in ${formatNumber(Feeder.RETRY_FEED_TIMEOUT / 1000, 2)}s`, 
                    '', 
                    this._retryAttemps < Feeder.MAX_RETRYING_ATTEMPS
                ); 
                
                this._debugger.log(`Couldn't load feeds${retryingText}`);
    
                if (this._retryAttemps >= Feeder.MAX_RETRYING_ATTEMPS) {
                    // ENABLE SCROLLING AGAIN
                    this.getModule('OneTimeScrollWatcher').enableScrolling();
    
                    return false;
                }
    
                this._scheduler.schedule((() => {
                    ++this._retryAttemps;
    
                    this.load();
                }).bind(this), 5000);
    
                return false;
            }
    
            this._retryAttemps = 0;
            this._currentChunk = 0;
            this._loaded       = true;
            this._requestResetState = false;
    
            this.feeds();
    
            return true;
        }
    
        async feeds() {
            if (!this._loaded)
                return;
    
            if (this._fetchingFeeds)
                return;
    
            this._fetchingFeeds = true;
            
            const loadingWidget = this.getRenderer().getView('feeds-view').getByKey('loading-widget');
    
            if (loadingWidget.getMode() == 'clear') {
                loadingWidget.updateState({
                    mode: 'loading'
                });
            }
            
            const newFeeds  = await this.nextFeeds();
    
            let hasNewFeeds = false;
            
            if (newFeeds.length > 0) {
                this._feeds = this._feeds.concat(newFeeds);
                hasNewFeeds = true;
            }
    
            // render new feeds.
            this._domRenderer.renderView("feeds-view", {
                feeds: newFeeds,
                hasNewFeeds
            });
            
    
            // ENABLE SCROLLING AGAIN
            this.getModule('OneTimeScrollWatcher').enableScrolling();
            
            this._fetchingFeeds = false;      
        }
    
        async nextFeeds() {
            
            const feeds = await this.getFeeds(this._currentChunk);
    
            if (feeds.length < 1)
                return [];
    
            ++this._currentChunk;
            return feeds;
        }
    
        async getFeeds(chunk) {
            
            return await http_fetch({
                endpoint: Feeder.FEEDER_ENDPOINT + `?t=${this._type}&chunk=${!chunk ? '' : chunk}`,
                data: {
                    timestamp: Date.now() / 1000
                }
            });
        }
    
        clear() {
            this._initialTimestamp = -1;
            this._currentChunk     = 0;
            this._feeds            = [];
        }
    
        get type() {
            return this._type;
        }
        
        get elementId() {
            return this._elementId;
        }
    
        static create(type, element_id) {
            return new Feeder(type, element_id);
        }
    }

    const CLEAR_HTML_PAGE = `
    <div class="news-list initial-display dflex row-dir">
        
        <div class="news-item flex-shrink-0 grow br-3 --ni">
            <div class="news-image-place"></div>
            <div class="text-container initial-display">
                <div class="text-title-place"></div>
                <div class="vertical-sep"></div>
                <div class="text-date-place"></div>
            </div>
        </div>
        <div class="news-item flex-shrink-0 grow br-3 --ni">
            <div class="news-image-place"></div>
            <div class="text-container initial-display">
                <div class="text-title-place"></div>
                <div class="vertical-sep"></div>
                <div class="text-date-place"></div>
            </div>
        </div>
    </div>
    <div>
        <div class="news-list dflex row-dir small-news initial-display">
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
        </div>
        <div class="v-separator-even-3"></div>
        <div class="news-list dflex row-dir small-news initial-display">
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>

                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
            <div class="news-item-small pr-3 --ni">
                <div class="news-image"></div>
                <div class="text-container">
                    <div class="text-title-place"></div>
                    <div class="vertical-sep"></div>
                    <div class="text-date-place"></div>
                </div>
            </div>
        </div>
        <div class="v-separator-even-3"></div>
        
    </div>`;


    m.Feeder = Feeder;
})(window);