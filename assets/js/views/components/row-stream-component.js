((m) => {
    class SmallFeedRow extends CustomComponent {
        constructor() {
            super();
        }
    
        onViewCreated() {
            this.setClassList(['news-list', 'dflex', 'row-dir', 'small-news', 'top-news'])
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

            this._type          = null;
    
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

        setType(type) {
            this._type = type;
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
   
                if (this._type)
                    data.type = this._type;

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
    
            if (this._lastRow && this._lastRow.children().length < this._feedsPerRow)
            {
                const remainderElements = this._feedsPerRow - this._lastRow.children().length;
    
                for (let i = 0; i < remainderElements; ++i) {
    
                    if (i >= this._streamData.length)
                        break;
    
                    const data = this._streamData[i];

                    if (this._type)
                        data.type = this._type;
    
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
            this.append(rows);
        }
    }

    m.RowStreamComponent = RowStreamComponent;
    m.SmallFeedRow       = SmallFeedRow;
})(window);