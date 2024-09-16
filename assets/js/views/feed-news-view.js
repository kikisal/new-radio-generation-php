
((m) => {
    const FEEDS_PER_ROW  = 4;

    _globalCacheIndex = 0;
    
    
    class SmallFeedRow extends CustomComponent {
        constructor() {
            super();
        }
    
        onViewCreated() {
            this.setClassList(['news-list', 'dflex', 'row-dir', 'small-news', 'top-news'])
        }
    }
    
    class SmallFeedCell extends CustomComponent {
        constructor(data) {
            super();
    
            this._postData = data;
        }
    
        onViewCreated() {
            this.setClassList(['news-item-small', 'pr-3']);
        }
    
        getPostData() {
            return this._postData;
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
                            }
                        ]
                    },
                    {
                        component: 'div',
                        classList: ['text-container'],
                        children: [
                            {
                                component: 'div',
                                classList: ['text-title'],
                                textContent: this.getPostData().name
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
    
    class BigFeedCell extends CustomComponent {
        constructor(data) {
            super();
    
            this._postData = data;
        }
    
        onViewCreated() {
            this.setClassList(['news-item', 'flex-shrink-0', 'grow', 'br-3']);
        }
    
        getPostData() {
            return this._postData;
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
                            }
                        ]
                    },
                    {
                        component: 'div',
                        classList: ['text-container'],
                        children: [
                            {
                                component: 'div',
                                classList: ['text-title'],
                                textContent: this.getPostData().name
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
    
    class RowStreamComponent extends CustomComponent {
        
        static DEFAULT_FEEDS_PER_ROW = 4;
    
        constructor(data) {
            super();
    
            if (!data)
                throw new Error('Invalid RowStreamComponent initilization data: ', data);
    
            this._rows      = [];
            this._lastRow       = null;
            this._streamData    = null;
    
            this._feedsPerRow   = typeof data.feedsPerRow == 'undefined' ? RowDividerComponent.DEFAULT_FEEDS_PER_ROW : data.feedsPerRow; 
            this._rowComponent  = data.rowComponent;
            this._cellComponent = data.cellComponent;
    
            if (!this._rowComponent || !this._cellComponent)
                throw new Error(`Make sure component classes are well defined: RowComponent = ${this._rowComponent}, CellComponent = ${this._cellComponent}`);
        }

        onCleared() {
            this._rows = [];
            this._lastRow = null;
            this._streamData = null;

        }
    
        setFeedsPerRow(count) {
            this._feedsPerRow = count;
        }
    
        onStateUpdate(streamData) {
            this._streamData = streamData;
            return true;
        }
    
        rowAddCells(row, rowIndex) {
            for (let i = 0; i < this._feedsPerRow; ++i) {
                let index = rowIndex + i; 
                
                if (index >= this._streamData.length)
                    break;
    
                const data = this._streamData[index];
    
                row.appendComponent(
                    row.createComponent(this._cellComponent, data)
                );
            }
        }
        // to fix: Last feed rows are not filled with cells.
        render() {
    
            if (!this._streamData || this._streamData.length < 1)
                return;
    
            let readingIndex = 0;
    
            if (this._lastRow && this._lastRow.children().length < FEEDS_PER_ROW)
            {
                const remainderElements = this._feedsPerRow - this._lastRow.children().length;
    
                for (let i = 0; i < remainderElements; ++i) {
    
                    if (i >= this._streamData.length)
                        break;
    
                    const data = this._streamData[i];
    
                    this._lastRow.appendComponent(
                        this._lastRow.createComponent(this._cellComponent, data)
                    );
    
                    ++readingIndex;
                }
            }
    
            const rows = [];
    
            for (let i = readingIndex; i < this._streamData.length; i += this._feedsPerRow) {
                const row = this.createComponent(this._rowComponent);
    
                this.rowAddCells(row, i, this._streamData);
                
                rows.push(row);
                this._rows.push(row);
                
                this._lastRow = row;
            }
    
            this._streamData = null;
    
            // new feeds here.
            // <div class="v-separator-even-3"></div>
            this.append(this.putInBetween(rows, {
                component: 'div',
                classList: ['v-separator-even-3']
            }));
        }
    }
    
    class TopNewsFeeds extends RowStreamComponent {
    
        static FEEDS_PER_ROW = 2;
    
        constructor(config) {
            super(config);
    
            this._feedsCount = 0;
            this._topFeeds = [];
    
            this.setFeedsPerRow(TopNewsFeeds.FEEDS_PER_ROW);
        }

        onCleared() {
            this._feedsCount = 0;
            this._topFeeds = [];

            super.onCleared();
        }
    
        onViewCreated() {
            //this.setClassList(['news-list', 'dflex', 'row-dir']);
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
    
            return super.onStateUpdate(this._topFeeds);
        }
    }
    
    class SmallNewsFeeds extends RowStreamComponent {
        constructor(config) {
            super(config);
    
            this.setFeedsPerRow(FEEDS_PER_ROW);
        }
    }

    class LoadingComponent extends CustomComponent {
        constructor() {
            super();
            // three modes:
            // loading, clear, no-feeds
            this._mode = 'loading';
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
    
    class FeedNewsView extends CustomComponent {
        constructor() {
            super();
    
            this._feedsCursor   = 0;
            this._scrollHeight  = 0;
    
            this._topFeedsComponent   = null;
            this._smallFeedsComponent = null;
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
            
            if (this._feedsCursor < 2)
                this._topFeedsComponent.updateState(props.feeds);
    
            this._smallFeedsComponent.updateState(props.feeds);
    
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

        onCleared() {
            this._feedsCursor   = 0;
            this._loadingComponent.updateState({mode: 'loading'}, true);
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
                                textContent: 'Feed News',
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

    m.FeedNewsView = FeedNewsView;
    
})(window);
