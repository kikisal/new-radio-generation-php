/**
 * @author weeki - github: https://github.com/kikisal
 * for any bugs, report it here: https://github.com/kikisal/new-radio-generation-php/issues 
 */

((m) => {
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

    class MarkupComponent {
        constructor(viewClass, props) {
            this._viewClass  = viewClass;
            this._props      = props;
        }

        static create(viewClass, props) {
            return new MarkupComponent(viewClass, props);
        }

        get viewClass() {
            return this._viewClass;
        }

        get props() {
            return this._props;
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

            this._events      = new Map/*<string, EventFunction[]>*/();
        }
    
        addEventListener(event, fn) {
            if (!this.getViewElement())
                return;

            let list = this._events.get(event);
            if (!list) {
                list = [];
                this._events.set(event, list);
            }

            list.push(fn);

            this.getViewElement().addEventListener(event, fn);
        }

        removeEventListener(event, fn) {
            if (!this.getViewElement())
                return;
            
            const list = this._events.get(event);
            if (!list)
                return;

            if (list.length < 1)
            {
                this._events.delete(event);
                return;
            }

            const index = list.indexOf(fn);
            if (index < 0)
                return;

            this.getViewElement().removeEventListener(event, fn);
            list.splice(index, 1);            
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

            const viewElement = this.getViewElement();
    
            if (viewElement) {
                for (const pair of this._events) {
                    const type   = pair[0];
                    const events = pair[1];
                    for (const e of events)
                        viewElement.removeEventListener(type, e);        
                }

                this.getViewElement().innerHTML = '';
            }

            this._events.clear();
    
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

        markupComponent(viewClass, props) {
            return MarkupComponent.create(viewClass, props);
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
                    if (c instanceof MarkupComponent)
                        comp.appendComponent(comp.createComponent(c.viewClass, c.props));
                    else
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

        setAttribute(key, value) {
            if (!this.getViewElement())
                return;
    
            this.getViewElement().setAttribute(key, value);
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
                    return result;
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
    
    class GlobalRouting extends Module {
        constructor(routes) {
            super('GlobalRouting');
    
            this._routes       = routes;
            this._startRouting = false;
    
            this._controllers = [];

            this.updateURI();
    
            const pushState = history.pushState;
    
    
            history.pushState = function(state) {
                const result = pushState.apply(history, arguments);
                
                this.onPushState();
                return result;
            }.bind(this);
    
            window.addEventListener('popstate', this.onPopState.bind(this));

        }

        addController(controller) {
            this._controllers.push(controller);
        }
    
        updateURI() {
            this._uri = window.location.pathname;
        }
        
        currentRoute() {
            return this.uri();
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

            this._fireControllersEvents(uri);
    
            route();
        }

        _fireControllersEvents(uri) {
            for (const c of this._controllers) {
                
                try {
                    c.onRoute(uri);
                } catch(ex) {
                    console.error('[GlobalRouting] Exception: ', ex);
                }
            }
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

        clearTarget(clearHtml) {
            this._renderElement.innerHTML = clearHtml;
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
    
    m.createComponent       = createComponent;
    m.compClassFromString   = compClassFromString;
    m.View                  = View;
    m.CustomComponent       = CustomComponent;
    m.HTMLDivComponent      = HTMLDivComponent;
    m.HTMLImageComponent    = HTMLImageComponent;
    m.HTMLSpanComponent     = HTMLSpanComponent;
    m.HTMLH1Component       = HTMLH1Component;
    m.StackTraceView        = StackTraceView;
    m.GlobalRouting         = GlobalRouting;
    m.PageSwitcher          = PageSwitcher;
    m.DOMRenderer           = DOMRenderer;
    
})(window);