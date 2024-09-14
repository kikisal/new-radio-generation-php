/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 */
const DEBUG_MODE = true;


function domSelect(query) {
    return document.querySelector(query);
}

function textConditional(t1, t2, pred) {
    return pred ? t1 : t2;
}

function formatNumber(n, digits) {
    return new Number(n).toFixed(digits);
}

function modelHas(k, model, out) {
    for (const b of model) 
    {
        if (b.key == k) {
            out.result = b;
            return true;
        }
    }

    out.result = null;
    return false;
}

class JSONValidator {
    static validate(obj, model) {
        if (!obj)
            return false;

        for (const k in obj) {
            let out = {};
            if (modelHas(k, model, out) && out.result.type == typeof(obj[k]))
                return true;
        }

        return false;
    }
}

async function http_fetch(req_desc) {
    try {
        const res  = await fetch(req_desc.endpoint, {
            method: "POST",
            body: JSON.stringify(req_desc.data),
            headers: {
                "Content-type": "application/json"
            }
        });

        
        if (res.status != 200)
            return null;

        const data = await res.json();

        /*
        if (!JSONValidator.validate(data, FeedsModel) && false) {
            console.warn(`Error while loading feeds: Invalid returned data. `, data);
            return null;
        }
        */

        return data;
    } catch(err) {
        console.warn(`Error while loading feeds: `, err);
        return null;
    }
}

function createComponent(component, parent, data, renderer, classList) {
    const instance  = new component(data);
    instance.parent = parent;

    let domElement = null;

    // -- temporary code --
    if (instance instanceof HTMLDivComponent || instance instanceof CustomComponent)
        domElement = document.createElement('div');
    else if (instance instanceof HTMLSpanComponent) {
        domElement = document.createElement('span');
        domElement.textContent = instance.getTextContent();
    } else if (instance instanceof HTMLImageComponent) {
        domElement = document.createElement('img');
    } else if (instance instanceof HTMLH1Component)
        domElement = document.createElement('h1');

    instance.setViewElement(domElement);

    if (classList && domElement)
        domElement.classList.add(...classList);

    instance.setRenderer(renderer);

    instance.onViewCreated();

    return instance;
}

function compClassFromString(type) {
    switch(type) {
        case 'div':
            return HTMLDivComponent;
        case 'img':
            return HTMLImageComponent;
        case 'span':
            return HTMLSpanComponent;
        case 'h1':
            return HTMLH1Component;
        default:
            return null;
    }
}

class View {
    constructor() {
        this._viewElement = null;
        this._needsUpdate = false;
        this._parent      = null;
        this._children    = [];
        this._renderer    = null;
        this._name        = null;
        this._props       = null;

        this._key         = null;

        this._canClear    = true;

        this._renderMode  = 'replace';
        
        this._appendLength = 0; 
        this._appendIndex  = 0;

        this._innerText   = null;
    }

   
    setCanClear(state) {
        this._canClear = state;
    }

    get canClear() {
        return this._canClear;
    }

    clearView() {
 
        if (!this.canClear)
            return;

        this._appendIndex = 0;
        this._appendLength = 0;

        if (this.renderMode == 'append')
            this._children = [];

        if (this.getViewElement())
            this.getViewElement().innerHTML = '';

        this.onCleared();
    }

    onCleared() {

    }

    get renderMode() {
        return this._renderMode;
    }

    get appendIndex() {
        return this._appendIndex;
    }

    get appendLength() {
        return this._appendLength;
    }

    putInBetween(components, docObj) {

        let result = [];
        for (const _c of components) {
            result.push(_c);
            result = result.concat(this.markup_builder(docObj, false, true));
        }

        return result;
    }


    get innerText() {
        return this._innerText;
    }

    setTextContent(text) {
        this._innerText = text;
    }
    
    getTextContent() {
        return this.innerText;
    }

    updatePropsData(props) {
        this._props = props;

        this.onPropsUpdated();
    }

