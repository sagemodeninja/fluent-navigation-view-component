import { CustomComponent } from '.';
import anime from 'animejs/lib/anime.es.js';
import { FluentNavigationViewItem } from './fluent-navigation-view-item';
import { FluentNavigationViewMenuItems } from './fluent-navigation-view-menu-items';

export class FluentNavigationView extends CustomComponent {
    static customElement = 'fluent-navigation-view';
    static styles = `
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
            height: calc(100% - 48px);
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
    `;
    
    isExpanded: boolean;
    
    private _navigationPane: HTMLDivElement;
    private _paneTitle: HTMLSpanElement;
    private _contentHeader: HTMLDivElement;
    private _contentTitle: HTMLHeadingElement;
    private _itemsSlot: HTMLSlotElement;
    private _settingsItem: FluentNavigationViewItem;
    private _activeMenuItem: FluentNavigationViewMenuItems;
    private _selectedItem: FluentNavigationViewItem;

    constructor() {
        super();
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

    set alwaysShowHeader(value: boolean) {
        this.toggleAttribute("always-show-header", value);
    }

    get isSettingsVisible() {
        return this.getAttribute("is-settings-visible") !== "false";
    }

    set isSettingsVisible(value: boolean) {
        this.toggleAttribute("is-settings-visible", value);
    }

    /* DOM */
    get navigationPane() {
        this._navigationPane ??= this.shadowRoot.querySelector(".navigation-pane");
        return this._navigationPane;
    }

    get items(): FluentNavigationViewItem[] {
        const items = Array.from(this.querySelectorAll("fluent-navigation-view-item")) as FluentNavigationViewItem[];
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

    get itemsSlot() {
        this._itemsSlot ??= this.shadowRoot.querySelectorAll("slot")[0];
        return this._itemsSlot;
    }

    get activeMenuItem() {
        return this._activeMenuItem;
    }

    set activeMenuItem(value) {
        this._activeMenuItem = value;
    }

    render() {
        return `
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
        
        this.itemsSlot.addEventListener("slotchange", () => {
            var menuItem = this.itemsSlot.assignedElements()[0];

            menuItem.addEventListener("itemschange", () => {
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
    setDisplayMode(old?: string) {
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
                    this.toggleSelection(item);

                    const headerSrc = this.getAttribute("header-src") ?? "content";
                    this.setAttribute("header", item.getAttribute(headerSrc));

                    return false;
                }
            }

            return true;
        });
    }

    onItemSelected(item) {
        this.toggleSelection(item);
        const eventDetails = {
            sender: this,
            args: {
                isSettingsSelected: item === this._settingsItem,
                selectedItem: item
            }
        };

        this.dispatchEvent(new CustomEvent("selectionchanged", { bubbles: true, detail: eventDetails }));
    }

    toggleSelection(item) {
        if (this._selectedItem !== item)
            this._selectedItem?.classList.remove("active");

        this._selectedItem = item;
    }

    dismissPane() {
        const classes = this.classList;

        if ((classes.contains("leftcompact") || window.innerWidth < 768) && classes.contains("expanded")) {
            this.classList.remove("expanded");
            this.dispatchEvent(new CustomEvent("invoked"));

            if (window.innerWidth < 768)
                anime({
                    targets: this.navigationPane,
                    left: "-281px",
                    duration: 150,
                    easing: "easeInOutQuad"
                });
        }
    }
}