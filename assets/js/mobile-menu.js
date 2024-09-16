/**
 * Mobile Menu
 * @verion 1.0.0
 */
((m) => {
    class MobileMenu extends Module {
        constructor(overlay, router) {
            super('MobileMenu');

            this._overlayTarget  = overlay;
            this._overlayElement = domSelect(this._overlayTarget);
            this._router         = router;
            this._router.addController(this);
            this._currentPage    = this._router.uri();
        }

        onRoute(page) {
            this._currentPage    = this._router.uri();
            if (this._activeTab)
                this._activeTab.classList.remove('active');

            this.getTabByRoute(this._currentPage);
        }
    }
})(window);