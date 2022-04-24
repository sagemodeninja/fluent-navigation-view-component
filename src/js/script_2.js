class FluentNavigationViewItem extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const button = document.createElement('div');
        const icon = button.appendChild(document.createElement('span'));
        const content = button.appendChild(document.createElement('span'));
        const template = document.createElement('template');

        this.setAttribute('class', 'active expanded');

        button.setAttribute('class', 'button');
        button.setAttribute('part', 'button');
        
        icon.setAttribute('class', 'fluent-icons');
        icon.textContent = this.getAttribute('icon');

        content.setAttribute('class', 'content');
        content.textContent =  this.getAttribute('content');

        template.innerHTML = '<slot />';

        // Styling
        const style = document.createElement('style');
        style.textContent = `
            :host {
                max-height: 36px;
                overflow: hidden;
                user-select: none;
                width: 100%;
            }

            :host(.expanded) {
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
                padding: 0 3px;
                position: relative;
                width: calc(100% - 8px);
            }
            
            .button:hover,
            :host(.active) .button {
                background-color: #eaeaea;
            }
            
            :host(.active) .button:hover {
                background-color: #ededed;
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

            .button span {
                margin: 0 9px;
            }

            /* Icons */
            .fluent-icons {
                font-family: 'Segoe Fluent Icons', sans-serif;
                text-rendering: optimizeLegibility;
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
                content: '\E70D';
                font-size: 12px;
            }
        `;

        this.shadowRoot.append(style, button, template.content.cloneNode(true));
    }
}

customElements.define('fluent-navigation-view-item', FluentNavigationViewItem);