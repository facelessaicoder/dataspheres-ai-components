class BaseCard extends HTMLElement {
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
          console.error('Error parsing card data:', e);
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
            margin-bottom: 30px;
          }
          .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 1rem;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .card-content {
            flex: 1;
          }
          .card-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0 0 0.5rem 0;
          }
          .card-description {
            color: #666;
            margin: 0 0 1rem 0;
          }
          .card-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: auto;
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
        <div class="card">
          <div class="card-content">
            <h3 class="card-title">${this._data.name}</h3>
            <p class="card-description">${this._data.description}</p>
          </div>
          ${this._data.actions ? `
            <div class="card-actions">
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
  
  customElements.define('base-card', BaseCard);