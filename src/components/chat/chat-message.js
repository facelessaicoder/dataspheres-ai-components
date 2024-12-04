class ChatMessage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.handleAvatarError = this.handleAvatarError.bind(this);
      // Default actions if none provided
      this._actions = [
        {
          id: 'bookmark',
          title: 'Save this message for later',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>`,
          background: '#4f46e5',
          callback: () => alert('Bookmark clicked!')
        },
        {
          id: 'reply',
          title: 'Reply to this message',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>`,
          background: '#059669',
          callback: () => alert('Reply clicked!')
        }
      ];
    }
  
    static get observedAttributes() {
      return ['avatar-url', 'initials', 'sender-name', 'timestamp', 'message-type', 'theme', 'status', 'actions'];
    }
  
    getInitials(name) {
      if (!name) return '??';
      return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
    }
  
    handleAvatarError() {
      const senderName = this.getAttribute('sender-name');
      const initials = this.getInitials(senderName);
      const color = this.generateColor(initials);
      
      const avatarContainer = this.shadowRoot.querySelector('.avatar');
      if (avatarContainer) {
        avatarContainer.innerHTML = `
          <div class="initials-avatar" style="background: ${color.bg}; color: ${color.text}">
            ${initials}
          </div>`;
      }
    }
  
    generateColor(initials) {
      const colors = [
        { bg: '#E9D5FF', text: '#6B21A8' }, // Purple
        { bg: '#DBEAFE', text: '#1E40AF' }, // Blue
        { bg: '#D1FAE5', text: '#065F46' }, // Green
        { bg: '#FFE4E6', text: '#9F1239' }, // Rose
        { bg: '#FEF9C3', text: '#854D0E' }, // Yellow
        { bg: '#FFE2CA', text: '#C2410C' }  // Orange
      ];
      
      let hash = 0;
      for (let i = 0; i < initials.length; i++) {
        hash = initials.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          if (name === 'actions' && newValue) {
            try {
              this._actions = JSON.parse(newValue);
              // Convert string callbacks to functions if provided from HTML
              this._actions = this._actions.map(action => ({
                ...action,
                callback: action.callback || (() => {})
              }));
            } catch (e) {
              console.error('Error parsing actions:', e);
            }
          }
          this.render();
        }
      }

    setupEventListeners() {
        const actions = this.shadowRoot.querySelectorAll('.action-button');
        actions.forEach(button => {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            const actionId = button.dataset.actionId;
            const action = this._actions.find(a => a.id === actionId);
            
            if (action?.callback) {
              if (typeof action.callback === 'function') {
                // Handle function callbacks (from JavaScript)
                action.callback();
              } else if (typeof action.callback === 'string') {
                // Handle string callbacks (from HTML attributes)
                try {
                  new Function(action.callback)();
                } catch (error) {
                  console.error('Error executing callback:', error);
                }
              }
            }
          });
        });
      }
  
    render() {
      const avatarUrl = this.getAttribute('avatar-url');
      const senderName = this.getAttribute('sender-name');
      const initials = this.getInitials(senderName);
      const timestamp = this.getAttribute('timestamp');
      const messageType = this.getAttribute('message-type') || 'default';
      const theme = this.getAttribute('theme') || 'light';
      const status = this.getAttribute('status');
      const color = this.generateColor(initials);
      const isDark = theme === 'dark';
  
      this.shadowRoot.innerHTML = `
        <style>
        :host {
          display: block;
          margin: 0;
          padding: 4px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          --avatar-size: 38px;
        }
  
        .message-container {
          display: flex;
          gap: 12px;
          padding: 2px 8px;
          min-height: var(--avatar-size);
          position: relative;
        }
  
        .message-container:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.02)' : '#F9FAFB'};
        }

        .message-container:hover .actions-container {
          opacity: 1;
          transform: translateY(0);
        }
  
        .avatar-wrapper {
          position: relative;
          width: var(--avatar-size);
          height: var(--avatar-size);
          flex-shrink: 0;
        }
  
        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }
  
        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
  
        .initials-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          background: ${color.bg};
          color: ${color.text};
          border-radius: 50%;
        }
  
        .message-content {
          flex: 1;
          min-width: 0;
          margin-top: 2px;
        }
  
        .message-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1px;
        }
  
        .sender-name {
          font-size: 13px;
          font-weight: 500;
          color: ${isDark ? '#E2E8F0' : '#1A202C'};
        }
  
        .timestamp {
          font-size: 11px;
          color: ${isDark ? '#64748B' : '#94A3B8'};
        }
  
        .message-body {
          color: ${isDark ? '#E2E8F0' : '#1A202C'};
          font-size: 13px;
          line-height: 1.4;
        }
  
        .status-indicator {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${status === 'online' ? '#22C55E' : '#94A3B8'};
          border: 2px solid ${isDark ? '#1E1E2D' : '#FFFFFF'};
        }

        .actions-container {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
          opacity: 0;
          transform: translateY(-4px);
          transition: all 0.15s ease;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s ease;
          color: white;
        }

        .action-button svg {
          width: 16px;
          height: 16px;
        }

        .action-button:hover {
          transform: translateY(-1px);
          filter: brightness(110%);
        }
  
        /* Message body spacing */
        ::slotted(*) {
          margin: 0;
        }
  
        ::slotted(p) {
          margin: 0;
        }
  
        /* Attachment spacing */
        ::slotted(chat-message-attachments),
        ::slotted(chat-article-preview) {
          display: block;
          margin-top: 4px;
        }
        </style>
  
        <div class="message-container">
          <div class="avatar-wrapper">
            <div class="avatar">
              ${avatarUrl 
                ? `<img class="avatar-image" src="${avatarUrl}" alt="${senderName}'s avatar" />` 
                : `<div class="initials-avatar">${initials}</div>`
              }
            </div>
            ${status ? `<div class="status-indicator"></div>` : ''}
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="sender-name">${senderName}</span>
              <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-body">
              <slot></slot>
            </div>
          </div>
          <div class="actions-container">
            ${this._actions.map(action => `
              <button 
                class="action-button" 
                data-action-id="${action.id}"
                title="${action.title}"
                style="background: ${action.background}"
              >
                ${action.icon}
              </button>
            `).join('')}
          </div>
        </div>
      `;
  
      const avatarImg = this.shadowRoot.querySelector('.avatar-image');
      if (avatarImg) {
        avatarImg.addEventListener('error', this.handleAvatarError);
      }
    }
}
  
customElements.define('chat-message', ChatMessage);
