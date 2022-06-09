import anime from "https://cdn.jsdelivr.net/gh/juliangarnier/anime@v3.2.1/src/index.min.js";

(function () {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
    .ms-Icon {
        font-family: 'Segoe Fluent Icons', sans-serif;
        text-rendering: optimizeLegibility;
    }
    :host {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        row-gap: 4px;
        user-select: none;
        width: 100%;
    }
    
    /* Button */
    .button {
        align-items: center;
        background-color: transparent;
        border-radius: 5px;
        box-sizing: border-box;
        color: #1b1b1b;
        display: flex;
        height: 36px;
        margin: 0 4px;
        min-height: 36px;
        padding: 0 3px;
        position: relative;
    }
    
    .button:hover,
    :host(.active) .button {
        background-color: rgba(156, 156, 156, 0.1);
    }
    
    :host(.active) .button:hover {
        background-color: rgba(160, 160, 160, 0.06);
    }
    
    .button:active {
        color: rgba(27, 27, 27, 0.49) !important;
    }
    
    /* Indicator */
    :host(.active) .button::before {
        background-color: #1976d2;
        border-radius: 2px;
        content: '';
        display: block;
        height: 16px;
        left: 0;
        position: absolute;
        top: 10px;
        width: 3px;
    }
    
    .button span,
    .button fluent-symbol-icon,
    .button ::slotted(*) {
        margin: 0 9px;
    }
    
    /* Content */
    .content {
        flex-grow: 1;
        font-family: 'Segoe UI Variable Text', sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 36px;
        overflow: hidden;
        padding-right: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    /* Chevron */
    .chevron::before {
        content: '\\E70D';
        font-size: 12px;
    }
    
    :host(.expanded) .chevron::before {
        content: '\\E70E';
    }
    
    /* Sub menu items offset. */
    :host(.with-offset) .button {
        padding-left: 39px;
    }
    
    :host(.with-offset) .button::before {
        left: 27px;
    }
    </style>
    <div class='button'>
        <fluent-symbol-icon class='icon'></fluent-symbol-icon>
        <slot name='icon'>
        </slot>
        <span class='content'></span>
        <span class='ms-Icon chevron'></span>
    </div>
    <slot></slot>
    `;

    class FluentNavigationViewItem extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.append(template.content.cloneNode(true));

            this.toggleOffset = this.toggleOffset.bind(this);
        }

        static get observedAttributes() {
            return ["icon", "content"];
        }

        /* Attributes */
        get icon() {
            return this.getAttribute("icon");
        }

        set icon(value) {
            this.setAttribute("icon", value);
            this.setIcon();
        }

        get content() {
            return this.getAttribute("content");
        }

        set content(value) {
            this.setAttribute("content", value);
            this.setContent();
        }

        get tag() {
            return this.getAttribute("tag");
        }

        set tag(value) {
            this.setAttribute("tag", value);
        }

        get href() {
            return this.getAttribute("href");
        }

        set href(value) {
            this.setAttribute("href", value);
        }

        /* DOM */
        get parentView() {
            this._parentView ??= (this.closest("fluent-navigation-view") ?? this.getRootNode().host);
            return this._parentView;
        }

        get parentMenu() {
            this._parentMenu ??= this.closest("fluent-navigation-view-item fluent-navigation-view-menu-items");
            return this._parentMenu;
        }

        get subMenu() {
            this._subMenu ??= this.querySelector("fluent-navigation-view-menu-items");
            return this._subMenu;
        }

        get button() {
            this._button ??= this.shadowRoot.querySelector(".button");
            return this._button;
        }

        get iconSpan() {
            this._iconSpan ??= this.shadowRoot.querySelector(".icon");
            return this._iconSpan;
        }

        get customIconSlot() {
            this._customIconSpan ??= this.shadowRoot.querySelector("slot[name=icon]");
            return this._customIconSpan;
        }

        get contentSpan() {
            this._contentSpan ??= this.shadowRoot.querySelector(".content");
            return this._contentSpan;
        }

        /* Helpers */
        get isParent() {
            return this.subMenu !== null;
        }

        get selectsOnInvoke() {
            const selectsOnInvoke = eval(this.getAttribute("selects-on-invoke"));
            return selectsOnInvoke == null || selectsOnInvoke;
        }

        connectedCallback() {
            this.setIcon();
            this.setContent();

            // Chevron.
            customElements
                .whenDefined("fluent-navigation-view-menu-items")
                .then(_ => {
                    const chevron = this.shadowRoot.querySelector(".chevron");
                    chevron.style.display = this.subMenu ? "block" : "none";
                });

            // Sub-item offset.
            if (this.parentMenu) {
                this.toggleOffset();
                this.parentView.addEventListener("invoked", this.toggleOffset);
            }

            // Event listeners.
            this.button.addEventListener("click", e => {
                this.classList.toggle("active", this.selectsOnInvoke);

                // Collapse active menu.
                var activeMenu = this.parentView.activeMenuItem;
                var isParentExpanded = this.parentView.classList.contains("expanded");

                if (!isParentExpanded && (this.subMenu === null || activeMenu !== this.subMenu)) {
                    activeMenu?.classList?.remove("expanded");
                    activeMenu?.parentItem.classList.remove("expanded");
                }

                // Events.
                this.dispatchEvent(new CustomEvent("invoked"));

                if (this.selectsOnInvoke)
                    this.dispatchEvent(new CustomEvent("selected"));
            });

            this.customIconSlot.addEventListener("slotchange", e => {
                const hasCustomIcons = this.customIconSlot.assignedNodes().length > 0;

                this.iconSpan.style.display = hasCustomIcons ? "none" : "inline-block";
                this.customIconSlot.style.display = hasCustomIcons ? "default" : "none";
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "icon": this.setIcon(); break;
                case "content": this.setContent(); break;
            }
        }

        /* Functions */
        setIcon() {
            this.iconSpan.setAttribute("symbol", this.icon ?? "");
        }

        setContent() {
            this.contentSpan.textContent = this.content;
        }

        toggleOffset() {
            this.classList.toggle("with-offset", this.parentView.classList.contains("expanded"));
        }

        setSelected(selected) {
            this.classList.toggle("active", selected && this.selectsOnInvoke);

            const isParentExpanded = this.parentView.classList.contains("expanded");
            this.parentMenu?.classList.toggle("expanded", selected && isParentExpanded);
        }
    }

    customElements.define("fluent-navigation-view-item", FluentNavigationViewItem);
})();

(function () {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
    :host {
        background-color: #fff;
        display: flex;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    .navigation-pane {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        left: 0;
        position: absolute;
        row-gap: 4px;
        top: 0;
    }
    
    .navigation-pane {
        background-color: #f2f2f2;
        left: -281px;
        max-height: 100%; /* TODO: Check if important. */
        padding-bottom: 8px;
        padding-top: 44px; /* 36px height, 8px total padding. */
        width: 280px;
        z-index: 2;
    }

    :host(.expanded) .navigation-pane {
        background-color: rgba(238, 238, 238, 0.76);
        -webkit-backdrop-filter: saturate(180%) blur(100px);
        backdrop-filter: saturate(180%) blur(100px);
        border-right: solid 1px #e5e5e5;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
    }
    
    /* Button */
    .nav-button {
        align-items: center;
        background-color: transparent;
        border-radius: 5px;
        box-sizing: border-box;
        color: #1b1b1b;
        display: flex;
        height: 36px;
        left: 4px;
        min-height: 36px;
        padding: 0 3px;
        position: absolute;
        top: 4px;
        user-select: none;
        z-index: 3;
    }
    
    .nav-button:hover {
        background-color: rgba(156, 156, 156, 0.1);
    }
    
    .nav-button:active {
        color: #838383 !important;
    }
    
    :host(.no-title) .nav-button {
        align-self: start;
    }

    :host(.expanded:not(.no-title)) .nav-button {
        min-width: 272px;
    }
    
    .nav-button span,
    .nav-button fluent-symbol-icon {
        margin: 0 9px;
    }
    
    /* Icons */
    .nav-button .nav-icon {
        transition: transform .1s;
        transition-timing-function: ease-in;
    }

    .nav-button:active .nav-icon {
        transform: scaleX(.50);
    }
    
    /* Pane title */
    .pane-title {
        flex-grow: 1;
        font-family: 'Segoe UI Variable Text', sans-serif;
        font-size: 14px;
        font-weight: 600;
        line-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    :host(.no-title) .pane-title {
        display: none;
    }
    
    .menu-items-container {
        flex-grow: 1;
        overflow-y: auto;
    }
    
    .content-frame {
        flex-grow: 1;
        position: relative;
        z-index: 1;
    }

    .content {
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: calc(100% - 44px);
        left: 0;
        overflow: hidden;
        position: absolute;
        top: 44px;
        width: 100%;
    }
    
    .content-header {
        box-sizing: border-box;
        display: flex;
        height: 48px;
        padding-left: 20px;
        transition: height .3s, padding .3s;
    }
    
    .content-title {
        font-family: 'Segoe UI Variable Display', sans-serif;
        font-size: 28px;
        font-weight: 600;
        line-height: 48px;
        margin: 0;
    }

    ::slotted(fluent-navigation-view-header-content) {
        align-items: center;
        display: flex;
        flex-grow: 1;
        margin-left: 10px;
        transition: height .3s;
    }

    ::slotted(fluent-navigation-view-content-frame) {
        height: calc(100% - 63px);
        overflow: auto;
        width: 100%;
    }

    /* Tablet */
    @media only screen and (min-width: 768px) {
        :host {
            background-color: #f2f2f2;
        }

        .navigation-pane {
            left: 0;
            width: 47px;
        }

        .content-frame {
            margin-left: 47px;
        }

        .content {
            background-color: #fff;
            border-left: solid 1px #e5e5e5;
            border-top: solid 1px #e5e5e5;
            border-top-left-radius: 6px;
        }

        .content-header {
            height: 80px;
            padding-left: 40px;
            padding-top: 32px;
        }

        ::slotted(fluent-navigation-view-content-frame) {
            height: calc(100% - 80px);
        }
    }

    /* Desktop */
    @media only screen and (min-width: 992px) {
        :host(:not(.leftcompact)) .navigation-pane {
            position: relative;
        }
        
        :host(.expanded) .navigation-pane {
            background-color: #f2f2f2;
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
        }

        :host(.expanded:not(.leftcompact)) .navigation-pane {
            border: none;
            border-radius: 0;
        }

        :host(:not(.leftcompact)) .content-frame {
            margin-left: 0;
        }
    }
    </style>
    <div class='nav-button'>
        <fluent-symbol-icon symbol='GlobalNavButton' font-size='15' class='nav-icon'></fluent-symbol-icon>
        <span class='pane-title'></span>
    </div>
    <div class='navigation-pane'>
        <div class='menu-items-container'>
            <slot></slot>
        </div>
        <fluent-navigation-view-item icon='Settings' content='Settings' class='settings-item'></fluent-navigation-view-item>
    </div>
    <div class='content-frame'>
        <div class='content'>
            <div class='content-header'>
                <h1 class='content-title'></h1>
                <slot name='header-content'></slot>
            </div>
            <slot name='content-frame'></slot>
        </div>
    </div>
    `;

    class FluentNavigationView extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.isExpanded = false;
        }

        static get observedAttributes() {
            return ["pane-display-mode", "header", "always-show-header", "pane-title", "is-settings-visible"];
        }

        /* Attributes */
        get header() {
            return this.getAttribute("header");
        }

        set header(value) {
            this.setAttribute("header", value);
        }

        get paneTitle() {
            return this.getAttribute("pane-title") ?? "";
        }

        set paneTitle(value) {
            this.setAttribute("pane-title", value);
        }

        get alwaysShowHeader() {
            return this.getAttribute("always-show-header") !== "false";
        }

        set alwaysShowHeader(value) {
            this.setAttribute("always-show-header", value);
        }

        get isSettingsVisible() {
            return this.getAttribute("is-settings-visible") !== "false";
        }

        set isSettingsVisible(value) {
            this.setAttribute("is-settings-visible", value);
        }

        /* DOM */
        get navigationPane() {
            this._navigationPane ??= this.shadowRoot.querySelector(".navigation-pane");
            return this._navigationPane;
        }

        get items() {
            const items = Array.from(this.querySelectorAll("fluent-navigation-view-item"));
            items.push(this.settingsItem);

            return items;
        }

        get paneTitleSpan() {
            this._paneTitle ??= this.shadowRoot.querySelector(".pane-title");
            return this._paneTitle;
        }

        get contentHeader() {
            this._contentHeader ??= this.shadowRoot.querySelector(".content-header");
            return this._contentHeader;
        }

        get contentTitle() {
            this._contentTitle ??= this.shadowRoot.querySelector(".content-title");
            return this._contentTitle;
        }

        get settingsItem() {
            this._settingsItem ??= this.shadowRoot.querySelector(".settings-item");
            return this._settingsItem;
        }

        get activeMenuItem() {
            return this._activeMenuItem;
        }

        set activeMenuItem(value) {
            this._activeMenuItem = value;
        }

        connectedCallback() {
            // Defaults.
            this.setDisplayMode();
            this.setPaneTitle();
            this.setHeader();
            this.setSettingsVisibility();

            // Nav button.
            const navButton = this.shadowRoot.querySelector(".nav-button");
            navButton.addEventListener("click", e => {
                this.classList.toggle("expanded");
                this.isExpanded = this.classList.contains("expanded");

                const width = window.innerWidth;
                if (width < 768) {
                    anime({
                        targets: this.navigationPane,
                        left: this.isExpanded ? "0px" : "-281px",
                        duration: 150,
                        easing: "easeInOutQuad"
                    });
                } else if (width >= 768) {
                    anime({
                        targets: this.navigationPane,
                        width: this.isExpanded ? "280px" : "47px",
                        duration: 150,
                        easing: "easeInOutQuad"
                    });
                }

                this.dispatchEvent(new CustomEvent("invoked"));
                e.stopPropagation();
            });

            // Nav pane.
            const navPane = this.shadowRoot.querySelector(".navigation-pane");
            navPane.addEventListener("click", e => e.stopPropagation());

            customElements
                .whenDefined("fluent-navigation-view-item")
                .then(_ => {
                    this.items.forEach(item => {
                        item.addEventListener("selected", () => this.onItemSelected(item));
                        item.addEventListener("invoked", () => {
                            if (!item.isParent)
                                this.dismissPane();
                        });
                    });

                    // Selects an item on load by href.
                    this.navigate(window.location.toString());
                });

            window.addEventListener("click", () => {
                this.dismissPane();

                this.activeMenuItem?.classList?.remove("expanded");
                this.activeMenuItem?.parentItem.classList.remove("expanded");
            });

            window.addEventListener("resize", e => {
                const width = window.innerWidth;
                const style = this.navigationPane.style;
                const mode = this.getAttribute("pane-display-mode");

                if (width < 768) {
                    style.left = "-281px";
                    style.width = "280px";
                }
                else if (width >= 768) {
                    style.left = "0px";
                    style.width = width >= 992 && mode === "left" && this.isExpanded ? "280px" : "47px";
                }

                if (width < 992) {
                    this.classList.toggle("expanded", false);
                    this.dispatchEvent(new CustomEvent("invoked"));
                } else {
                    this.classList.toggle("expanded", mode === "left" && this.isExpanded);
                    this.dispatchEvent(new CustomEvent("invoked"));
                }
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "header":
                case "always-show-header":
                    this.setHeader();
                    break;
                case "pane-display-mode": this.setDisplayMode(oldValue); break;
                case "pane-title": this.setPaneTitle(); break;
                case "is-settings-visible": this.setSettingsVisibility(); break;
            }
        }

        /* Functions */
        setDisplayMode(old) {
            const mode = this.getAttribute("pane-display-mode");

            this.classList.add(mode ?? "leftcompact");
            this.classList.toggle(old, old === mode);

            this.isExpanded = mode === "left" && window.innerWidth > 992;
            this.classList.toggle("expanded", this.isExpanded);

            if (this.isExpanded)
                this.navigationPane.style.width = "280px";

            this.dispatchEvent(new CustomEvent("invoked"));
        }

        setHeader() {
            this.contentTitle.textContent = this.header;
            this.contentHeader.style.display = this.alwaysShowHeader ? "flex" : "none";
        }

        setPaneTitle() {
            this.paneTitleSpan.textContent = this.paneTitle;
            this.classList.toggle("no-title", this.paneTitle === "");
        }

        setSettingsVisibility() {
            this.settingsItem.style.display = this.isSettingsVisible ? "flex" : "none";
        }

        navigate(href) {
            this.items.every(item => {
                if (item.href) {
                    let targetHref = window.location.href;
                    let itemHref = new URL(item.href, href).href;
                    
                    // Cleanup.
                    if (targetHref.endsWith("/")) targetHref = targetHref.slice(0, -1);
                    if (itemHref.endsWith("/")) itemHref = itemHref.slice(0, -1);

                    if (this.hasAttribute("selects-on-load") && itemHref === targetHref) {
                        item.setSelected(true);
                        this._selectedItem = item;

                        const headerSrc = this.getAttribute("header-src") ?? "content";
                        this.setAttribute("header", item.getAttribute(headerSrc));

                        return false;
                    }
                }

                return true;
            });
        }

        onItemSelected(item) {
            if (this._selectedItem !== item)
                this._selectedItem?.classList.remove("active");

            this._selectedItem = item;

            const eventDetails = {
                sender: this,
                args: {
                    isSettingsSelected: item === this._settingsItem,
                    selectedItem: item
                }
            };

            this.dispatchEvent(new CustomEvent("selectionchanged", { bubbles: true, detail: eventDetails }));
        }

        dismissPane() {
            const classes = this.classList;

            if ((classes.contains("leftcompact") || window.innerWidth < 768) && classes.contains("expanded")) {
                this.classList.remove("expanded");
                this.dispatchEvent(new CustomEvent("invoked"));

                if(window.innerWidth < 768)
                    anime({
                        targets: this.navigationPane,
                        left: "-281px",
                        duration: 150,
                        easing: "easeInOutQuad"
                    });
            }
        }
    }

    customElements.define("fluent-navigation-view", FluentNavigationView);
})();

