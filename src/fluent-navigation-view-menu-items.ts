import { CustomComponent } from './core';
import { FluentNavigationView } from './fluent-navigation-view';
import { FluentNavigationViewItem } from './fluent-navigation-view-item';

export class FluentNavigationViewMenuItems extends CustomComponent {
    static customElement = 'fluent-navigation-view-menu-items';
    static styles = `
        :host {
            --background-color: #f3f3f3;
            --background-color-gradient: rgb(243 243 243 / 50%);
            --navigation-pane-shadow: rgb(0 0 0 / 14%);
            --stroke-card-default: #e5e5e5;
        }

        :host([data-color-scheme=dark]) {
            --background-color: #202020;
            --background-color-gradient: rgb(32 32 32 / 80%);
            --navigation-pane-shadow: rgb(0 0 0 / 26%);
            --stroke-card-default: rgb(255 255 255 / 8.37%);
        }

        :host {
            border-radius: 7px;
            display: flex;
            flex-direction: column;
            font-size: 15px;
            row-gap: 4px;
            user-select: none;
            width: 100%;
        }

        :host(.compact-mode) {
            border: solid 1px var(--stroke-card-default);
            box-shadow: 0px 8px 16px var(--navigation-pane-shadow);
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
            background: linear-gradient(0deg, var(--background-color-gradient), var(--background-color-gradient)), var(--background-color);
            background-blend-mode: color, luminosity;
            -webkit-backdrop-filter: saturate(180%) blur(100px);
            backdrop-filter: saturate(180%) blur(100px);
        }
    `;

    private _parentView: FluentNavigationView;
    private _parentItem: FluentNavigationViewItem;
    private _itemsSlot: HTMLSlotElement;

    constructor() {
        super();
        this.toggleMode = this.toggleMode.bind(this);
    }

    /* DOM */
    get parentView() {
        this._parentView ??= this.closest('fluent-navigation-view');
        return this._parentView;
    }

    get parentItem() {
        this._parentItem ??= this.closest('fluent-navigation-view-item');
        return this._parentItem;
    }

    get itemsSlot() {
        this._itemsSlot ??= this.shadowRoot.querySelector('slot');
        return this._itemsSlot;
    }

    render() {
        return '<slot></slot>';
    }

    connectedCallback() {
        this.itemsSlot.addEventListener('slotchange', () => {
            const itemsChangeEvent = new CustomEvent('itemschange');
            this.dispatchEvent(itemsChangeEvent);
        });

        if (this.parentItem === null) return;

        this.classList.add('sub-menu-item');
        this.toggleMode();

        this.parentView.addEventListener('invoked', this.toggleMode);
        this.parentItem.addEventListener('invoked', () => {
            const expanded = this.classList.toggle('expanded');

            this.parentItem.classList.toggle('expanded', expanded);
            this.parentView.activeMenuItem =
                expanded && this.classList.contains('compact-mode')
                    ? this
                    : null;
        });

        this.addEventListener('click', e => e.stopPropagation());
    }

    /* Functions */
    toggleMode() {
        const compactMode = !this.parentView.classList.contains('expanded');

        this.classList.toggle('compact-mode', compactMode);

        if (compactMode) {
            this.classList.toggle('expanded', false);
            this.parentItem.classList.remove('expanded');
        }
    }
}
