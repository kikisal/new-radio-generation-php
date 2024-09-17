
((m) => {
    
    class ViewPostPage {

        constructor(elementQuery) {
            this._targetElement = domSelect(elementQuery);
        }
        
        onPageSwitch() {
            
        }

        onPageActive() {
            // this._domRenderer.renderView("feeds-view");

            this._targetElement.innerHTML = VIEW_POST_HTML; 
        }
        
        static create(elementQuery) {
            return new ViewPostPage(elementQuery);
        }
    }

    m.ViewPostPage = ViewPostPage;

    const VIEW_POST_HTML = `<div class="over" id="over">
        <div class="overlay">
            <div class="new image">
                <div class="img"></div>
            </div>
            <div class="new title-container">
                <div class="title">Titolo dell'articolo</div>
                <div class="info">
                    <div>8 hours ago</div>
                    <div style="font-size: 10px;align-self:center;">●</div>
                    <div stlye="color:black">Sanny J</div>
                </div>
            </div>
            <div class="new desc">
                Articolo di prova
            </div>
        </div>
    </div>`;
    
})(window);
