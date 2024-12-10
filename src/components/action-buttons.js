class ActionButtons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._title = '';
    this._description = '';
    this._buttons = [];
    this._defaultColor = '#005f56'; // dfg-money green
  }

  static get observedAttributes() {
    return ['title', 'description', 'buttons', 'default-color'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'title':
          this._title = newValue;
          break;
        case 'description':
          this._description = newValue;
          break;
        case 'buttons':
          try {
            this._buttons = JSON.parse(newValue);
          } catch (e) {
            console.error('Error parsing buttons:', e);
            this._buttons = [];
          }
          break;
        case 'default-color':
          this._defaultColor = newValue;
          break;
      }
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  handleAction(button) {
    if (button.url) {
      window.location.href = button.url;
    } else if (button.callback) {
      // Execute the callback function string
      new Function(button.callback)();
    }
  }

  // Predefined icons for common actions
  getPresetIcon(name) {
    const icons = {
      edit: `<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>`,
      delete: `<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>`,
      share: `<path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>`,
      view: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`,
      download: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>`,
      send: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>`,
      upload: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />`
    };
    return icons[name] || '';
  }

  renderIcon(button) {
    if (!button.icon) return '';

    const svgBase = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor"
        class="button-icon"
      >
    `;

    // Handle preset icons
    if (typeof button.icon === 'string') {
      const presetPath = this.getPresetIcon(button.icon);
      if (presetPath) {
        return `${svgBase}${presetPath}</svg>`;
      }
    }

    // Handle custom SVG paths
    if (typeof button.icon === 'object' && button.icon.path) {
      return `${svgBase}${button.icon.path}</svg>`;
    }

    return '';
  }

  render() {
    const style = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin: 0;
        }

        .description {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        .buttons-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          background-color: var(--button-color, ${this._defaultColor});
        }

        .action-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .button-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }
      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="container">
        ${this._title || this._description ? `
          <div class="header">
            ${this._title ? `<h3 class="title">${this._title}</h3>` : ''}
            ${this._description ? `<p class="description">${this._description}</p>` : ''}
          </div>
        ` : ''}
        
        <div class="buttons-list">
          ${this._buttons.map(button => `
            <button 
              class="action-button" 
              style="--button-color: ${button.color || this._defaultColor}"
              data-action='${JSON.stringify(button)}'
            >
              ${this.renderIcon(button)}
              ${button.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Add event listeners
    this.shadowRoot.querySelectorAll('.action-button').forEach(button => {
      button.addEventListener('click', () => {
        const actionData = JSON.parse(button.dataset.action);
        this.handleAction(actionData);
        
        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('action-clicked', {
          bubbles: true,
          composed: true,
          detail: actionData
        }));
      });
    });
  }
}

customElements.define('action-buttons', ActionButtons);