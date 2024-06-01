class ChatWindow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .chat-window {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: var(--window-bg);
          position: relative; /* Ensure positioning context for fixed elements */
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column-reverse;
          background: var(--window-bg);
          margin-top: 60px; /* Adjust for topbar height */
          margin-bottom: 100px;
        }

        .message-input-container {
          position: fixed;
          bottom: 1px;
          left: 250px; /* Adjust for the left sidebar width */
          right: 250px; /* Adjust for the right sidebar width */
          background-color: var(--input-bg, #eee);
          display: flex;
          flex-direction: column;
          padding: 10px;
        }

        chat-message {
          border-radius: 5px;
          width: 100%;
          color: var(--message-color);
        }
        
        chat-message.user {
          background-color: var(--message-bg-user);
          align-self: flex-end;
        }
        
        chat-message.ai {
          background-color: var(--message-bg-ai);
          align-self: flex-start;
        }

        .message-input-disclaimer {
          font-size: 0.8em;
          color: #999;
          margin-top: 5px;
          text-align: center;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .message-input-container {
            left: 10px; /* Adjust for minimal margins */
            right: 10px; /* Adjust for minimal margins */
            bottom: 0; /* Ensure the input is always at the bottom */
          }
        }
      </style>
      <div class="chat-window">
        <chat-topbar></chat-topbar>
        <div class="messages">
          <slot name="messages"></slot>
        </div>
        <div class="message-input-container">
          <message-input></message-input>
          <div class="message-input-disclaimer">AIs can make mistakes. Review important info</div>
        </div>
      </div>
    `;

    this.chatWindowElement = this.shadowRoot.querySelector('.messages');
    this.messageInput = this.shadowRoot.querySelector('message-input');

    this.messageInput.addEventListener('message-sent', (e) => {
      this.addMessage('user', e.detail.message);
    });

    // Add event listener for new-chat
    document.addEventListener('new-chat', () => {
      this.clearMessages();
    });
  }

  addMessage(type, message) {
    const messageElement = document.createElement('chat-message');
    messageElement.setAttribute('type', type);
    messageElement.setAttribute('message', message);
    this.chatWindowElement.prepend(messageElement);
  }

  clearMessages() {
    const slot = this.shadowRoot.querySelector('slot[name="messages"]');
    const assignedNodes = slot.assignedNodes({ flatten: true });

    assignedNodes.forEach(message => {
      if (message.nodeType === Node.ELEMENT_NODE) {
        message.style.display = 'none';
      }
    });

    const children = Array.from(this.chatWindowElement.children).filter(child => child.tagName === 'CHAT-MESSAGE');

    children.forEach(message => {
      message.style.display = 'none';
    });
  }
}

customElements.define('chat-window', ChatWindow);
