declare module '@sagemodeninja/fluent-navigation-view-component' {
    export class ComponentRegistry {
        static createRegistry(): ComponentRegistry;
        register(component: typeof CustomComponent): void;
    }

    export class CustomComponent extends HTMLElement {
        static customElement: string;
        static styles: string;
        render(): string;
    }
}