class ChatArticlePreview extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['url', 'title', 'description', 'site-name', 'theme'];
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    render() {
      const url = this.getAttribute('url') || '';
      const title = this.getAttribute('title') || '';
      const description = this.getAttribute('description') || '';
      const siteName = this.getAttribute('site-name') || new URL(url).hostname;
      const theme = this.getAttribute('theme') || 'light';
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            margin: 0;
            position: relative;
          }
  
          .preview-container {
            display: flex;
            gap: 8px;
            padding: 6px;
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC'};
            border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0'};
            border-radius: 4px;
            text-decoration: none;
            color: inherit;
          }
  
          .preview-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
  
          .site-info {
            display: flex;
            align-items: center;
            gap: 4px;
          }
  
          .site-name {
            font-size: 11px;
            color: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
          }
  
          .preview-title {
            font-size: 13px;
            font-weight: 500;
            color: ${theme === 'dark' ? '#E2E8F0' : '#1E293B'};
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.3;
            margin: 0;
          }
  
          .preview-description {
            font-size: 12px;
            color: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.3;
            margin: 0;
          }
  
          .icon-container {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 4px;
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0'};
          }
  
          .icon-container svg {
            width: 24px;
            height: 24px;
            stroke: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
          }
  
          .preview-container:hover {
            background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9'};
          }
  
          .preview-container:hover .icon-container svg {
            stroke: ${theme === 'dark' ? '#E2E8F0' : '#1E293B'};
          }

          /* Overlay slot container */
          .overlay-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
          }
        </style>
  
        <a href="${url}" class="preview-container" target="_blank" rel="noopener noreferrer">
          <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div class="preview-content">
            <div class="site-info">
              <span class="site-name">${siteName}</span>
            </div>
            <div class="preview-title">${title}</div>
            ${description ? `<div class="preview-description">${description}</div>` : ''}
          </div>
        </a>
        <div class="overlay-container">
          <slot></slot>
        </div>
      `;
    }
}

customElements.define('chat-article-preview', ChatArticlePreview);
