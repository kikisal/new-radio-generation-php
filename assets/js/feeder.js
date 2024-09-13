/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 */
const DEBUG_MODE = true;


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
    }

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

        this._renderMode  = 'replace';
        
        this._appendLength = 0; 
        this._appendIndex  = 0;

        this._innerText   = null;
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
    constructor(name) {
        this._name = name;
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
    constructor(query) {
        super('DOMRenderer');

        this._elementQuery        = query;
        this._renderElement       = domSelect(query);
        this._currentView         = null;
        this._viewList            = [];
        this._debugger            = Debugger.createDebugger(this);
 

        // this is used to ensure other modules do not override what's currently being rendered
        // on the _renderElement.
        this._stopFutherRendering = false;

        this._debugger.registerListener(this);

        this.addView('stack-trace-view', StackTraceView);
    }

    onDebugLog(message) {
        if (Debugger.debuggingMode())
        {
            if (this.viewExists('stack-trace-view')) {
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
            
            this._renderElement.innerHTML = '';
            this._renderElement.appendChild(this._currentView.getViewElement());
            
            this._currentView.onComponentMounted();

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


class Feeder extends Module {

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
        this._domRenderer      = new DOMRenderer(elementQuery);

        this._retryAttemps     = 0;

        this._feeds            = [];
        this._initialTimestamp = -1;
        
        this._loaded           = false;


        this._lastScrollPos    = undefined;
        this._lastScrolledTime = undefined;
        this._scrollTreshold   = 200;

        this._scrolledBottom   = false;
        this._scrollWatcher    = setInterval((() => {
            const el = document.querySelector('html');
            const scrollPos = el.scrollHeight - el.clientHeight - el.scrollTop;

            if (Math.abs(scrollPos) < this._scrollTreshold && !this._scrolledBottom) {
                this._scrolledBottom = true;
                this.onScrollBottom();
            }
        }).bind(this), 1000);

        window.addEventListener('scroll', this.onScrollChange.bind(this));

        this._debugger.registerListener(this);
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

    onScrollBottom() {
       this.feeds();
    }

    getRenderer() {
        return this._domRenderer;
    }

    onDebugLog(message) {
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
        this.clear();
        
        if (!await this.createFeedSession()) {
            
            const retryingText = textConditional(
                `, retrying in ${formatNumber(Feeder.RETRY_FEED_TIMEOUT / 1000, 2)}s`, 
                '', 
                this._retryAttemps < Feeder.MAX_RETRYING_ATTEMPS
            ); 
            
            this._debugger.log(`Couldn't load feeds${retryingText}`);

            if (this._retryAttemps >= Feeder.MAX_RETRYING_ATTEMPS) {
                this._scrolledBottom = false; // ENABLE SCROLLING AGAIN
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

        this.feeds();

        return true;
    }

    async feeds() {
        if (!this._loaded)
            return;
        
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

        this._scrolledBottom = false; // ENABLE SCROLLING AGAIN
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

function domSelect(query) {
    return document.querySelector(query);
}



