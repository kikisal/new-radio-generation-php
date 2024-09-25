
((m) => {
    const FEEDS_PER_ROW  = 4;

    _globalCacheIndex = 0;
    
    class TopNewsFeeds extends RowStreamComponent {
    
        static FEEDS_PER_ROW = 2;
    
        constructor(config) {
            super(config);
    
            this._feedsCount = 0;
            this._topFeeds = [];
    
            this.setFeedsPerRow(TopNewsFeeds.FEEDS_PER_ROW);
            this.setType('podcast');
        }
    
        onViewCreated() {
            //this.setClassList(['news-list', 'dflex', 'row-dir']);
        }

        onCleared() {
            this._feedsCount = 0;
            this._topFeeds = [];
            super.onCleared();

        }
    
        updateFeedsCount(feedStream) {
            if (this._feedsCount >= TopNewsFeeds.FEEDS_PER_ROW)
                return;
    
            for (let i = 0; i < feedStream.length; ++i) {
                this._feedsCount++;
    
                this._topFeeds.push(feedStream[i]);
    
                if (this._feedsCount >= TopNewsFeeds.FEEDS_PER_ROW)
                    break;
            }
        }
    
        onStateUpdate(feedsStream) {
            this.updateFeedsCount(feedsStream);

            const render = super.onStateUpdate(this._topFeeds);
            this._topFeeds = [];
            return render;
        }
    }
    
    class SmallNewsFeeds extends RowStreamComponent {
        constructor(config) {
            super(config);
    
            this.setFeedsPerRow(FEEDS_PER_ROW);
            this.setType('podcast');
        }
    }

    class LoadingComponent extends CustomComponent {
        constructor() {
            super();
            // three modes:
            // loading, clear, no-feeds
            this._mode = 'loading';
            this.setCanClear(false);
        }

        onViewCreated() {
            this.setClassList(['feeds-info-panel']);
        }

        getMode() {
            return this._mode;
        }

        onStateUpdate(state) {
            if (!('mode' in state))
                return;

            if (this.getMode() == state)
                return false;

            this._mode = state.mode;
            return true;
        }

        render() {
            
            switch(this.getMode()) {
                case 'loading': {
                    return this.markup_builder({
                        component: 'div',
                        classList: ['loading-widget'],
                        children: [
                           {
                                component: 'img',
                                src: '/assets/tube-spinner.svg'
                           } 
                        ]
                        
                    }, false);
                }
                    
                case 'clear':
                    return this.comp([]);
                case 'no-feeds': {
                    return this.markup_builder({
                        component: 'div',
                        classList: ['no-feeds-textwrapper'],
                        children: [
                           {
                                component: 'span',
                                classList: ['no-feeds-text'],
                                textContent: 'Nessun altro post trovato.'
                           }
                        ]
                        
                    }, false);
                }
            }
            
        }
    }
    
    class FeedPodcastView extends CustomComponent {
        constructor() {
            super();
    
            this._feedsCursor   = 0;
            this._scrollHeight  = 0;
    
            this._topFeedsComponent   = null;
            this._smallFeedsComponent = null;
        }

        onCleared() {
            this._feedsCursor   = 0;
            this._loadingComponent.updateState({mode: 'loading'});
        }

    
        onViewCreated() {
            this._topFeedsComponent   = this.createComponent(TopNewsFeeds, {
                feedsPerRow:   TopNewsFeeds.FEEDS_PER_ROW,
                rowComponent:  SmallFeedRow,
                cellComponent: BigFeedCell
            }, null);
    
            this._smallFeedsComponent = this.createComponent(SmallNewsFeeds, {
                feedsPerRow:   FEEDS_PER_ROW,
                rowComponent:  SmallFeedRow,
                cellComponent: SmallFeedCell
            }, ['small-news-feed']);
    
            this._loadingComponent  = this.createComponent(LoadingComponent, null);
            this._loadingComponent.setKey('loading-widget');

            this.appendComponent(this._loadingComponent);
        }
    
        onComponentMounted() {
            // DOM Elemeent has been updated, now use state variable scrollHeight to scroll back to the user previous position.
             
        }
    
        onPropsUpdated() {

            const props = this.getProps();
            
            let smallFeeds = props.feeds;
            
            if (this._feedsCursor < 2) {
                const topFeeds = props.feeds.slice(0, 2);
                this._topFeedsComponent.updateState(props.feeds);

                smallFeeds = props.feeds.slice(topFeeds.length);
            }

    
            this._smallFeedsComponent.updateState(smallFeeds);
    
            this._feedsCursor += props.feeds.length;
            
            if (props.keep)
                this._loadingComponent.updateState({mode: 'loading'});
            else {
                if (props.feeds && props.feeds.length > 0)
                    this._loadingComponent.updateState({mode: 'loading'});
                else
                    this._loadingComponent.updateState({mode: 'no-feeds'});
            }
        }
    
    
        onStateUpdate(newFeeds) {
            return false; // skip re-rendering this component.
        }
        
        render() {
    
            this.comp(
                [
                    ...this.markup_builder({
                        component: 'div',
                        extractAll: true,
                        children: [
                            {
                                component: 'h1',
                                textContent: 'Feed Podcast',
                            },
                            {
                                component: 'div',
                                classList: ['line-separator', 'mb-mid']
                            }
                        ]
                    }, false, true),
                    this._topFeedsComponent,
                    this._smallFeedsComponent,
                    this._loadingComponent
                ]
            );
    
        }
    
        
        // Exiting from this view, and showing another one.
        onViewSwitch() {
            
        }
    }

    m.FeedPodcastView = FeedPodcastView;
    
})(window);
