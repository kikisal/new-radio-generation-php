

const FEEDS_PER_ROW  = 4;

class SmallFeedRow extends CustomComponent {
    constructor() {
        super();
    }

    onViewCreated() {
        this.setClassList(['news-list', 'dflex', 'row-dir', 'small-news'])
    }
}

class SmallFeedCell extends CustomComponent {
    constructor() {
        super();
    }

    onViewCreated() {
        this.setClassList(['news-cell']);
    }

    render() {
        return this.comp([
            this.createComponent(HTMLSpanComponent, 'hello!')
        ]);
    }
}

class SmallNewsFeeds extends CustomComponent {
    constructor() {
        super();
        this._feedRows      = [];
        this._lastRow       = null;


        this._feedStream    = [2, 4, 1, 2, 4, 2, 4, 2, 4, 2, 3];
    }


    onStateUpdate(newFeeds) {
        this._feedStream = newFeeds;
    }

    rowAddCells(row, rowIndex) {
        for (let i = 0; i < FEEDS_PER_ROW; ++i) {
            let index = rowIndex + i; 
            
            if (index >= this._feedStream.length)
                break;

            const data = this._feedStream[index];

            row.appendComponent(
                row.createComponent(SmallFeedCell, data)
            );
        }
    }
    // to fix: Last feed rows are not filled with cells.
    render() {
        
        if (!this._feedStream || this._feedStream.length < 1) {
            console.log('no feed stream.');
            return;
        }

        let readingIndex = 0;

        if (this._lastRow && this._lastRow.length < FEEDS_PER_ROW)
        {
            const remainderElements = FEEDS_PER_ROW - this._lastRow.length;

            for (let i = 0; i < remainderElements; ++i) {

                if (i >= this._feedStream.length)
                    break;

                const data = this._feedStream[i];

                this._lastRow.appendComponent(
                    this._lastRow.createComponent(SmallFeedCell, data)
                );

                ++readingIndex;
            }
        }

        const rows = [];

        for (let i = readingIndex; i < this._feedStream.length; i += FEEDS_PER_ROW) {
            const row = this.createComponent(SmallFeedRow);

            this.rowAddCells(row, i, this._feedStream);
            
            rows.push(row);
            this._feedRows.push(row);
            
            this._lastRow = row;

        }

        this._feedStream = null;

        console.log('final rows: ', this._feedRows);

        // new feeds here.
        this.append(rows);
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
        // this._topFeedsComponent   = this.createComponent(TopNewsFeeds);
        this._smallFeedsComponent = this.createComponent(SmallNewsFeeds, null, ['small-news-feed']);
        
    }

    onComponentMounted() {
        // DOM Elemeent has been updated, now use state variable scrollHeight to scroll back to the user previous position.
         
    }


    onStateUpdate(newFeeds) {
        if (this._feedsCursor < 2)
            this._topFeedsComponent.updateState(newFeeds);

        this._smallFeedsComponent.updateState(newFeeds);

        this._feedsCursor += newFeeds.length;
    }
    
    render() {
        /*return this.comp([
            this._topFeedsComponent,
            this._smallFeedsComponent
        ]);
        */
        // this.createComponent(TopNewsFeeds);
        this.comp(
            [this._smallFeedsComponent]
        );

    }

    
    // Exiting from this view, and showing another one.
    onViewSwitch() {
        
    }
}
