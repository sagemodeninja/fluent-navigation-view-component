class SegoeFluentIcon {
    constructor() {}

    static buildCss() {
        var css = "";
        segoeFluentIcons.forEach(icon => {
            css += `
            .ms-Icon--${icon.name}::before {
                content: '\\${icon.glyph}';
            }

            `;
        });

        return css;
    }
}

const navigationViewStyles = `
:host {
    background-color: #f2f2f2;
    display: flex;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
}

.navigation-pane {
    background-color: #f2f2f2;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    padding: 4px 0;
    padding-left: 12px;
    row-gap: 4px;
    user-select: none;
    width: 59px;
}

:host(.expanded) .navigation-pane {
    width: 280px;
}

/* Button */
.button {
    align-items: center;
    background-color: transparent;
    border-radius: 5px;
    box-sizing: border-box;
    color: #191919;
    display: flex;
    height: 36px;
    margin: 0 4px;
    min-height: 36px;
    padding: 0 3px;
    position: relative;
}

.button:hover {
    background-color: #e9e9e9;
}

.button:active {
    color: #838383 !important;
}

.button span {
    margin: 0 9px;
}

/* Icons */
.icon {
    font-family: 'Segoe Fluent Icons', sans-serif;
    font-size: 15px;
    line-height: 15px;
    text-rendering: optimizeLegibility;
    width: 15px;
}

.nav-icon::before {
    content: '\\e700'
}

.button:active .nav-icon {
    transform: scaleX(.75);
}

/* Pane title */
.pane-title {
    color: #191919;
    flex-grow: 1;
    font-family: 'Segoe UI Variable Text', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.menu-items-container {
    flex-grow: 1;
    overflow-y: auto;
}

.settings-item {
    margin: 8px 0;
}

.content-frame {
    flex-grow: 1;
    position: relative;
}

.content {
    background-color: #fff;
    border-left: solid 1px #e5e5e5;
    border-radius: 6px;
    border-top: solid 1px #e5e5e5;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: calc(100% - 44px);
    left: 0;
    position: absolute;
    top: 44px;
    width: 100%;
}

.content-header {
    padding-top: 35px;
    padding-left: 40px;
}

.content-title {
    font-family: 'Segoe UI Variable Display', sans-serif;
    font-size: 28px;
    font-weight: 600;
    line-height: 22px;
    margin: 0;
}
`;

const navigationViewItemStyles = `
.ms-Icon {
    font-family: 'Segoe Fluent Icons', sans-serif;
    text-rendering: optimizeLegibility;
}

${SegoeFluentIcon.buildCss()}

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
    color: #191919;
    display: flex;
    height: 36px;
    margin: 0 4px;
    min-height: 36px;
    padding: 0 3px;
    position: relative;
}

.button:hover,
:host([active]) .button {
    background-color: #e9e9e9;
}

:host([active]) .button:hover {
    background-color: #ededed;
}

.button:active {
    color: #838383 !important;
}

/* Indicator */
:host([active]) .button::before {
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

.button span {
    margin: 0 9px;
}

/* Icon */
.icon {
    font-size: 16px;
    line-height: 16px;
    width: 16px;
}

/* Content */
.content {
    flex-grow: 1;
    font-family: 'Segoe UI Variable Text', sans-serif;
    font-size: 14px;
    font-weight: 400;
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

:host([expanded]) .chevron::before {
    content: '\\E70E';
}

/* Sub menu items offset. */
:host(.with-offset) .button {
    padding-left: 39px;
}

:host(.with-offset) .button::before {
    left: 27px;
}
`;

