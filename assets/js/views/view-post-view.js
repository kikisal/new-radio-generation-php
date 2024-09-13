
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
                <div class="title">Feed Title</div>
                <div class="info">
                    <div>8 hours ago</div>
                    <div style="font-size: 10px;align-self:center;">●</div>
                    <div stlye="color:black">Sanny J</div>
                </div>
            </div>
            <div class="new desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, consequatur! Exercitationem aliquam consectetur est vero autem aperiam voluptas tenetur sapiente assumenda velit repellat ipsum cumque corporis, consequuntur dolor distinctio quisquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Error debitis eaque vel provident aut atque sint asperiores nulla nisi autem fugit quae aspernatur, laudantium accusamus, distinctio enim qui obcaecati non. Lorem ipsum dolor sit amet consectetur adipisicing elit. Id itaque nisi quia dolorem in aspernatur a sed libero sunt nulla, amet necessitatibus veritatis laudantium corporis quas explicabo modi illum culpa?
            </div>
        </div>
    </div>`;
    
})(window);
