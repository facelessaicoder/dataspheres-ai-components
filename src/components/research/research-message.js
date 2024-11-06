// src/components/research/chat_message.js
class ResearchMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._menuOpen = false;
    this._menuOptions = [
      { id: 'copy', label: 'Copy Message' },
      { id: 'edit', label: 'Edit' },
      { id: 'delete', label: 'Delete' }
    ];
  }

  static get observedAttributes() {
    return ['data', 'menu-options'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      try {
        switch (name) {
          case 'data':
            // First unescape the HTML entities
            const unescapedData = newValue.replace(/&quot;/g, '"');
            this._data = JSON.parse(unescapedData);
            break;
          case 'menu-options':
            const unescapedOptions = newValue.replace(/&quot;/g, '"');
            this._menuOptions = JSON.parse(unescapedOptions);
            break;
        }
        this.render();
      } catch (e) {
        console.error(`Error parsing ${name}:`, e);
        console.log('Problematic value:', newValue);
      }
    }
  }
    
      connectedCallback() {
        this.render();
        this.setupEventListeners();
      }
    
      setupEventListeners() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!this.shadowRoot.contains(e.target)) {
            this.closeMenu();
          }
        });
      }
    
      toggleMenu() {
        this._menuOpen = !this._menuOpen;
        const menu = this.shadowRoot.querySelector('.message-menu-dropdown');
        if (menu) {
          menu.style.display = this._menuOpen ? 'block' : 'none';
        }
      }
    
      closeMenu() {
        this._menuOpen = false;
        const menu = this.shadowRoot.querySelector('.message-menu-dropdown');
        if (menu) {
          menu.style.display = 'none';
        }
      }
    
      handleAction(actionId) {
        this.dispatchEvent(new CustomEvent('message-action', {
          bubbles: true,
          composed: true,
          detail: { 
            actionId, 
            messageId: this._data.id,
            messageContent: this._data.content
          }
        }));
      }
    
      handleMenuAction(optionId) {
        this.dispatchEvent(new CustomEvent('menu-action', {
          bubbles: true,
          composed: true,
          detail: { 
            optionId,
            messageId: this._data.id,
            messageContent: this._data.content
          }
        }));
        this.closeMenu();
      }
    
      handleSuggestion(suggestionId, suggestion) {
        this.dispatchEvent(new CustomEvent('suggestion-select', {
          bubbles: true,
          composed: true,
          detail: { 
            suggestionId,
            suggestion,
            messageId: this._data.id
          }
        }));
      }
    
      render() {
        if (!this._data) return;
    
        const style = `
          <style>
            :host {
              display: block;
              margin-bottom: 1rem;
              font-family: system-ui, -apple-system, sans-serif;
            }
    
            .message {
              position: relative;
              display: flex;
              gap: 0.75rem;
              padding: 0.75rem;
              border-radius: 0.5rem;
              background: white;
              transition: background-color 0.2s;
            }
    
            .message:hover {
              background: #f9fafb;
            }
    
            .message:hover .message-menu {
              opacity: 1;
            }
    
            .avatar {
              width: 2rem;
              height: 2rem;
              border-radius: 9999px;
              background: #e5e7eb;
              flex-shrink: 0;
            }
    
            .content {
              flex: 1;
              min-width: 0;
            }
    
            .header {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-bottom: 0.25rem;
            }
    
            .name {
              font-weight: 500;
              color: #111827;
            }
    
            .bot-badge {
              font-size: 0.75rem;
              padding: 0.25rem 0.5rem;
              background: #dbeafe;
              color: #1d4ed8;
              border-radius: 9999px;
            }
    
            .timestamp {
              color: #6b7280;
              font-size: 0.875rem;
            }
    
            .message-text {
              color: #374151;
              line-height: 1.5;
              margin-bottom: 0.5rem;
              overflow-wrap: break-word;
            }
    
            .actions {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 0.5rem;
            }
    
            .action-button {
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              border: none;
              cursor: pointer;
              font-size: 0.875rem;
              transition: all 0.2s;
              white-space: nowrap;
            }
    
            .action-button.primary {
              background: #2563eb;
              color: white;
            }
    
            .action-button.primary:hover {
              background: #1d4ed8;
            }
    
            .action-button.secondary {
              background: #f3f4f6;
              color: #374151;
            }
    
            .action-button.secondary:hover {
              background: #e5e7eb;
            }
    
            .suggestions {
              margin-top: 0.75rem;
              padding: 0.75rem;
              background: #f3f4f6;
              border-radius: 0.5rem;
            }
    
            .suggestions-title {
              font-size: 0.875rem;
              font-weight: 500;
              color: #4b5563;
              margin-bottom: 0.5rem;
            }
    
            .suggestion-chips {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
    
            .suggestion-chip {
              display: flex;
              align-items: center;
              gap: 0.25rem;
              padding: 0.375rem 0.75rem;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 9999px;
              font-size: 0.875rem;
              color: #374151;
              cursor: pointer;
              transition: all 0.2s;
            }
    
            .suggestion-chip:hover {
              background: #f9fafb;
              border-color: #d1d5db;
            }
    
            .message-menu {
              position: absolute;
              top: 0.75rem;
              right: 0.75rem;
              opacity: 0;
              transition: opacity 0.2s;
            }
    
            .message-menu-button {
              padding: 0.25rem;
              border: none;
              background: transparent;
              cursor: pointer;
              border-radius: 0.375rem;
              color: #6b7280;
              transition: all 0.2s;
            }
    
            .message-menu-button:hover {
              background: #e5e7eb;
              color: #374151;
            }
    
            .message-menu-dropdown {
              display: none;
              position: absolute;
              top: 100%;
              right: 0;
              margin-top: 0.25rem;
              background: white;
              border-radius: 0.375rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              z-index: 50;
              min-width: 10rem;
            }
    
            .menu-option {
              display: block;
              width: 100%;
              padding: 0.5rem 1rem;
              text-align: left;
              border: none;
              background: none;
              font-size: 0.875rem;
              color: #374151;
              cursor: pointer;
              transition: all 0.2s;
            }
    
            .menu-option:hover {
              background: #f3f4f6;
            }
    
            .menu-option.delete {
              color: #dc2626;
            }
    
            .menu-option.delete:hover {
              background: #fee2e2;
            }
          </style>
        `;
    
        this.shadowRoot.innerHTML = `
          ${style}
          <div class="message">
            <img class="avatar" src="${this._data.sender.avatar}" alt="${this._data.sender.name}">
            
            <div class="content">
              <div class="header">
                <span class="name">${this._data.sender.name}</span>
                ${this._data.sender.type === 'bot' ? '<span class="bot-badge">BOT</span>' : ''}
                <span class="timestamp">${this._data.timestamp}</span>
              </div>
              
              <div class="message-text">${this._data.content}</div>
              
              ${this._data.actions ? `
                <div class="actions">
                  ${this._data.actions.map(action => `
                    <button 
                      class="action-button ${action.type || 'secondary'}" 
                      data-action-id="${action.id}"
                    >
                      ${action.label}
                    </button>
                  `).join('')}
                </div>
              ` : ''}
              
              ${this._data.suggestions ? `
                <div class="suggestions">
                  <div class="suggestions-title">Suggested Actions:</div>
                  <div class="suggestion-chips">
                    ${this._data.suggestions.map((suggestion, index) => `
                      <button 
                        class="suggestion-chip"
                        data-suggestion-id="${index}"
                        data-suggestion="${suggestion}"
                      >
                        ${suggestion}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
    
            <div class="message-menu">
              <button class="message-menu-button" aria-label="Message options">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </button>
              
              <div class="message-menu-dropdown">
                ${this._menuOptions.map(option => `
                  <button 
                    class="menu-option ${option.id === 'delete' ? 'delete' : ''}"
                    data-option-id="${option.id}"
                  >
                    ${option.label}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
    
        // Set up event listeners
        this.shadowRoot.querySelectorAll('.action-button').forEach(button => {
          button.addEventListener('click', () => this.handleAction(button.dataset.actionId));
        });
    
        this.shadowRoot.querySelectorAll('.suggestion-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            this.handleSuggestion(
              chip.dataset.suggestionId,
              chip.dataset.suggestion
            );
          });
        });
    
        const menuButton = this.shadowRoot.querySelector('.message-menu-button');
        menuButton?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMenu();
        });
    
        this.shadowRoot.querySelectorAll('.menu-option').forEach(option => {
          option.addEventListener('click', () => {
            this.handleMenuAction(option.dataset.optionId);
          });
        });
      }
}

customElements.define('research-message', ResearchMessage);
