// src/components/grid-layout.js
class GridLayout extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: grid;
            gap: var(--grid-gap, 10px);
            grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
          }
        </style>
        <slot></slot>
      `;
    }
  }
  
  customElements.define('grid-layout', GridLayout);
  