    getProps() {
        return this._props;
    }


    _domBuilder(parent, docObj) {
        const compClass = compClassFromString(docObj.component);
        if (!compClass)
            return;

        const comp = parent.createComponent(compClass, null, docObj.classList);
        
        if  (comp instanceof HTMLImageComponent)
            comp.src = docObj.src;
        else if (comp instanceof HTMLSpanComponent)
            comp.setTextContent(docObj.textContent || '');
        
        parent.appendComponent(comp);
        
        if ('textContent' in docObj)
            comp.setTextContent(docObj.textContent);

        if ('children' in docObj && Array.isArray(docObj.children) && docObj.children.length > 0) {
            for (const c of docObj.children) {
                this._domBuilder(comp, c);
            }
        }

        return comp;
    }

    markup_builder(docObj, append, keepChildren) {
        const result = this._domBuilder(this, docObj);
        
        let arr = [result];
        if (docObj.extractAll)
            arr = [...result.children()];

        if (keepChildren)
            return arr;

        if (append)
            return this.append(arr);
        else
            return this.comp(arr);       
    }

    setClassList(classList) {
        if (!this.getViewElement())
            return;

        this.getViewElement().classList.add(...classList);
    }

    hasChildren() {
        return this._children.length > 0;
    }

    children() {
        return this._children;
    }

    appendChild(child) {
        this._viewElement.appendChild(child.getViewElement());
    }

    appendComponent(child) {
        this._children.push(child);
        if (this.renderMode == 'append')
            ++this._appendLength;
    }

    _getByKey(view, key) {
        for (const c of view.children())
        {
            if (c.getKey() == key)
                return c;

            if (c.hasChildren()) {
                let result = this._getByKey(c, key);
                if (!result)
                    continue;
            }
        }

        return null;
    }

    getByKey(key) {
        return this._getByKey(this, key);
    }

    getKey() {
        return this._key;
    }

    setKey(key) {
        this._key = key;
    }

    keep() {

    }

    append(components) {
        this._renderMode   = 'append';
        this._children     = this._children.concat(components);
        this._appendLength += components.length;
        return this;
    }

    comp(arr) {
        this._renderMode  = 'replace';
        this._children    = arr;
        return this;
    }
        
    createComponent(component, data, classList) {
        return createComponent(component, this, data, this._renderer, classList);
    }

    init() {

    }

    render() {

    }

    updateState(state) {
        if (!state)
            return;

        if (this.onStateUpdate(state))
        // then render new changes.
            this.getRenderer().renderComponent(this);
    }

    needsUpdate() {
        return this._needsUpdate;
    }

    onViewSwitch() {

    }

    onStateUpdate() {

    }

    onViewCreated() {

    }

    onPropsUpdated() {

    }

    onComponentMounted() {

    }

    getRenderer() {
        return this._renderer;
    }
    
    setName(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }

    getViewElement() {
        return this._viewElement;
    }

    setViewElement(viewElement) {
        this._viewElement = viewElement;
    }

    setRenderer(renderer) {
        this._renderer = renderer;
    }
};

class CustomComponent extends View {
    constructor() {
        super();
    }
}

// --- stock components ---
class HTMLDivComponent extends View {
    constructor() {
        super();
    }

    render() {

    }
}

class HTMLImageComponent extends View {
    constructor() {
        super();
        this._src = null;
    }

    get src() {
        return this._src;
    }

    set src(source) {
        this._src = source;
    }

    render() {

    }
}

class HTMLSpanComponent extends View {
    constructor(text) {
        super();
        this._innerText = text;
    }

    render() {

    }
}

class HTMLH1Component extends View {
    constructor() {
        super();
    }

    render() {}
}

// --- end stock components ---

class StackTraceView extends CustomComponent {
    constructor() {
        super();
    }

    onPropsUpdated() {
        this.setTextContent(this.getProps().message);
    }
}

