// src/components/notifications/toast-notification.js

class ToastNotification extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Delay initialization to ensure all attributes are set
    setTimeout(() => this.initializeToast(), 0);
  }

  initializeToast() {
    this.render();
    this.setupEventListeners();
    this.animateIn();
    this.setupAutoClose();
  }

  render() {
    const message = this.getAttribute('message') || 'Notification';
    const type = this.getAttribute('type') || 'info';
    const borderColor = this.getAttribute('border-color') || this.getDefaultBorderColor(type);
    const actionUrl = this.getAttribute('action-url');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          background-color: #ffffff;
          color: #333333;
          padding: 12px 20px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 300px;
          box-sizing: border-box;
          border-left: 4px solid ${borderColor};
          cursor: ${actionUrl ? 'pointer' : 'default'};
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
        .content {
          flex-grow: 1;
          margin-right: 20px;
        }
        .message {
          margin-bottom: 5px;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #999999;
        }
        .close-btn:hover {
          color: #333333;
        }
      </style>
      <div class="content">
        <div class="message">${message}</div>
        <slot></slot>
      </div>
      <button class="close-btn">&times;</button>
    `;
  }

  getDefaultBorderColor(type) {
    const colors = {
      info: '#3498db',
      success: '#2ecc71',
      warning: '#f39c12',
      error: '#e74c3c'
    };
    return colors[type] || colors.info;
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    const actionUrl = this.getAttribute('action-url');
    const clickCallback = this.getAttribute('click-callback');

    if (actionUrl || clickCallback) {
      this.addEventListener('click', (e) => {
        if (e.target !== closeBtn) {
          if (actionUrl) {
            window.location.href = actionUrl;
          } else if (clickCallback) {
            const callback = new Function('return ' + clickCallback)();
            callback();
          }
        }
      });
    }
  }

  animateIn() {
    requestAnimationFrame(() => {
      this.style.opacity = '1';
    });
  }

  setupAutoClose() {
    const duration = parseInt(this.getAttribute('duration')) || 30000; // Default to 30 seconds
    setTimeout(() => {
      this.close();
    }, duration);
  }

  close() {
    this.style.opacity = '0';
    this.addEventListener('transitionend', () => {
      this.remove();
    }, { once: true });
  }
}

customElements.define('toast-notification', ToastNotification);

export default ToastNotification;
