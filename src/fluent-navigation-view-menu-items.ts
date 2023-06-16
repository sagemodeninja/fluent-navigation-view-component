import { CustomComponent, customComponent } from '@sagemodeninja/custom-component';
import { FluentNavigationView } from './fluent-navigation-view';
import { FluentNavigationViewItem } from './fluent-navigation-view-item';
import { DesignToken } from '@sagemodeninja/design-token-provider';

@customComponent('fluent-navigation-view-menu-items')
export class FluentNavigationViewMenuItems extends CustomComponent {
    static styles = `
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
            box-shadow: 0px 8px 16px var(--shadow-flyout);
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
            background-color: var(--background-fill-mica-base);
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

    static setDefaultTokens(): void {
        const backgroundFillMicaBase = new DesignToken<string>('background-fill-mica-base');
        const strokeCardDefault = new DesignToken<string>('stroke-card-default');
        const shadowFlyout = new DesignToken<string>('shadow-flyout');

        backgroundFillMicaBase.setDefault('#f3f3f3', false);
        strokeCardDefault.setDefault('#e5e5e5', false);
        shadowFlyout.setDefault('rgb(0 0 0 / 14%)', false);
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
                expanded && this.classList.contains('compact-mode') ? this : null;
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