class DebuggerProxy {
    constructor(mod, debuggerInstance) {
        this._module           = mod;
        this._debuggerInstance = debuggerInstance;
    }

    registerListener(listener) {
        this._debuggerInstance.registerListener(this._module, listener);
    }

    log(message) {
        this._debuggerInstance.log(this._module, message);
    }
}


class Module {
    static _moduleList = [];

    constructor(name) {
        this._name = name;
        Module._moduleList.push(this);
    }

    getModule(_module) {
        return Module.getModule(_module);
    }

    hasModule(_module) {
        return !!Module._moduleList.find(m => m.getName() == _module);
    }

    static getModule(_module) {
        return Module._moduleList.find((m) => m.getName() == _module);
    }

    getName() {
        return this._name;
    }
}

class Debugger {

    static instance = null;

    constructor(debugMode) {

        this._debugMode = debugMode; 
        this._listenerMap = new Map();
    }

    static createDebugger(mod) {
        return new DebuggerProxy(mod, Debugger.getInstance());
    }

    static getInstance() {
        if (Debugger.instance == null)
            Debugger.instance = new Debugger(DEBUG_MODE);

        return Debugger.instance;
    }

    log(module, message) {
        if (this._debugMode)
            console.log(`[DEBUGGER] ${module.getName()}: ${message}`);

        this.fireEvent(module, message);
    }

    fireEvent(module, message) {
        const listener = this._listenerMap.get(module.getName())

        if ('onDebugLog' in listener && typeof listener.onDebugLog == 'function')
            listener.onDebugLog(message);
    }

    registerListener(module, listener) {
        this._listenerMap.set(module.getName(), listener);
    }

    static debuggingMode() {
        return this.getInstance().getDebugMode();
    }

    getDebugMode() {
        return this._debugMode;
    }
}


// implements stateful views manager
class DOMRenderer extends Module {
    constructor(query, currentPage, clearHtml) {
        super('DOMRenderer');

        this._elementQuery        = query;
        this._renderElement       = domSelect(query);
        this._currentView         = null;
        this._viewList            = [];
        this._debugger            = Debugger.createDebugger(this);
        this._clearHtml           = clearHtml;

        // this is used to ensure other modules do not override what's currently being rendered
        // on the _renderElement.
        this._stopFutherRendering = false;

        this._currentPage = currentPage; 

        this._debugger.registerListener(this);

        this.addView('stack-trace-view', StackTraceView);
    }

    clearAll() {
        for (const view of this._viewList) {
            this.clearView(view);
        }
    }

    clearView(v) {
        if (v.hasChildren())
        {
            const children = [...v.children()];
            for (const _v of children)
                this.clearView(_v);
        }

        v.clearView();
    }



    getPage() {
        return this._currentPage;
    }

    onDebugLog(message) {
        if (Debugger.debuggingMode())
        {
            if (this.viewExists('stack-trace-view')) {

                if (this.hasModule('PageSwitcher') && this.getModule('PageSwitcher').getActivePage() !== this.getPage())
                    return;

                this.renderView('stack-trace-view', {
                    message
                });
            
                this._stopFutherRendering = true;
            }
        }
    }

    /**
     * 
     * @param {*} view key string to query view object.
     * @param {*} data if null, view doesn't update its state. 
     * @returns 
     */
    renderView(view, propsData) {

        if (this._stopFutherRendering)
            return false;

        try {
            
            if (this._currentView && this._currentView.name == view) {
                // just update data.

                this._currentView.updatePropsData(propsData);
                this.renderComponent(this._currentView);

                return true;
            }

            if (!this.viewExists(view))
            {
                this._debugger.log(`Trying to render a view (${view}) that does not exist.`);
                return false;
            }

            if (this._currentView)
                this._currentView.onViewSwitch();

            this._currentView = this.getView(view);

            this._currentView.updatePropsData(propsData);
            this.renderComponent(this._currentView);
            
            // simple workaround for now
            if (this.hasModule('PageSwitcher') && this.getModule('PageSwitcher').getActivePage() === this.getPage()) {
                this._renderElement.innerHTML = '';
                this._renderElement.appendChild(this._currentView.getViewElement());

                this._currentView.onComponentMounted();
            }


            return true; 
        } catch(exception) {
            
            if (view == 'stack-trace-view')
                throw new Error('stack-trace-view couln\t render: ', exception); // to avoid possible infinite recursion

            this._debugger.log(`Uncaught Exception: ${exception}`);
        }

        return false;
    }

