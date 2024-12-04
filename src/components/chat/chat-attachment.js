class ChatAttachment extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['name', 'type', 'size', 'url', 'theme'];
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    formatFileSize(bytes) {
      if (!bytes) return '';
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = parseInt(bytes);
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    }
  
    getIconForType(type) {
      const icons = {
        image: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>`,
        video: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>`,
        audio: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
        </svg>`,
        pdf: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>`,
        doc: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
        </svg>`,
        default: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
        </svg>`
      };
  
      return icons[type] || icons.default;
    }
  
    render() {
      const name = this.getAttribute('name');
      const type = this.getAttribute('type') || 'default';
      const size = this.getAttribute('size');
      const url = this.getAttribute('url');
      const theme = this.getAttribute('theme') || 'light';
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            margin: 0;
            position: relative;
          }
  
          .attachment {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC'};
            border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0'};
            border-radius: 6px;
            color: inherit;
            text-decoration: none;
            transition: all 0.15s ease;
          }
  
          .attachment:hover {
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9'};
          }
  
          .icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0'};
            flex-shrink: 0;
          }
  
          .icon svg {
            width: 18px;
            height: 18px;
            stroke: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
          }
  
          .info {
            flex: 1;
            min-width: 0;
          }
  
          .name {
            font-size: 13px;
            font-weight: 500;
            color: ${theme === 'dark' ? '#E2E8F0' : '#1E293B'};
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
  
          .size {
            font-size: 11px;
            color: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
            margin: 0;
          }
  
          .download {
            display: flex;
            align-items: center;
            padding: 4px;
            border-radius: 4px;
            opacity: 0.5;
            transition: all 0.15s ease;
          }
  
          .attachment:hover .download {
            opacity: 1;
          }
  
          .download svg {
            width: 16px;
            height: 16px;
            stroke: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
          }

          /* Overlay container */
          .overlay-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
          }
        </style>
  
        <a href="${url}" class="attachment" target="_blank" rel="noopener noreferrer">
          <div class="icon">
            ${this.getIconForType(type)}
          </div>
          <div class="info">
            <p class="name">${name}</p>
            ${size ? `<p class="size">${this.formatFileSize(size)}</p>` : ''}
          </div>
          <div class="download">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
        </a>
        <div class="overlay-container">
            <slot></slot>
        </div>
      `;
    }
}
  
customElements.define('chat-attachment', ChatAttachment);