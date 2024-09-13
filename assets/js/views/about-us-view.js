
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
                        <p>Siamo un team di esperti nel campo dell'informatica, con anni di esperienza nel fornire soluzioni software innovative ai nostri clienti. La nostra azienda è stata fondata nel 2005 con l'obiettivo di rivoluzionare il modo in cui le persone interagiscono con la tecnologia.</p>
                    </section>
            
                    <section>
                        <h2>La nostra missione</h2>
                        <p>La nostra missione è quella di creare prodotti e servizi che semplifichino la vita delle persone e migliorino la loro produttività. Ci impegniamo a fornire soluzioni di alta qualità che soddisfino le esigenze specifiche dei nostri clienti.</p>
                    </section>`;
    
})(window);