    renderComponent(c) {
        const viewElement = c.getViewElement();

        if (c.renderMode == 'replace')
            viewElement.innerHTML = '';

        c.render();

        if (!c.children())
            return;


        let children = c.children();

        if (c.renderMode == 'append') {
            children = children.slice(c.appendIndex, (c.appendIndex + c.appendLength));
            c._appendIndex += c.appendLength;
            c._appendLength = 0;
        }

        for (const child of children)
        {    
            this.renderComponent(child);
            viewElement.appendChild(child.getViewElement());
        }

        c.onComponentMounted();

        if (c instanceof HTMLSpanComponent || c.innerText !== null)
            c.getViewElement().textContent = c.getTextContent();

        if (c instanceof HTMLImageComponent)
            c.getViewElement().src = c.src;
    }

    viewExists(view) {
        return !!this.getView(view);
    }

    updateViewData(v, data) {
        if (!this.viewExists(v))
            return false;

        const view = this.getView(v);
        view.setData(data);

        return true;
    }

    updateViewState(v, data) {
        if (!this.viewExists(v))
            return false;

        const view = this.getView(v);
        view.updateState(data);

        return true;
    }

    getView(viewName) {
        return this._viewList.find((v) => {
            return v.getName() == viewName;
        });
    }

    addView(view, viewClass) {
        const instance = createComponent(viewClass, null, null, this, null);
        
        instance.setName(view);
        
        this._viewList.push(instance);
    }
}

class SScheduler {
    schedule(task, timeout) {
        setTimeout(task, timeout);
    }
}

class OneTimeScrollWatcher extends Module {
    constructor() {
        super('OneTimeScrollWatcher');
        
        this._lastScrollPos    = undefined;
        this._lastScrolledTime = undefined;
        this._scrollTreshold   = 200;

        this._scrolledBottom   = false;
        this._scrollWatcher    = setInterval((() => {
            const el = document.querySelector('html');
            const scrollPos = el.scrollHeight - el.clientHeight - el.scrollTop;

            if (Math.abs(scrollPos) < this._scrollTreshold) {
                this._scrolledBottom = true;
                this.onScrollBottom();
            }
        }).bind(this), 1000);

        window.addEventListener('scroll', this.onScrollChange.bind(this));

        this._listenerMap    = new Map();
        this._activeListener = null;
    }

    registerListener(name, listener) {
        this._listenerMap.set(name, listener);
    }
    
    setActiveListener(name) {
        this._activeListener = name;
    }

    onScrollChange() {
        const el = document.querySelector('html');

        const scrollPos = el.scrollHeight - el.clientHeight - el.scrollTop;
        if (!this._lastScrollPos)
            this._lastScrollPos = scrollPos;

        const diff = scrollPos - this._lastScrollPos;
        this._lastScrollPos = scrollPos;


        if (Math.abs(scrollPos) < this._scrollTreshold && !this._scrolledBottom && Math.sign(diff) < 0)
        {
            this._currentScrolledTime = Date.now();

            if (!this._lastScrolledTime)
                this._lastScrolledTime = this._currentScrolledTime;

            const ellapsed          = this._currentScrolledTime - this._lastScrolledTime;
            this._lastScrolledTime  = this._currentScrolledTime;
            
            if (ellapsed < 200)
                return;

            this._scrolledBottom = true;
            this.onScrollBottom();
        }
    }

