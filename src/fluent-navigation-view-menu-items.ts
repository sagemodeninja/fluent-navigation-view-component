import { CustomComponent } from '.';
import { FluentNavigationView } from './fluent-navigation-view';
import { FluentNavigationViewItem } from './fluent-navigation-view-item';

export class FluentNavigationViewMenuItems extends CustomComponent {
    static customElement = 'fluent-navigation-view-menu-items';
    static styles = `
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
        this._parentView ??= this.closest("fluent-navigation-view");
        return this._parentView;
    }

    get parentItem() {
        this._parentItem ??= this.closest("fluent-navigation-view-item");
        return this._parentItem;
    }
    
    get itemsSlot() {
        this._itemsSlot ??= this.shadowRoot.querySelector("slot");
        return this._itemsSlot;
    }

    render() {
        return '<slot></slot>';
    }

    connectedCallback() {
        this.itemsSlot.addEventListener("slotchange", () => {
            const itemsChangeEvent = new CustomEvent("itemschange");
            this.dispatchEvent(itemsChangeEvent);
        });

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