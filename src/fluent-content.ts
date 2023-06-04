import { CustomComponent } from './core';
import { FluentNavigationView } from './fluent-navigation-view';

export class FluentNavigationViewItemHeader extends CustomComponent {
    static customElement = 'fluent-navigation-view-item-header';
    static styles = `
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
    `;

    private _parentView: FluentNavigationView;

    constructor() {
        super();
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    /* DOM */
    get parentView() {
        this._parentView ??= this.closest("fluent-navigation-view");
        return this._parentView;
    }

    render() {
        return `
        <span class='content'></span>
        <slot></slot>
        `;
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

export class FluentNavigationViewHeaderContent extends CustomComponent {
    static customElement = 'fluent-navigation-view-header-content';

    constructor() {
        super();
    }

    render() {
        return '<slot></slot>';
    }

    connectedCallback() {
        this.setAttribute("slot", "header-content");
    }
}

export class FluentNavigationViewContentFrame extends CustomComponent {
    static customElement = 'fluent-navigation-view-content-frame';

    constructor() {
        super();
    }

    render() {
        return '<slot></slot>';
    }

    connectedCallback() {
        this.setAttribute("slot", "content-frame");
    }
}