    enableScrolling() {
        this._scrolledBottom = false;
    }

    onScrollBottom() {

        if (this._activeListener && this._listenerMap.has(this._activeListener))
            this._listenerMap.get(this._activeListener).onScrollBottom();
    }

    static create() {
        return new OneTimeScrollWatcher();
    }
}

class Feeder extends Module /* implements SwitcherPage, ScrollListener */ {

    static FEEDER_ENDPOINT                = 'http://localhost/api/feeds';
    static FEEDER_CREATE_SESSION_ENDPOINT = 'http://localhost/api/fcs';
    static RETRY_FEED_TIMEOUT             = 5000; // 5sec
    static MAX_RETRYING_ATTEMPS           = 10;

    constructor(type, elementQuery) {
        super('Feeder');

        this._type             = type;
        this._devMode          = true;
        this._debugger         = Debugger.createDebugger(this);
        
        this._scheduler        = new SScheduler();
        this._domRenderer      = new DOMRenderer(elementQuery, this, __CLEAR_HTML_PAGE);

        this._retryAttemps     = 0;

        this._feeds            = [];
        this._initialTimestamp = -1;
        
        this._loaded           = false;
        this._requestResetState = false;

        this._fetchingFeeds     = false;
        this._firstFetchedFeeds = true;

        this._debugger.registerListener(this);
    }

    resetState() {
        
    }
    
    onPageSwitch() {
        if (this._loaded) {
            this._domRenderer.clearAll();
            this._currentChunk = 0;
            this._feeds = [];
        }
    }

    onPageActive() {
        if (!this._loaded) {
            window.scrollTo(0, 0);
            this.load();
        }
        else {
            if (this.getModule('PageSwitcher').getActivePage() !== this)
                return;

            this.feeds();

            /*
            this._domRenderer.renderView("feeds-view", {
                feeds: [],
                hasNewFeeds: false,
                keep: true
            });
            */
            
        }
    }

    onScrollBottom() {
        this.feeds();
    }

    getRenderer() {
        return this._domRenderer;
    }

    onDebugLog(message) {
        
        if (this.getModule('PageSwitcher').getActivePage() !== this)
            return;
        
        this._domRenderer.renderView('error-view', {
            message: message
        });
    }

    async createFeedSession() {
        
        const result = await http_fetch({
            endpoint: Feeder.FEEDER_CREATE_SESSION_ENDPOINT
        });

        if (!result)
            return false;

        if (!('timestamp' in result) || result.status != 'CREATED')
            return false;

        this._initialTimestamp = result.timestamp;

        return true;
    }

    async load() { 
        if (this._loaded)
            return;

        this._loading = true;

        this.clear();
        if (!await this.createFeedSession()) {
            
            const retryingText = textConditional(
                `, retrying in ${formatNumber(Feeder.RETRY_FEED_TIMEOUT / 1000, 2)}s`, 
                '', 
                this._retryAttemps < Feeder.MAX_RETRYING_ATTEMPS
            ); 
            
            this._debugger.log(`Couldn't load feeds${retryingText}`);

            if (this._retryAttemps >= Feeder.MAX_RETRYING_ATTEMPS) {
                // ENABLE SCROLLING AGAIN
                this.getModule('OneTimeScrollWatcher').enableScrolling();

                return false;
            }

            this._scheduler.schedule((() => {
                ++this._retryAttemps;

                this.load();
            }).bind(this), 5000);

            return false;
        }

        this._retryAttemps = 0;
        this._currentChunk = 0;
        this._loaded       = true;
        this._requestResetState = false;

        this.feeds();

        return true;
    }

