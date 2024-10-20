// src/components/notifications/toast-notification.js

class ToastNotification extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
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
    const ctaText = this.getAttribute('cta-text');
    const ctaColor = this.getAttribute('cta-color') || '#a67c00';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #ffffff;
          color: #333333;
          padding: 12px 20px;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 300px;
          box-sizing: border-box;
          border-left: 4px solid ${borderColor};
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
        .toast-content {
          display: flex;
          flex-direction: column;
        }
        .toast-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        .message {
          flex-grow: 1;
          margin-right: 10px;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #999999;
          padding: 0;
          line-height: 1;
        }
        .close-btn:hover {
          color: #333333;
        }
        .cta-button {
          display: inline-block;
          background-color: ${ctaColor};
          color: white;
          padding: 6px 12px;
          text-align: center;
          text-decoration: none;
          font-size: 14px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          transition: background-color 0.3s;
        }
        .cta-button:hover {
          background-color: ${ctaColor};
        }
      </style>
      <div class="toast-content">
        <div class="toast-header">
          <div class="message">${message}</div>
          <button class="close-btn">&times;</button>
        </div>
        <slot></slot>
        ${ctaText && actionUrl ? `<a href="${actionUrl}" class="cta-button">${ctaText}</a>` : ''}
      </div>
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
    if (actionUrl) {
      this.addEventListener('click', (e) => {
        if (e.target !== closeBtn && !e.target.classList.contains('cta-button')) {
          window.location.href = actionUrl;
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
    const duration = parseInt(this.getAttribute('duration')) || 30000;
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