(function () {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
    :host {
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        row-gap: 4px;
        user-select: none;
        width: 100%;
    }

    :host(.compact-mode) {      
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2), 0 calc(32 * 0.5px) calc((32 * 1px)) rgba(0, 0, 0, 0.24);
        left: 54px;
        padding: 8px 0;
        position: fixed;
        width: auto;
        z-index: 1;
    }

    :host(.sub-menu-item:not(.expanded)) {
        display: none;
    }

    :host(.sub-menu-item.compact-mode.expanded)
    {
        background-color: rgba(255, 255, 255, 0.76);
        -webkit-backdrop-filter: saturate(180%) blur(100px);
        backdrop-filter: saturate(180%) blur(100px);
    }
    </style>
    <slot></slot>
    `;

    class FluentNavigationViewMenuItems extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.toggleMode = this.toggleMode.bind(this);
        }

        /* DOM */
        get parentView() {
            this._parentView ??= this.closest("fluent-navigation-view");
            return this._parentView;
        }

        get parentItem() {
            this._parentItem ??= this.closest("fluent-navigation-view-item");
            return this._parentItem;
        }

        connectedCallback() {
            if (this.parentItem === null)
                return;

            this.classList.add("sub-menu-item");
            this.toggleMode();

            this.parentView.addEventListener("invoked", this.toggleMode);
            this.parentItem.addEventListener("invoked", () => {
                const expanded = this.classList.toggle("expanded");

                this.parentItem.classList.toggle("expanded", expanded);
                this.parentView.activeMenuItem = expanded && this.classList.contains("compact-mode") ? this : null;
            });

            this.addEventListener("click", e => e.stopPropagation());
        }

        /* Functions */
        toggleMode() {
            const compactMode = !this.parentView.classList.contains("expanded");

            this.classList.toggle("compact-mode", compactMode);

            if (compactMode) {
                this.classList.toggle("expanded", false);
                this.parentItem.classList.remove("expanded");
            }
        }
    }

    customElements.define("fluent-navigation-view-menu-items", FluentNavigationViewMenuItems);
})();

(function () {
    const template = document.createElement("template");
    template.innerHTML = `
    <style>
    :host {
        align-items: center;
        box-sizing: border-box;
        display: flex;
        height: 36px;
        opacity: 1;
        padding-left: 12px;
        user-select: none;
        width: 100%;
    }

    :host .content {
        color: #5d5d5d;
        font-family: 'Segoe UI Variable Text', sans-serif;
        font-size: 14px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Desktop */
    @media only screen and (min-width: 768px) {
        :host {
            transition: height .15s;
            transition-timing-function: ease-out;
        }

        :host(:not(.visible))
        {
            height: 0;
            opacity: 0;
        }
        
        :host(.visible) {
            transition: opacity .25s, height .18s;
            transition-timing-function: ease-in;
        }
    }
    </style>
    <span class='content'></span>
    <slot></slot>
    `;

    class FluentNavigationViewItemHeader extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.toggleVisibility = this.toggleVisibility.bind(this);
        }

        /* DOM */
        get parentView() {
            this._parentView ??= this.closest("fluent-navigation-view");
            return this._parentView;
        }

        connectedCallback() {
            const content = this.shadowRoot.querySelector("span.content");
            content.textContent = this.getAttribute("content");

            this.toggleVisibility();
            this.parentView.addEventListener("invoked", this.toggleVisibility);
        }

        /* Functions */
        toggleVisibility() {
            this.classList.toggle("visible", this.parentView.classList.contains("expanded"));
        }
    }

    customElements.define("fluent-navigation-view-item-header", FluentNavigationViewItemHeader);
})();

(function() {
    const template = document.createElement("template");
    template.innerHTML = `<slot></slot>`;

    class FluentNavigationViewHeaderContent extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.setAttribute("slot", "header-content");
        }
    }

    customElements.define("fluent-navigation-view-header-content", FluentNavigationViewHeaderContent);
})();

(function() {
    const template = document.createElement("template");
    template.innerHTML = `<slot></slot>`;

    class FluentNavigationViewContentFrame extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            this.setAttribute("slot", "content-frame");
        }
    }

    customElements.define("fluent-navigation-view-content-frame", FluentNavigationViewContentFrame);
})();