    async feeds() {
        if (!this._loaded)
            return;

        if (this._fetchingFeeds)
            return;

        this._fetchingFeeds = true;
        
        const loadingWidget = this.getRenderer().getView('feeds-view').getByKey('loading-widget');

        if (loadingWidget.getMode() == 'clear') {
            loadingWidget.updateState({
                mode: 'loading'
            });
        }
        
        const newFeeds  = await this.nextFeeds();

        let hasNewFeeds = false;
        
        if (newFeeds.length > 0) {
            this._feeds = this._feeds.concat(newFeeds);
            hasNewFeeds = true;
        }

        // render new feeds.
        this._domRenderer.renderView("feeds-view", {
            feeds: newFeeds,
            hasNewFeeds
        });
        

        // ENABLE SCROLLING AGAIN
        this.getModule('OneTimeScrollWatcher').enableScrolling();
        
        this._fetchingFeeds = false;      
    }

    async nextFeeds() {
        
        const feeds = await this.getFeeds(this._currentChunk);

        if (feeds.length < 1)
            return [];

        ++this._currentChunk;
        return feeds;
    }

    async getFeeds(chunk) {
        
        return await http_fetch({
            endpoint: Feeder.FEEDER_ENDPOINT + `?t=${this._type}&chunk=${!chunk ? '' : chunk}`,
            data: {
                timestamp: Date.now() / 1000
            }
        });
    }

    clear() {
        this._initialTimestamp = -1;
        this._currentChunk     = 0;
        this._feeds            = [];
    }

    get type() {
        return this._type;
    }
    
    get elementId() {
        return this._elementId;
    }

    static create(type, element_id) {
        return new Feeder(type, element_id);
    }
}

class GlobalRouting extends Module {
    constructor(routes) {
        super('GlobalRouting');

        this._routes       = routes;
        this._startRouting = false;

        this.updateURI();

        const pushState = history.pushState;


        history.pushState = function(state) {
            const result = pushState.apply(history, arguments);
            
            this.onPushState();
            return result;
        }.bind(this);

        window.addEventListener('popstate', this.onPopState.bind(this));
    }

    updateURI() {
        this._uri = window.location.pathname;
    }

    onPushState() {
        this.updateURI();
        this.routeToURI();
    }

    onPopState() {
        this.updateURI();
        this.routeToURI();
    }

    routeTo(uri) {
        if (!this._startRouting)
            return;

        const route = this.getRoute(uri);
        
        if (!route) {
            if (this.routeExists('/404'))
                this.redirect('/404');

            return;
        }

        route();
    }

    redirectTo(uri) {
        history.pushState(null, null, uri);
    }

    getRoute(uri) {
        return this._routes[uri];
    }

    routeExists(uri) {
        return uri in this._routes;
    }

    redirect(uri) {
        history.pushState(null, '404', '/404');
    }

    routeToURI() {
        this.routeTo(this.uri());
    }

    uri() {
        return this._uri;
    }

    setRoutes(routes) {
        this._routes = routes;
    }

    route() {
        this._startRouting = true;
        this.updateURI();
        this.routeToURI();
    }
}

class PageSwitcher extends Module {
    constructor(domElement, clearHtml) {
        super('PageSwitcher');

        this._domElement = domSelect(domElement);
        if (!this._domElement)
            throw new Error(`PageSwitcher: element ${domElement} not found`);

        this._pages        = new Map();
        this._activePage   = null;
        this._clearHtml = clearHtml;
    }

    getActivePage() {
        return this._pages.get(this._activePage);
    }

    addPage(page, switcherPage) {
        this._pages.set(page, switcherPage);
    }

    getPage(page) {
        return this._pages.get(page);
    }

    switch(page) {
        const p = this.getPage(page);
        if (p) {
            if (this._activePage && this._pages.has(this._activePage))
                this._pages.get(this._activePage).onPageSwitch();

            this._activePage = page;
    
            p.onPageActive();
            return;
        }


        this._domElement.innerHTML = this._clearHtml;        
    }

    static create(domElement, clearHtml) {
        return new PageSwitcher(domElement, clearHtml);
    }
}


const __CLEAR_HTML_PAGE = `
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