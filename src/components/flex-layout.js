// src/components/flex-layout.js
class FlexLayout extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            flex-direction: var(--flex-direction, row);
            gap: var(--flex-gap, 10px);
          }
        </style>
        <slot></slot>
      `;
    }
  }
  
  customElements.define('flex-layout', FlexLayout);
  