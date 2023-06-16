import { CustomComponent, customComponent } from '@sagemodeninja/custom-component';
import { FluentNavigationView } from './fluent-navigation-view';
import { DesignToken } from '@sagemodeninja/design-token-provider';

@customComponent('fluent-navigation-view-item-header')
export class FluentNavigationViewItemHeader extends CustomComponent {
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
            color: var(--fill-text-secondary);
            font-family: 'Segoe UI Variable', sans-serif;
            font-size: 14px;
            font-variation-settings: 'wght' 600, 'opsz' 20;
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
        this._parentView ??= this.closest('fluent-navigation-view');
        return this._parentView;
    }

    static setDefaultTokens(): void {
        const fillTextSecondary = new DesignToken<string>('fill-text-secondary');

        fillTextSecondary.setDefault('rgb(0 0 0 / 60.63%)', false);
    }

    render() {
        return `
        <span class='content'></span>
        <slot></slot>
        `;
    }

    connectedCallback() {
        const content = this.shadowRoot.querySelector('span.content');
        content.textContent = this.getAttribute('content');

        this.toggleVisibility();
        this.parentView.addEventListener('invoked', this.toggleVisibility);
    }

    /* Functions */
    toggleVisibility() {
        this.classList.toggle('visible', this.parentView.classList.contains('expanded'));
    }
}

@customComponent('fluent-navigation-view-header-content')
export class FluentNavigationViewHeaderContent extends CustomComponent {
    constructor() {
        super();
    }

    render() {
        return '<slot></slot>';
    }

    connectedCallback() {
        this.setAttribute('slot', 'header-content');
    }
}

@customComponent('fluent-navigation-view-content-frame')
export class FluentNavigationViewContentFrame extends CustomComponent {
    constructor() {
        super();
    }

    render() {
        return '<slot></slot>';
    }

    connectedCallback() {
        this.setAttribute('slot', 'content-frame');
    }
}
