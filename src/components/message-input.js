import EventBus from '../event-bus.js';

class MessageInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :root {
          --input-bg: var(--input-bg, #f1f1f1);
          --input-color: var(--input-color, #000);
          --input-border: var(--input-border, #ccc);
          --button-bg: var(--button-bg, #007bff);
          --button-color: var(--button-color, #ffffff);
          --button-hover-bg: var(--button-hover-bg, #0056b3);
        }
        .input-container {
          display: flex;
          align-items: center;
          background-color: #f1f1f1;
          padding: 10px;
          border-radius: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          outline: none;
          margin-bottom: 5px;
        }
        textarea {
          flex: 1;
          padding: 10px;
          background-color: #fff;
          color: var(--input-color);
          border: none;
          border-radius: 10px;
          outline: none;
          resize: none; /* Disable resizing */
          min-height: 50px; /* Minimum height */
          font-family: Arial, sans-serif; /* Font style similar to chat applications */
          font-size: 14px;
          box-sizing: border-box; /* Include padding and border in element's total width and height */
          margin-right: 10px;
        }
        button {
          padding: 10px 20px;
          background-color: var(--button-bg);
          color: var(--button-color);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 5px;
          font-family: Arial, sans-serif; /* Font style similar to chat applications */
          font-size: 14px;
        }
        button:hover {
          background-color: var(--button-hover-bg);
          color: var(--button-color);
        }
        .attachment-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          margin-left: 5px;
        }
        .attachment-button svg {
          width: 24px;
          height: 24px;
        }
      </style>
      <div class="input-container">
        <textarea placeholder="Type a message..."></textarea>
        <button class="attachment-button" title="Attach file">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>      
        </button>
        <button class="attachment-button" title="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>      
        </button>
      </div>
    `;

    this.textareaElement = this.shadowRoot.querySelector('textarea');
    this.sendButtonElement = this.shadowRoot.querySelector('button[title="Send message"]');
    this.attachmentButtonElement = this.shadowRoot.querySelector('button[title="Attach file"]');

    this.textareaElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.sendButtonElement.addEventListener('click', () => {
      this.sendMessage();
    });

    this.attachmentButtonElement.addEventListener('click', () => {
      this.attachFile();
    });
  }

  sendMessage() {
    const message = this.textareaElement.value;
    if (message) {
      EventBus.emit('newMessage', { message });
      this.textareaElement.value = '';
    }
  }

  attachFile() {
    // Logic for attaching a file can be added here
  }
}

customElements.define('message-input', MessageInput);
