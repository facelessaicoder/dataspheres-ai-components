class ListItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['data'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && name === 'data') {
        try {
          this._data = JSON.parse(newValue);
          this.render();
        } catch (e) {
          console.error('Error parsing list item data:', e);
        }
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    handleAction(actionId) {
        const action = this._data.actions.find(a => a.id === actionId);
        if (action) {
          if (action.url) {
            window.location.href = action.url;
          } else if (action.callback) {
            // Execute the callback function string
            new Function(action.callback)();
          }
        }
      }
  
    render() {
      if (!this._data) return;
  
      const style = `
        <style>
          :host {
            display: block;
          }
          .list-item {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1rem;
            display: grid;
            grid-template-columns: 2fr 1fr;
            align-items: center;
            gap: 1rem;
          }
          .item-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .item-title {
            font-size: 1.125rem;
            font-weight: bold;
            margin: 0;
          }
          .item-description {
            color: #666;
            margin: 0;
          }
          .item-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
            flex-wrap: wrap;
          }
          .action-button {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            border: none;
            background: var(--action-bg, #005f56);
            color: var(--action-color, white);
            transition: background-color 0.2s;
          }
          .action-button:hover {
            background: var(--action-hover-bg, #004b43);
          }
          .action-button.secondary {
            --action-bg: #e5e7eb;
            --action-color: #374151;
            --action-hover-bg: #d1d5db;
          }
        </style>
      `;
  
      this.shadowRoot.innerHTML = `
        ${style}
        <div class="list-item">
          <div class="item-content">
            <h3 class="item-title">${this._data.name}</h3>
            <p class="item-description">${this._data.description}</p>
          </div>
          ${this._data.actions ? `
            <div class="item-actions">
              ${this._data.actions.map(action => `
                <button 
                  class="action-button ${action.style || ''}"
                  data-action-id="${action.id}"
                >
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
  
      this.shadowRoot.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', () => {
          this.handleAction(button.dataset.actionId);
        });
      });
    }
  }
  
  customElements.define('list-item', ListItem);
  