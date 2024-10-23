// Previous BaseCard and ListItem components remain the same

class FlexContainer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._items = [];
      this._layout = 'grid';
      this._columns = 2;
      this._gap = '1rem';
    }
  
    static get observedAttributes() {
      return ['items', 'layout', 'columns', 'gap'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        switch (name) {
          case 'items':
            try {
              this._items = JSON.parse(newValue);
            } catch (e) {
              console.error('Error parsing items:', e);
              this._items = [];
            }
            break;
          case 'layout':
            this._layout = newValue;
            break;
          case 'columns':
            this._columns = parseInt(newValue) || 2;
            break;
          case 'gap':
            this._gap = newValue;
            break;
        }
        this.render();
      }
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.shadowRoot.addEventListener('click', (e) => {
        const layoutButton = e.target.closest('.layout-button');
        if (layoutButton) {
          const newLayout = layoutButton.dataset.layout;
          if (newLayout !== this._layout) {
            this._layout = newLayout;
            this.render();
            this.dispatchEvent(new CustomEvent('layout-change', {
              bubbles: true,
              composed: true,
              detail: { layout: this._layout }
            }));
          }
        }
      });
    }
  
    render() {
      const style = `
        <style>
          :host {
            display: block;
          }
          .container-header {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
          }
          .layout-toggle {
            display: flex;
            background: #f3f4f6;
            padding: 0.25rem;
            border-radius: 0.5rem;
            gap: 0.25rem;
          }
          .layout-button {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border: none;
            background: none;
            border-radius: 0.375rem;
            cursor: pointer;
            color: #6b7280;
            transition: all 0.2s ease;
          }
          .layout-button svg {
            width: 1.25rem;
            height: 1.25rem;
          }
          .layout-button.active {
            background: white;
            color: #111827;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .layout-button:hover:not(.active) {
            background: rgba(255,255,255,0.5);
          }
          .container {
            display: ${this._layout === 'grid' ? 'grid' : 'flex'};
            ${this._layout === 'grid' ? `
              grid-template-columns: repeat(${this._columns}, 1fr);
            ` : `
              flex-direction: column;
            `}
            gap: ${this._gap};
          }
        </style>
      `;
  
      const listIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      `;
  
      const gridIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      `;
  
      this.shadowRoot.innerHTML = `
        ${style}
        <div class="container-header">
          <div class="layout-toggle">
            <button class="layout-button ${this._layout === 'grid' ? 'active' : ''}" data-layout="grid">
              ${gridIcon}
            </button>
            <button class="layout-button ${this._layout === 'list' ? 'active' : ''}" data-layout="list">
              ${listIcon}
            </button>
          </div>
        </div>
        <div class="container">
          ${this._items.map(item => `
            ${this._layout === 'grid' 
              ? `<base-card data='${JSON.stringify(item)}'></base-card>`
              : `<list-item data='${JSON.stringify(item)}'></list-item>`
            }
          `).join('')}
        </div>
      `;
    }
  }
  
  customElements.define('flex-container', FlexContainer);