import { LitElement } from 'lit';

export class BaseElement extends LitElement {
  public static dependencies: Record<string, typeof BaseElement> = {};

  constructor() {
    super();
    Object.entries(BaseElement.dependencies).forEach(([name, component]) => {
      (component as typeof BaseElement).define(name);
    });
  }

  public static define(name: string, options: ElementDefinitionOptions = {}) {
    if (!customElements.get(name)) {
      try {
        customElements.define(name, this, options);
      } catch(error: any) {
        if (process.env.NODE_ENV === 'development') {
          throw new Error(`Failed to register component "${name}": ${error.message}`);
        } else {
          console.warn(`Failed to register component "${name}":`, error);
        }
      }
    }
    console.debug(`Component "${name}" registered.`);
  }

  protected dispatch(name: string, value: any, options?: any): boolean {
    const event = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: value,
      ...options
    });

    return this.dispatchEvent(event);
  }
}