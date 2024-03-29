import { CustomComponent, customComponent } from '@sagemodeninja/custom-component';
import { FluentNavigationView } from './fluent-navigation-view';
import { FluentNavigationViewMenuItems } from './fluent-navigation-view-menu-items';
import { DesignToken } from '@sagemodeninja/design-token-provider';

@customComponent('fluent-navigation-view-item')
export class FluentNavigationViewItem extends CustomComponent {
    static styles = `
        :host {
            cursor: default;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            row-gap: 4px;
            user-select: none;
            -webkit-user-select: none;
            width: 100%;
        }

        .ms-Icon {
            font-family: 'Segoe Fluent Icons', sans-serif;
            text-rendering: optimizeLegibility;
        }
        
        /* Button */
        .button {
            align-items: center;
            background-color: transparent;
            border-radius: 7px;
            box-sizing: border-box;
            color: var(--fill-text-primary);
            display: flex;
            height: 36px;
            margin: 0 4px;
            min-height: 36px;
            padding: 0 3px;
            position: relative;
        }
        
        .button:hover,
        :host(.active) .button {
            background-color: var(--fill-subtle-secondary);
        }

        :host(.active) .button:hover {
            background-color: var(--fill-subtle-tertiary);
        }
        
        .button:active {
            color: var(--fill-text-secondary);
        }
        
        /* Indicator */
        :host(.active) .button::before {
            background-color: var(--fill-accent-default);
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
            font-family: 'Segoe UI Variable', sans-serif;
            font-size: 14px;
            font-variation-settings: 'wght' 400, 'opsz' 20;
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
    `;

    private _parentView: FluentNavigationView;
    private _parentMenu: FluentNavigationViewMenuItems;
    private _subMenu: FluentNavigationViewMenuItems;
    private _button: HTMLDivElement;
    private _iconSpan: HTMLSpanElement;
    private _customIconSpan: HTMLSlotElement;
    private _contentSpan: HTMLSpanElement;

    constructor() {
        super();
        this.toggleOffset = this.toggleOffset.bind(this);
    }

    static get observedAttributes() {
        return ['icon', 'content'];
    }

    /* Attributes */
    get icon() {
        return this.getAttribute('icon');
    }

    set icon(value) {
        this.setAttribute('icon', value);
        this.setIcon();
    }

    get content() {
        return this.getAttribute('content');
    }

    set content(value) {
        this.setAttribute('content', value);
        this.setContent();
    }

    get tag() {
        return this.getAttribute('tag');
    }

    set tag(value) {
        this.setAttribute('tag', value);
    }

    get href(): string {
        return this.getAttribute('href');
    }

    set href(value: string) {
        this.setAttribute('href', value);
    }

    /* content */
    get parentView() {
        this._parentView ??= this.closest('fluent-navigation-view');
        return this._parentView;
    }

    get parentMenu() {
        this._parentMenu ??= this.closest(
            'fluent-navigation-view-item fluent-navigation-view-menu-items'
        );
        return this._parentMenu;
    }

    get subMenu() {
        this._subMenu ??= this.querySelector('fluent-navigation-view-menu-items');
        return this._subMenu;
    }

    get button() {
        this._button ??= this.shadowRoot.querySelector('.button');
        return this._button;
    }

    get iconSpan() {
        this._iconSpan ??= this.shadowRoot.querySelector('.icon');
        return this._iconSpan;
    }

    get customIconSlot() {
        this._customIconSpan ??= this.shadowRoot.querySelector('slot[name=icon]');
        return this._customIconSpan;
    }

    get contentSpan() {
        this._contentSpan ??= this.shadowRoot.querySelector('.content');
        return this._contentSpan;
    }

    /* Helpers */
    get isParent() {
        return this.subMenu !== null;
    }

    get selectsOnInvoke() {
        const selectsOnInvoke = eval(this.getAttribute('selects-on-invoke'));
        return selectsOnInvoke == null || selectsOnInvoke;
    }

    static setDefaultTokens(): void {
        const fillAccentDefault = new DesignToken<string>('fill-accent-default');
        const fillSubtleSecondary = new DesignToken<string>('fill-subtle-secondary');
        const fillSubtleTertiary = new DesignToken<string>('fill-subtle-tertiary');
        const fillTextPrimary = new DesignToken<string>('fill-text-primary');
        const fillTextSecondary = new DesignToken<string>('fill-text-secondary');

        fillAccentDefault.setDefault('#005FB8', false);
        fillSubtleSecondary.setDefault('rgb(0 0 0 / 3.73%)', false);
        fillSubtleTertiary.setDefault('rgb(0 0 0 / 2.41%)', false);
        fillTextPrimary.setDefault('rgb(0 0 0 / 89.56%)', false);
        fillTextSecondary.setDefault('rgb(0 0 0 / 60.63%)', false);
    }

    render() {
        return `
            <div class='button'>
                <fluent-symbol-icon class='icon'></fluent-symbol-icon>
                <slot name='icon'></slot>
                <span class='content'></span>
                <span class='ms-Icon chevron'></span>
            </div>
            <slot></slot>
        `;
    }

    connectedCallback() {
        this.setIcon();
        this.setContent();

        // Chevron.
        customElements.whenDefined('fluent-navigation-view-menu-items').then(_ => {
            const chevron = this.shadowRoot.querySelector('.chevron') as HTMLSpanElement;
            chevron.style.display = this.subMenu ? 'block' : 'none';
        });

        // Sub-item offset.
        if (this.parentMenu) {
            this.toggleOffset();
            this.parentView.addEventListener('invoked', this.toggleOffset);
        }

        // Event listeners.
        this.button.addEventListener('click', e => {
            this.classList.toggle('active', this.selectsOnInvoke);

            // Collapse active menu.
            var activeMenu = this.parentView.activeMenuItem;
            var isParentExpanded = this.parentView.classList.contains('expanded');

            if (!isParentExpanded && (this.subMenu === null || activeMenu !== this.subMenu)) {
                activeMenu?.classList?.remove('expanded');
                activeMenu?.parentItem.classList.remove('expanded');
            }

            // Events.
            this.dispatchEvent(new CustomEvent('invoked'));

            if (this.selectsOnInvoke) this.dispatchEvent(new CustomEvent('selected'));
        });

        this.customIconSlot.addEventListener('slotchange', e => {
            const hasCustomIcons = this.customIconSlot.assignedNodes().length > 0;

            this.iconSpan.style.display = hasCustomIcons ? 'none' : 'inline-block';
            this.customIconSlot.style.display = hasCustomIcons ? 'default' : 'none';
        });
    }

    attributeChangedCallback(name) {
        switch (name) {
            case 'icon':
                this.setIcon();
                break;
            case 'content':
                this.setContent();
                break;
        }
    }

    /* Functions */
    setIcon() {
        this.iconSpan.setAttribute('symbol', this.icon ?? '');
    }

    setContent() {
        this.contentSpan.textContent = this.content;
    }

    toggleOffset() {
        this.classList.toggle('with-offset', this.parentView.classList.contains('expanded'));
    }

    setSelected(selected) {
        this.classList.toggle('active', selected && this.selectsOnInvoke);

        const isParentExpanded = this.parentView.classList.contains('expanded');
        this.parentMenu?.classList.toggle('expanded', selected && isParentExpanded);
    }
}
