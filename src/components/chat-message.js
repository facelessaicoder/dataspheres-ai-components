class ChatMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .message-container {
          display: flex;
          align-items: flex-start;
          margin: 10px 0;
          padding: 10px;
          border-radius: 8px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--avatar-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          margin-right: 10px;
        }
        .content {
          display: flex;
          flex-direction: column;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .name {
          font-weight: bold;
          margin-right: 10px;
        }
        .timestamp {
          color: var(--timestamp-color);
          font-size: 0.8em;
        }
        .message {
          border-radius: 5px;
          color: var(--message-color);
        }
        .user {
          background-color: var(--message-bg-user);
        }
        .ai {
          background-color: var(--message-bg-ai);
        }
      </style>
      <div class="message-container">
        <div class="avatar"></div>
        <div class="content">
          <div class="header">
            <div class="name"></div>
            <div class="timestamp"></div>
          </div>
          <div class="message"></div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const messageType = this.getAttribute('type') || 'user';
    const messageText = this.getAttribute('message') || '';
    const userName = this.getAttribute('name') || 'User';
    const avatarText = this.getAttribute('avatar') || userName[0];
    const timestamp = this.getAttribute('timestamp') || new Date().toLocaleTimeString();

    const avatarElement = this.shadowRoot.querySelector('.avatar');
    avatarElement.textContent = avatarText;

    const nameElement = this.shadowRoot.querySelector('.name');
    nameElement.textContent = userName;

    const timestampElement = this.shadowRoot.querySelector('.timestamp');
    timestampElement.textContent = timestamp;

    const messageElement = this.shadowRoot.querySelector('.message');
    messageElement.textContent = messageText;
    messageElement.classList.add(messageType);

    const containerElement = this.shadowRoot.querySelector('.message-container');
    containerElement.classList.add(messageType);
  }
}

customElements.define('chat-message', ChatMessage);
