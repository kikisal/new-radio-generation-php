/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 */

((m) => {
    const DEBUG_MODE = rg_config.DEBUG_MODE;

    function domSelect(query) {
        return document.querySelector(query);
    }

    function domSelectAll(query) {
        return document.querySelectorAll(query);
    }
    
    function textConditional(t1, t2, pred) {
        return pred ? t1 : t2;
    }
    
    function formatNumber(n, digits) {
        return new Number(n).toFixed(digits);
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
    
            return data;
        } catch(err) {
            console.warn(`Error while loading feeds: `, err);
            return null;
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
        
        detachListener() {
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

    m.DEBUG_MODE           = DEBUG_MODE;
    m.domSelect            = domSelect;
    m.domSelectAll         = domSelectAll;
    m.textConditional      = textConditional;
    m.formatNumber         = formatNumber;
    m.http_fetch           = http_fetch;
    m.Module               = Module;
    m.DebuggerProxy        = DebuggerProxy;
    m.Debugger             = Debugger;
    m.SScheduler           = SScheduler;
    m.OneTimeScrollWatcher = OneTimeScrollWatcher; 
})(window);