/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 */

class RadioGenApp extends GlobalRouting {
    constructor() {
        super({});
        
        this.setRoutes({
            '/':          this.index(),
            '/podcast':   this.podcast(),
            '/programs':  this.programs(),
            '/about-us':  this.aboutUs(),
            '/view-post': this.viewPost()
        });

        this._currentPage      = this.uri();
        this._feederViewElement = domSelect('feeder-view');

        this._scrollingWatcher = OneTimeScrollWatcher.create();
        this._pageSwitcher     = PageSwitcher.create('feeder-view', CLEAR_HTML_PAGE);

        this._newsFeeder       = Feeder.create('news',     'feeder-view');
        this._podcastFeeder    = Feeder.create('podcast',  'feeder-view');
        this._programsFeeder   = Feeder.create('programs', 'feeder-view');

        this._initFeeders();
        this._initPageSwitcher();
        this._initScrollingWatcher();
        
        this._activeHeaderTab = null;

        this._homeHeaderTab     = domSelect('[header-tab="home"]');
        this._podcastHeaderTab  = domSelect('[header-tab="podcasts"]');
        this._programsHeaderTab = domSelect('[header-tab="programs"]');
        this._aboutUsHeaderTab  = domSelect('[header-tab="about-us"]');

        this._initHeaderTabs();
        
        this._addClickEvent([
            this._homeHeaderTab,
            this._podcastHeaderTab,
            this._programsHeaderTab,
            this._aboutUsHeaderTab
        ], this.toggleHeaderTab.bind(this));
    }

    index() {
        return () => {
            this.toggleHeaderTab(this._homeHeaderTab, false);

            this._scrollingWatcher.setActiveListener('news-feeder');
            this.switchPage("news-feeder");
        };
    }

    podcast() {
        return () => {
            this.toggleHeaderTab(this._podcastHeaderTab, false);

            this._scrollingWatcher.setActiveListener('podcast-feeder');
            this.switchPage("podcast-feeder");
        };
    }

    programs() {
        return () => {
            this.toggleHeaderTab(this._programsHeaderTab, false);
            this._scrollingWatcher.setActiveListener('programs-feeder');

            this.switchPage("programs-feeder");
        };
    }

    aboutUs() {
        return () => {
            this.toggleHeaderTab(this._aboutUsHeaderTab, false);
            this.switchPage("about-us");
        };
    }

    viewPost() {
        return () => {
            this.toggleHeaderTab(null, false);
            this.switchPage("view-post");    
        }
    }
    
    _initHeaderTabs() {
        this._homeHeaderTab._pageId             = '/';
        this._podcastHeaderTab._pageId          = '/podcast';
        this._programsHeaderTab._pageId         = '/programs';
        this._aboutUsHeaderTab._pageId          =  '/about-us';
        
        this._homeHeaderTab._switchPageName     = 'news-feeder';
        this._podcastHeaderTab._switchPageName  = 'podcast-feeder';
        this._programsHeaderTab._switchPageName = 'programs-feeder';
        this._aboutUsHeaderTab._switchPageName  = 'about-us';
    }

    _initScrollingWatcher() {
        this._scrollingWatcher.registerListener('news-feeder', this._pageSwitcher.getPage('news-feeder'));
        this._scrollingWatcher.registerListener('podcast-feeder', this._pageSwitcher.getPage('podcast-feeder'));
        this._scrollingWatcher.registerListener('programs-feeder', this._pageSwitcher.getPage('programs-feeder'));
    }

    _initPageSwitcher() {
        // seting up pages
        this._pageSwitcher.addPage('news-feeder',     this._newsFeeder);
        this._pageSwitcher.addPage('podcast-feeder',  this._podcastFeeder);
        this._pageSwitcher.addPage('programs-feeder', this._programsFeeder);
        this._pageSwitcher.addPage('view-post',       ViewPostPage.create('feeder-view'));
        this._pageSwitcher.addPage('about-us',        AboutUsPage.create('feeder-view'));
    }

    _initFeeders() {
        // configuring views.
        this._newsFeeder.getRenderer().addView("feeds-view",     FeedNewsView);
        this._podcastFeeder.getRenderer().addView("feeds-view",  FeedPodcastView);
        this._programsFeeder.getRenderer().addView("feeds-view", FeedProgramsView);
    }

    _addClickEvent(elements, callback) {
        for (const e of elements) {
            e.addEventListener('click', (() => {
                if (this._currentPage == e._pageId)
                    return;

                this._currentPage = e._pageId;

                this.resetStateOf(e._switchPageName);
                
                callback(e, true);
            }).bind(this));
        }
    }

    resetStateOf(pageName) {

        switch(pageName) {
            case 'news-feeder':
            case 'podcast-feeder':
            case 'programs-feeder':
            {
                this._pageSwitcher.getPage(pageName).resetState();
                break;
            }
        }
    }

    switchPage(page) {
        this._pageSwitcher.switch(page);
    }

    toggleHeaderTab(tab, isClicked) {
        if (this._activeHeaderTab)
            this._activeHeaderTab.classList.remove('active');

        this._activeHeaderTab = tab;

        if (this._activeHeaderTab)
            this._activeHeaderTab.classList.add('active');

        if (isClicked && tab) {
            if (tab._pageId) {
                this.redirectTo(tab._pageId);
                window.scrollTo(0, 200);
            }
        }
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