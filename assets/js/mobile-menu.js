/**
 * Mobile Menu by weeki
 * @verion 1.0.0
 */
((m) => {
    class MobileMenu extends Module {
        constructor(overlay, router) {
            super('MobileMenu');

            this._overlayTarget  = overlay;
            this._router         = router;

            // dom elements
            this._mobileMenus     = domSelectAll('.mobile-menu');
            
            this._overlayElement = domSelect(this._overlayTarget);
            this._menuDrawer     = this._overlayElement.querySelector(".mobile-menu-drawer");
            
            this._router.addController(this);
            this._currentPage    = this._router.uri();

            this._tabElementMap  = new Map();

            this._opened         = false;
            this._closing        = false;


            this._mobileMenus.forEach(m => {
                m.addEventListener('click', this.onMobileMenuClick.bind(this));
            });

            this._menuDrawer.addEventListener('transitionend', this.onDrawerTransitionEnd.bind(this));
            this._overlayElement.addEventListener('click', this.onOverlayElementClick.bind(this));
            this._loadTabElementMap();
        }

        onOverlayElementClick(e) {
            if (!this._menuDrawer.contains(e.target))
                this.closeMenu();
        }

        onMobileMenuClick() {
            if (!this._opened) {
                this._closing = false;
                document.body.classList.add('lock-scrollbar');
                this._overlayElement.classList.add('active');
                this._overlayElement.classList.remove('closing');
            } else {
                this._closing = true;
                this._overlayElement.classList.add('closing');
            }
        }

        onDrawerTransitionEnd(e) {
            if (this._closing)
            {
                this._closing = false;
                this._opened  = false;
                document.body.classList.remove('lock-scrollbar');

                this._overlayElement.classList.remove('active');
                this._overlayElement.classList.remove('closing');
            } else {
                this._opened = true;
            }
        }

        _loadTabElementMap() {
            const tabs = domSelectAll('div[route-page]');

            for (const tab of tabs) {
                const route = tab.getAttribute('route-page');
                this._tabElementMap.set(route, tab);
                const tabCallback = this._onTabClick.bind(this, route);

                tab.addEventListener('click', tabCallback);
            }
        }

        _onTabClick(tab) {
            if (tab == this._router.uri())
                return;

            this._router.redirectTo(tab);
            window.scrollTo(0, 200);
        }

        closeMenu() {
            if (!this._opened)
                return;

            if (!this._closing) {
                this._closing = true;
                this._overlayElement.classList.add('closing');   
            } else {
                this._closing = false;
                this._overlayElement.classList.remove('closing');
            }
        }

        forceCloseMenu() {
            this._closing = true;
            this._overlayElement.classList.add('closing');   
        }

        getTabByRoute(route) {
            return this._tabElementMap.get(route);
        }

        onRoute(page) {
            this._currentPage    = page;
            if (this._activeTab)
                this._activeTab.classList.remove('active');

            const tab = this.getTabByRoute(this._currentPage);
            this._activeTab = tab;
            if (this._activeTab)
                this._activeTab.classList.add('active');

            this.closeMenu();
        }

        static create(overlay, router) {
            return new MobileMenu(overlay, router);
        }
    }

    m.MobileMenu = MobileMenu;
    
    // ester egg
    m.nn_ee = (x) => { // (B, D) in
        x1 = mlm.mat_add(mlm.mat_mul(x, W1), mlm.mat_broadcast(b, 'auto')).relu();
        x2 = mlm.mat_add(mlm.mat_mul(x1, W2), mlm.mat_broadcast(b2, 'auto')).relu();
        return mlm.softmax(mlm.proj(x2, voc_out), -1);
    };

})(window);