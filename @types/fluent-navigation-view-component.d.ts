declare module '@sagemodeninja/fluent-navigation-view-component' {
    export class ComponentRegistry {
        static createRegistry(): ComponentRegistry;
        register(...component: (typeof CustomComponent)[]): void;
    }

    export class CustomComponent extends HTMLElement {
        static customElement: string;
        static styles?: string;
        get template(): HTMLTemplateElement;
        get dom(): HTMLCollection;
        /**
         * Returns the DOM string for this component.
         */
        render(): string;
    }

    export class FluentNavigationView extends CustomComponent {
        isExpanded: boolean;
        /**
         * Gets or sets the header shown in content header.
         */
        header: string;
        /**
         * Gets or sets the title shown in navigation panel.
         */
        paneTitle: string;
        /**
         * Gets or sets whether to always show the header.
         */
        alwaysShowHeader: boolean;
        /**
         * Gets or sets whether the settings item is shown.
         */
        isSettingsVisible: boolean;
        /**
         * Called when a navigation occured to update which item has
         * the active indicator on.
         * @param href The href value of item to highlight.
         */
        navigate(href: string): void;
    }

    export class FluentNavigationViewItem extends CustomComponent {
        /**
         * Gets or sets the icon.
         */
        icon: string;
        /**
         * Gets or sets the content.
         */
        content: string;
        /**
         * Gets or sets the tag.
         */
        tag: string;
        /**
         * Gets or sets the href.
         */
        href: string;
    }

    export class FluentNavigationViewMenuItems extends CustomComponent {}
    export class FluentNavigationViewItemHeader extends CustomComponent {}
    export class FluentNavigationViewHeaderContent extends CustomComponent {}
    export class FluentNavigationViewContentFrame extends CustomComponent {}
}
