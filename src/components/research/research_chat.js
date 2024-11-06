// src/components/research/research_chat.js
// Utility function for escaping HTML
const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  class ResearchChat extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._threads = [];
      this._activeBots = [];
      this._teamMembers = [];
      this._activeThread = 'main';
    }
  
    static get observedAttributes() {
      return ['threads', 'active-bots', 'team-members', 'active-thread'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        switch (name) {
          case 'threads':
            try {
              this._threads = JSON.parse(newValue);
            } catch (e) {
              console.error('Error parsing threads:', e);
              this._threads = [];
            }
            break;
          case 'active-bots':
            try {
              this._activeBots = JSON.parse(newValue);
            } catch (e) {
              console.error('Error parsing active bots:', e);
              this._activeBots = [];
            }
            break;
          case 'team-members':
            try {
              this._teamMembers = JSON.parse(newValue);
            } catch (e) {
              console.error('Error parsing team members:', e);
              this._teamMembers = [];
            }
            break;
          case 'active-thread':
            this._activeThread = newValue;
            break;
        }
        this.render();
      }
    }
  
    connectedCallback() {
      // Add some sample messages if none exist
      if (this._threads.length > 0 && this._threads[0].messages.length === 0) {
        this._threads[0].messages = [
          {
            id: 1,
            sender: {
              type: 'bot',
              name: 'ResearchBot',
              avatar: '/api/placeholder/32/32'
            },
            content: "I've analyzed the latest dataset. Here are the key findings:",
            timestamp: '2:30 PM',
            actions: [
              { id: 'view', label: 'View Full Analysis', type: 'primary' },
              { id: 'report', label: 'Generate Report', type: 'secondary' }
            ],
            suggestions: [
              'Compare with historical data',
              'Generate visualization',
              'Schedule team review'
            ]
          }
        ];
      }
      this.render();
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      // Message submission
      const input = this.shadowRoot.querySelector('.chat-input');
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = {
              id: Date.now(),
              sender: {
                type: 'human',
                name: 'You',
                avatar: '/api/placeholder/32/32'
              },
              content: e.target.value,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            this._threads[0].messages.push(message);
            this.render();
            e.target.value = '';
          }
        });
      }
    }
  
    renderTeamMembers() {
      return this._teamMembers.map(member => `
        <div class="team-member-avatar" title="${escapeHtml(member.name)}">
          ${member.initials}
        </div>
      `).join('');
    }
  
    renderBots() {
      return this._activeBots.map(bot => `
        <div class="bot-item">
          <svg class="bot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M9 9h.01M15 9h.01M9 13a3 3 0 0 0 6 0"/>
          </svg>
          ${escapeHtml(bot.name)}
        </div>
      `).join('');
    }
  
    renderMessages() {
      const activeThread = this._threads.find(t => t.id === this._activeThread);
      return activeThread?.messages.map(message => `
        <div class="message ${message.sender.type === 'bot' ? 'bot-message' : ''}">
          <div class="message-avatar">
            ${message.sender.type === 'bot' ? 'B' : 'U'}
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">${escapeHtml(message.sender.name)}</span>
              ${message.sender.type === 'bot' ? '<span class="bot-badge">BOT</span>' : ''}
              <span class="message-time">${message.timestamp}</span>
            </div>
            <div class="message-text">${escapeHtml(message.content)}</div>
            ${message.actions ? `
              <div class="message-actions">
                ${message.actions.map(action => `
                  <button class="action-button ${action.type}" data-action-id="${action.id}">
                    ${escapeHtml(action.label)}
                  </button>
                `).join('')}
              </div>
            ` : ''}
            ${message.suggestions ? `
              <div class="message-suggestions">
                <div class="suggestions-title">Suggested Actions:</div>
                <div class="suggestion-chips">
                  ${message.suggestions.map(suggestion => `
                    <button class="suggestion-chip">
                      ${escapeHtml(suggestion)}
                      <svg class="suggestion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14m-7-7l7 7-7 7"/>
                      </svg>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('') || '';
    }
  
    render() {
      const style = `
        <style>
          :host {
            display: block;
            height: 600px;
            font-family: system-ui, -apple-system, sans-serif;
          }
  
          .chat-container {
            display: flex;
            height: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
  
          .sidebar {
            width: 260px;
            background: #f9fafb;
            border-right: 1px solid #e5e7eb;
            padding: 1rem;
          }
  
          .main-chat {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
  
          .section-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            margin-bottom: 0.75rem;
          }
  
          .team-avatars {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }
  
          .team-member-avatar {
            width: 2rem;
            height: 2rem;
            background: #e0e7ff;
            color: #4f46e5;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 500;
          }
  
          .bot-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
  
          .bot-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.375rem;
            color: #4b5563;
            font-size: 0.875rem;
          }
  
          .bot-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
  
          .chat-header {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
          }
  
          .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
  
          .message {
            display: flex;
            gap: 0.75rem;
          }
  
          .message-avatar {
            width: 2rem;
            height: 2rem;
            background: #e5e7eb;
            color: #4b5563;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
          }
  
          .bot-message .message-avatar {
            background: #dbeafe;
            color: #1d4ed8;
          }
  
          .message-content {
            flex: 1;
          }
  
          .message-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.25rem;
          }
  
          .message-sender {
            font-weight: 500;
          }
  
          .bot-badge {
            font-size: 0.75rem;
            padding: 0.125rem 0.5rem;
            background: #dbeafe;
            color: #1d4ed8;
            border-radius: 9999px;
          }
  
          .message-time {
            color: #6b7280;
            font-size: 0.75rem;
          }
  
          .message-text {
            color: #111827;
            margin-bottom: 0.5rem;
          }
  
          .message-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
  
          .action-button {
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
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
  
          .message-suggestions {
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
  
          .suggestion-arrow {
            width: 1rem;
            height: 1rem;
          }
  
          .chat-input-container {
            padding: 1rem;
            border-top: 1px solid #e5e7eb;
          }
  
          .chat-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.375rem;
            resize: none;
            outline: none;
            transition: all 0.2s;
          }
  
          .chat-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
          }
        </style>
      `;
  
      this.shadowRoot.innerHTML = `
        ${style}
        <div class="chat-container">
          <div class="sidebar">
            <div class="section-title">Team Members</div>
            <div class="team-avatars">
              ${this.renderTeamMembers()}
            </div>
            
            <div class="section-title">Active Bots</div>
            <div class="bot-list">
              ${this.renderBots()}
            </div>
          </div>
          
          <div class="main-chat">
            <div class="chat-header">
              <div class="section-title">Main Discussion</div>
            </div>
            
            <div class="messages-container">
              ${this.renderMessages()}
            </div>
            
            <div class="chat-input-container">
              <textarea 
                class="chat-input" 
                placeholder="Type a message or use / for commands..."
                rows="1"
              ></textarea>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('research-chat', ResearchChat);