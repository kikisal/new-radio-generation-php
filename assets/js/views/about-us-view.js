
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

    const ABOUT_US_HTML = `<div class="about-us-container">
    <h1>Chi siamo?</h1><div class="line-separator mb-mid"></div>
    <section class="story-section">
        <h2>RADIO GENERATION: La Voce Giovane e Dinamica della Musica</h2>
        <p>RADIO GENERATION nasce dall'idea di Santo Finocchiaro, meglio conosciuto come DJ Sanny J, un veterano del mondo radiofonico e televisivo. Dopo anni di esperienza in radio e TV, dove ha lavorato anche come presentatore, DJ Sanny J ha deciso di fondare una radio tutta sua, per dare vita a un progetto che unisse la sua passione per la musica e la comunicazione.</p>
        <p>Con il prezioso supporto del suo collaboratore ( Giacomo Marchese "James Marquis"), prende forma RADIO GENERATION, una realtà giovane e dinamica, pensata per gli amanti della musica di qualità e per chi cerca un punto di riferimento nel mondo radiofonico. La missione della radio è portare freschezza, energia e innovazione, mantenendo sempre alta l'attenzione ai gusti musicali del pubblico.</p>
        <p>RADIO GENERATION è più di una semplice emittente: è un’esperienza che connette gli ascoltatori attraverso i suoni di oggi e di ieri, con una programmazione ricca, coinvolgente e sempre aggiornata. Un luogo dove la passione per la musica incontra la professionalità, dando vita a un mix perfetto di intrattenimento e qualità.</p>
        <p>Questa descrizione riflette l'energia e la visione dietro la creazione di RADIO GENERATION, evidenziando l'esperienza di DJ Sanny J e la collaborazione con ( Giacomo Marchese "James Marquis")</p>
        
                
    </section>

   </div>`;
    
})(window);