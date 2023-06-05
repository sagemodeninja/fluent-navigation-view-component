export class ComponentRegistry {
    static templates: {[name: string]: HTMLTemplateElement} = {};

    static createRegistry() {
        return new ComponentRegistry();
    }

    public register(...components: (typeof CustomComponent)[]) {
        components.forEach(component => {
            const customElement = component.customElement;
            const templates = ComponentRegistry.templates;

            if (customElement in templates) return;

            const template = document.createElement('template');
            template.innerHTML = `<style>${component.styles ?? ''}</style>`;
            templates[customElement] = template;

            customElements.define(customElement, component);
        });
    }
}

export class CustomComponent extends HTMLElement {
    static customElement: string;
    static styles?: string;

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.shadowRoot.append(...this.dom);
    }

    get template() {
        const constructor = Object.getPrototypeOf(this).constructor;
        return ComponentRegistry.templates[constructor.customElement];
    }
    
    get dom() {
        const parser = new DOMParser();
        const content = parser.parseFromString(this.render(), 'text/html');

        return content.body.children;
    }

    public render(): string {
        throw new Error('Not implemented!');
    }
}