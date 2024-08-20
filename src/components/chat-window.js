import EventBus from '../event-bus.js';
import './chat-message.js'; // Import the sub-component

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
      this.sendMessage(e.detail.message);
    });

    // Add event listener for new-chat
    document.addEventListener('new-chat', (e) => {
      const chatId = e.detail.chatId;
      this.switchChatChannel(chatId);
    });

    EventBus.on('newMessage', this.handleNewMessage.bind(this));

    this.socket = null;
    this.reconnectInterval = 5000; // 5 seconds
  }

  connectedCallback() {
    // Connect to the default chat channel
    this.switchChatChannel('default-chat');
  }

  handleNewMessage(payload) {
    if (payload && typeof payload === 'object') {
      console.log('Received new message:', payload);
      const { client_id, message, timestamp, type } = payload;
      this.addMessage(client_id || 'User', message, timestamp, type || 'user');
    } else {
      console.error('Invalid message payload');
    }
  }

  addMessage(name, message, timestamp, type) {
    if (!message) {
      console.error('Message is undefined or empty:', message);
      return;
    }
    const messageElement = document.createElement('chat-message');
    messageElement.setAttribute('name', name);
    messageElement.setAttribute('message', typeof message === 'string' ? message : JSON.stringify(message));
    messageElement.setAttribute('timestamp', timestamp || new Date().toLocaleTimeString());
    messageElement.setAttribute('type', type);
    messageElement.setAttribute('avatar', (name && name[0]) || 'U'); // Default to 'U' if name is undefined or empty
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

  switchChatChannel(chatId) {
    if (this.socket) {
      this.socket.close();
    }
    this.clearMessages();

    this.connectToWebSocket(chatId);
  }

  connectToWebSocket(chatId) {
    this.socket = new WebSocket(`ws://127.0.0.1:8000/ws/${chatId}`);

    this.socket.onopen = () => {
      console.log(`Connected to chat channel: ${chatId}`);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      this.handleNewMessage(data);
    };

    this.socket.onclose = (event) => {
      console.log(`Disconnected from chat channel: ${chatId} - Reason: ${event.reason}`);
      setTimeout(() => {
        this.connectToWebSocket(chatId);
      }, this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    };
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const chatId = 'chat_1'; // Example chat ID
      console.log(`Sending message to chat ${chatId}:`, message);
      this.socket.send(JSON.stringify({
        chat_id: chatId,
        message: message,
        client_id: 'user', 
        timestamp: new Date().toLocaleTimeString()
      }));
    }
  }
}

customElements.define('chat-window', ChatWindow);
