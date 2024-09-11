
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

        if (!JSONValidator.validate(data, FeedsModel) && false) {
            console.warn(`Error while loading feeds: Invalid returned data. `, data);
            return null;
        }

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

    if (instance instanceof HTMLDivComponent || instance instanceof CustomComponent)
        domElement = document.createElement('div');
    else if (instance instanceof HTMLSpanComponent) {
        domElement = document.createElement('span');
        domElement.textContent = instance.getTextContent();
    }

    instance.setViewElement(domElement);

    if (classList && domElement)
        domElement.classList.add(...classList);

    instance.setRenderer(renderer);

    instance.onViewCreated();

    return instance;
}

class View {
    constructor() {
        this._viewElement = null;
        this._needsUpdate = false;
        this._parent      = null;
        this._children    = [];
        this._renderer    = null;
        this._name        = null;
    }

    onComponentMounted() {

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
    }


    keep() {

    }

    append(components) {
        this._children = this._children.concat(components);
    }

    comp(arr) {
        this._children = arr;
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

        this.onStateUpdate(state);
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


// stock components
class HTMLDivComponent extends View {
    constructor() {
        super();
    }

    render() {

    }
}

class HTMLSpanComponent extends View {
    constructor(text) {
        super();
        this._textContent = text;
    }

    getTextContent() {
        return this._textContent;
    }

    render() {

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
    renderView(view, data) {

        if (this._stopFutherRendering)
            return false;

        if (this._currentView && this._currentView.name == view) {
            // just update data.

            this._currentView.updateState(data);
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


        this.renderComponent(this._currentView);
        
        this._renderElement.innerHTML = '';
        this._renderElement.appendChild(this._currentView.getViewElement());
        
        this._currentView.onComponentMounted();

        /*
        if (data !== null)
            this._currentView.updateState(data);
        */
        
        return true; 
    }

    renderComponent(c) {
        const viewElement = c.getViewElement();
        viewElement.innerHTML = '';

        c.render();

        if (!c.children())
            return;

        for (const child of c.children())
        {    
            this.renderComponent(child);
            viewElement.appendChild(child.getViewElement());

            child.onComponentMounted();


            if (child instanceof HTMLSpanComponent)
                child.getViewElement().textContent = child.getTextContent();
        }
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


        this._debugger.registerListener(this);
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

            if (this._retryAttemps >= Feeder.MAX_RETRYING_ATTEMPS)
                return false;

            this._scheduler.schedule((() => {
                ++this._retryAttemps;

                this.load();
            }).bind(this), 5000);

            return false;
        }

        this._retryAttemps = 0;
        this._currentChunk = 0;

        this.feeds();

        return true;
    }

    async feeds() {
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

        setTimeout((() => {
            this._domRenderer.updateViewState("feeds-view", newFeeds);
        }).bind(this), 5000);
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



