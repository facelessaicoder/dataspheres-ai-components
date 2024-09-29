// src/components/notifications/toast-container.js

class ToastContainer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.setupMutationObserver();
      this.initializeExistingToasts();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column-reverse;
            align-items: flex-end;
            gap: 10px;
            z-index: 1000;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
          }
        </style>
        <slot></slot>
      `;
    }

    addToast({ 
        message, 
        type = 'info', 
        duration = 30000, 
        actionUrl = '', 
        ctaText = '', 
        borderColor = '',
        clickCallback = ''
      }) {
        const toast = document.createElement('toast-notification');
        toast.setAttribute('message', message);
        toast.setAttribute('type', type);
        toast.setAttribute('duration', duration.toString());
        
        if (actionUrl) {
          toast.setAttribute('action-url', actionUrl);
        }
        
        if (ctaText) {
          toast.setAttribute('cta-text', ctaText);
        }
        
        if (borderColor) {
          toast.setAttribute('border-color', borderColor);
        }
        
        if (clickCallback) {
          toast.setAttribute('click-callback', clickCallback);
        }
    
        this.appendChild(toast);
        this.initializeToast(toast);
        return toast;
    }
  
    setupMutationObserver() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'toast-notification') {
                this.initializeToast(node);
              }
            });
          }
        });
      });
  
      observer.observe(this, { childList: true });
    }
  
    initializeExistingToasts() {
      this.querySelectorAll('toast-notification').forEach((toast) => {
        this.initializeToast(toast);
      });
    }
  
    initializeToast(toast) {
      // Trigger the connectedCallback if it hasn't run yet
      if (typeof toast.initializeToast === 'function') {
        toast.initializeToast();
      }
    }
  
    addToast(toast) {
      this.appendChild(toast);
      this.initializeToast(toast);
    }
  }
  
  customElements.define('toast-container', ToastContainer);
  
  export default ToastContainer;