(function() {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>${navigationViewItemStyles}</style>
    <div class='button'>
        <span class='ms-Icon icon'></span>
        <span class='content'></span>
        <span class='ms-Icon chevron'></span>
    </div>
    <slot></slot>
    `;

    class FluentNavigationViewItem extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({mode: 'open'});
            this.shadowRoot.append(template.content.cloneNode(true));
            
            this._parentView = this.closest('fluent-navigation-view');
            this._parentMenu = this.closest('fluent-navigation-view-item fluent-navigation-view-menu-items');
            this._subMenu = this.querySelector('fluent-navigation-view-menu-items');
            this._button = this.shadowRoot.querySelector('div.button');
            this._chevron = this.shadowRoot.querySelector('.chevron');
    
            this._toggleOffset = this._toggleOffset.bind(this);

            this.invokeEvent = new CustomEvent('invoke');
            this.navigationEvent = new CustomEvent('navigation');
        }
        
        connectedCallback() {
            const icon = this._button.querySelector('span.icon');
            icon.classList.add(`ms-Icon--${this.getAttribute('icon')}`);

            const content = this._button.querySelector('span.content');
            content.textContent = this.getAttribute('content');

            if(this._parentMenu !== null) {
                this._toggleOffset();
                this._parentView.addEventListener('invoked', this._toggleOffset);
            }
            
            // Chevron
            this._chevron.style.display = this._subMenu !== null ? "block" : "none";

            this._button.addEventListener('click', e => {
                this.setAttribute('active', '');

                if(this._parentView)
                {
                    var activeMenu = this._parentView.activeMenuItem;
                    var parentIsExpanded = this._parentView.classList.contains('expanded');
    
                    if(!parentIsExpanded && this._parentMenu === null && (this._subMenu === null || activeMenu !== this._subMenu)) {
                        activeMenu?.classList?.remove('expanded');
                    }
    
                    e.stopPropagation();
                }
                
                this.dispatchEvent(this.invokeEvent);
                this.dispatchEvent(this.navigationEvent);
            });
        }

        _toggleOffset() {
            this.classList.toggle('with-offset', this._parentView.classList.contains('expanded'));
        }
    }
    
    customElements.define('fluent-navigation-view-item', FluentNavigationViewItem);
})();

(function() {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>${navigationViewStyles}</style>
    <div class='navigation-pane'>
        <div class='button nav-button'>
            <span class='ms-Icon icon nav-icon'></span>
            <span class='pane-title'></span>
        </div>
        <div class='menu-items-container'>
            <slot></slot>
        </div>
        <fluent-navigation-view-item icon='Settings' content='Settings' class='settings-item'>
    </div>
    </fluent-navigation-view-item>
    <div class='content-frame'>
        <div class='content'>
            <div class='content-header'>
                <h1 class='content-title'></h1>
            </div>
            <slot name='content-frame'></slot>
        </div>
    </div>
    `;

    class FluentNavigationView extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this._header = this.shadowRoot.querySelector('.content-header');
            this._title = this.shadowRoot.querySelector('.content-title');
            this._navButton = this.shadowRoot.querySelector('.nav-button');
            this._paneTitle = this.shadowRoot.querySelector('span.pane-title');
            this._settingsItem = this.shadowRoot.querySelector('.settings-item');

            this._invokedEvent = new CustomEvent('invoked');
            this._selectionChangedEvent = new CustomEvent('selectionchanged');
            
            this._activeMenuItem;
            this._selectedItem;
        }

        get activeMenuItem() {
            return this._activeMenuItem;
        }

        set activeMenuItem(value) {
            this._activeMenuItem = value;
        }

        connectedCallback() {
            this._title.textContent = this.getAttribute('header');
            this._paneTitle.textContent = this.getAttribute('pane-title');
            
            const alwaysShowHeader = eval(this.getAttribute('always-show-header'));
            const isSettingsVisible = eval(this.getAttribute('is-settings-visible'));

            this._header.style.display = alwaysShowHeader === undefined || alwaysShowHeader ? "block" : "none";
            this._settingsItem.style.display = isSettingsVisible === undefined || isSettingsVisible ? "flex" : "none";

            // Event listeners
            this._navButton.addEventListener('click', () => {
                this.classList.toggle('expanded');
                this.dispatchEvent(this._invokedEvent);
            });

            this._settingsItem.addEventListener('navigation', () => this._navigate(this._settingsItem));

            const items = this.querySelectorAll('fluent-navigation-view-item');
            items.forEach(item => {
                if(item.hasAttribute('active')) {
                    this._selectedItem = item;

                    // TODO: No longer used or different implementation.
                    item.parentElement?.parentElement?.setAttribute('expanded', '');
                }
    
                item.addEventListener('navigation', () => this._navigate(item));
            });
        }

        _navigate(item) {
            if(this._selectedItem === item)
                return;

            this._selectedItem?.removeAttribute('active');
            this._selectedItem = item;
            this.dispatchEvent(this._selectionChangedEvent);
        }
    }
    
    customElements.define('fluent-navigation-view', FluentNavigationView);
})();

(function() {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
    :host {
        background-color: #f2f2f2;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        row-gap: 4px;
        user-select: none;
        width: 100%;
    }

    :host(.sub-menu-item:not(.expanded)) {
        display: none;
    }

    :host(.compact-mode) {
        border: solid 1px #e5e5e5;
        left: 64px;
        padding: 8px 0;
        position: fixed;
        width: auto;
        z-index: 1;
    }

    /*
    :host(.expanded) {
        display: flex;
    }
    */
    </style>
    <slot></slot>
    `;

    var activeMenuItem;

    class FluentNavigationViewMenuItems extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this._toggleMode = this._toggleMode.bind(this);

            this._parentView = this.closest('fluent-navigation-view');
            this._parentItem = this.closest('fluent-navigation-view-item');
        }

        connectedCallback() {
            if(this._parentItem === null)
                return;

            this.classList.add('sub-menu-item');
            this._toggleMode();

            this._parentView.addEventListener('invoked', this._toggleMode);
            this._parentItem.addEventListener('invoke', () => {
                const expanded = this.classList.toggle('expanded');
                this._parentView.activeMenuItem = activeMenuItem = expanded && this.classList.contains('compact-mode') ? this : null;
            });

            this.addEventListener('click', e => e.stopPropagation());
        }

        _toggleMode() {
            var compactMode = !this._parentView.classList.contains('expanded');
            
            this.classList.toggle('compact-mode', compactMode);

            if(compactMode)
                this.classList.toggle('expanded', false);
        }
    }

    window.addEventListener('click', e => activeMenuItem?.classList?.remove('expanded'));

    customElements.define('fluent-navigation-view-menu-items', FluentNavigationViewMenuItems);
})();

(function(){
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
    :host {
        align-items: center;
        box-sizing: border-box;
        display: none;
        height: 36px;
        padding-left: 12px;
        user-select: none;
        width: 100%;
    }

    :host(.visible) {
        display: flex;
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
    </style>
    <span class='content'></span>
    <slot></slot>
    `;

    class FluentNavigationViewItemHeader extends HTMLElement {
        constructor() {
            super();
            
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this._toggleVisibility = this._toggleVisibility.bind(this);

            this._parentView = this.closest('fluent-navigation-view');
            this._content = this.shadowRoot.querySelector('span.content');
        }

        connectedCallback() {
            this._content.textContent = this.getAttribute('content');

            this._toggleVisibility();
            this._parentView.addEventListener('invoked', this._toggleVisibility);
        }

        _toggleVisibility() {
            this.classList.toggle('visible', this._parentView.classList.contains('expanded'));
        }
    }
    
    customElements.define('fluent-navigation-view-item-header', FluentNavigationViewItemHeader);
})();