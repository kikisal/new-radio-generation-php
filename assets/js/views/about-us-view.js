
((m) => {
    
    class AboutUsView extends CustomComponent {
        constructor() {
            super();
    
        }
    
        onViewCreated() {
            
        }
    
        onComponentMounted() {
            // DOM Elemeent has been updated, now use state variable scrollHeight to scroll back to the user previous position.
             
        }
    
        onPropsUpdated() {

        }
    
    
        onStateUpdate(newFeeds) {
            
        }
        
        render() {
            return this.markup_builder({
                component: 'div',
                textContent: "about us"
            });
        }
    
        
        // Exiting from this view, and showing another one.
        onViewSwitch() {
            
        }
    }

    class AboutUsPage {

        constructor(elementQuery) {
            this._targetElement = domSelect(elementQuery);
        }
        
        onPageSwitch() {
            
        }

        onPageActive() {
            // this._domRenderer.renderView("feeds-view");

            this._targetElement.innerHTML = ABOUT_US_HTML; 
        }
        
        static create(elementQuery) {
            return new AboutUsPage(elementQuery);
        }
    }

    m.AboutUsView = AboutUsView;
    m.AboutUsPage = AboutUsPage;

    const ABOUT_US_HTML = `<section>
                        <h2>La nostra storia</h2>
                        <p>Siamo un team di DJ professionisti, uniti dalla passione per la musica e dalla voglia di far vivere emozioni uniche attraverso i nostri set. Dal 2005, ci siamo affermati sulla scena musicale portando suoni innovativi e mix coinvolgenti che trasformano ogni evento in un'esperienza indimenticabile.</p>
                    </section>
            
                    <section>
                        <h2>La nostra missione</h2>
                        <p>La nostra missione è far vibrare il pubblico con selezioni musicali curate e mix energici. Ci impegniamo a creare atmosfere che ispirino e facciano ballare, portando la nostra arte a nuovi livelli in ogni performance. Lavoriamo per soddisfare le esigenze dei nostri clienti, offrendo serate personalizzate che rispecchiano il loro stile e la loro visione. </p>
                    </section>`;
    
})(window);
