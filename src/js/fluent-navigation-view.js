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

class FluentNavigationView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // Styling
        const style = document.createElement('style');
        style.textContent = `
        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            max-height: 100%;
            padding-left: 12px;
            row-gap: 4px;
            user-select: none;
        }

        /* TODO: Introduce collapsed mode. */
        /*
        :host([expanded]) {
            max-height: 100%;
        }
        */

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
            width: calc(100% - 8px);
        }
        
        .button:hover {
            background-color: #eaeaea;
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

        .settings-icon::before {
            content: '\\e713';
        }

        /* Content */
        .content {
            color: #191919;
            flex-grow: 1;
            font-family: 'Segoe UI Variable', sans-serif;
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .pane-title {
            font-weight: 600;
        }

        .menu-items-container {
            flex-grow: 1;
            overflow-y: auto;
        }
        `;

        // Header
        const button = document.createElement('div');
        button.setAttribute('class', 'button');
        
        // Icon
        const icon = button.appendChild(document.createElement('span'));
        icon.setAttribute('class', `ms-Icon nav-icon icon`);
        
        // Content
        const content = button.appendChild(document.createElement('span'));
        content.setAttribute('class', 'content pane-title');
        content.textContent =  this.getAttribute('pane-title');
        
        // Template/Slot
        const menuItemsContainer = document.createElement('div');
        
        const template = document.createElement('template');
        template.innerHTML = '<slot />';

        menuItemsContainer.setAttribute('class', 'menu-items-container');
        menuItemsContainer.appendChild(template.content.cloneNode(true));

        this.selectionChangedEvent = new CustomEvent('selectionchanged');
        this.selectedItem;
        this.shadowRoot.append(style, button, menuItemsContainer);

        var attr = eval(this.getAttribute('is-settings-visible'));
        if(attr === undefined || attr) {
            // Settings item
            const settingsItem = document.createElement('div');
            settingsItem.setAttribute('class', 'button settings-button');
            
            // Settings icon
            const settingsIcon = settingsItem.appendChild(document.createElement('span'));
            settingsIcon.setAttribute('class', `ms-Icon settings-icon icon`);
            
            // Settings content
            const settingsContent = settingsItem.appendChild(document.createElement('span'));
            settingsContent.setAttribute('class', 'content');
            settingsContent.textContent =  'Settings';

            this.shadowRoot.appendChild(settingsItem);
        }
    }
    
    connectedCallback() {
        var items = this.querySelectorAll('fluent-navigation-view-item');
        items.forEach(item => {

            if(item.hasAttribute('active')) {
                this.selectedItem = item;
                item.parentElement?.parentElement?.setAttribute('expanded', '');
            }

            item.addEventListener('navigation', () => {
                if(this.selectedItem === item)
                    return;

                this.selectedItem?.removeAttribute('active');
                this.selectedItem = item;
                this.dispatchEvent(this.selectionChangedEvent);
            });
        });
    }
}

class FluentNavigationViewMenuItems extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // Template/Slot
        const template = document.createElement('template');
        template.innerHTML = '<slot />';

        // Styling
        const style = document.createElement('style');
        style.textContent = `
        :host {
            display: flex;
            flex-direction: column;
            font-size: 15px;
            overflow-y: auto;
            row-gap: 4px;
            user-select: none;
            width: 100%;
        }
        `;

        this.shadowRoot.append(style, template.content.cloneNode(true));
    }
}

class FluentNavigationViewItemHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        // Content
        const content = document.createElement('span');
        content.setAttribute('class', 'content');
        content.textContent =  this.getAttribute('content');
        
        // Template/Slot
        const template = document.createElement('template');
        template.innerHTML = '<slot />';

        // Styling
        const style = document.createElement('style');
        style.textContent = `
        :host {
            align-items: center;
            box-sizing: border-box;
            display: flex;
            height: 36px;
            padding-left: 12px;
            user-select: none;
            width: 100%;
        }

        :host .content {
            color: #5d5d5d;
            font-family: 'Segoe UI Variable', sans-serif;
            font-size: 14px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        `;

        this.shadowRoot.append(style, content, template.content.cloneNode(true));
    }
}

class FluentNavigationViewItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Button
        this._button = document.createElement('div');
        this._button.setAttribute('class', 'button');
        
        // Icon
        if(this.hasAttribute('icon')) {
            const icon = this._button.appendChild(document.createElement('span'));
            icon.setAttribute('class', `ms-Icon ms-Icon--${this.getAttribute('icon')} icon`);
        }
        
        // Content
        const content = this._button.appendChild(document.createElement('span'));
        content.setAttribute('class', 'content');
        content.textContent =  this.getAttribute('content');
        
        // Template/Slot
        const template = document.createElement('template');
        template.innerHTML = '<slot />';

        // Styling
        const style = document.createElement('style');
        style.textContent = `
        .ms-Icon {
            font-family: 'Segoe Fluent Icons', sans-serif;
            text-rendering: optimizeLegibility;
        }

        ${SegoeFluentIcon.buildCss()}

        :host {
            display: flex;
            flex-direction: column;
            max-height: 36px;
            overflow: hidden;
            row-gap: 4px;
            user-select: none;
            width: 100%;
        }

        :host([expanded]) {
            max-height: 100%;
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
            width: calc(100% - 8px);
        }
        
        .button:hover,
        :host([active]) .button {
            background-color: #eaeaea;
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
            line-height: 15px;
            width: 15px;
        }

        /* Content */
        .content {
            flex-grow: 1;
            font-family: 'Segoe UI Variable', sans-serif;
            font-size: 14px;
            font-weight: 500;
            overflow: hidden;
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
        :host([sub-item]) .button {
            padding-left: 39px;
        }
        
        :host([sub-item]) .button::before {
            left: 27px;
        }
        `;

        this.navigationEvent = new CustomEvent('navigation', {});
        this.attachEventListeners();

        this.shadowRoot.append(style, this._button, template.content.cloneNode(true));
    }
    
    connectedCallback() {
        var subItems = this.querySelectorAll('fluent-navigation-view-item');
        
        // Chevron
        if(subItems.length > 0)
        {
            const chevron = this._button.appendChild(document.createElement('span'));
            chevron.setAttribute('class', 'ms-Icon chevron');
        }
        
        subItems.forEach(item => {
            item.setAttribute('sub-item', '');
        });
    }

    attachEventListeners() {
        this._button.addEventListener('click', e => {
            this.setAttribute('active', '');
            
            if(this.hasAttribute('expanded'))
                this.removeAttribute('expanded');
            else
                this.setAttribute('expanded', '');

            this.dispatchEvent(this.navigationEvent);
        });
    }
}

customElements.define('fluent-navigation-view', FluentNavigationView);
customElements.define('fluent-navigation-view-menu-items', FluentNavigationViewMenuItems);
customElements.define('fluent-navigation-view-item-header', FluentNavigationViewItemHeader);
customElements.define('fluent-navigation-view-item', FluentNavigationViewItem);