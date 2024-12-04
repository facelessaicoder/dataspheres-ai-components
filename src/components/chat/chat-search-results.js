// components/chat/chat-search-results.js

class ChatSearchResults extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['query', 'summary', 'theme'];
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
      const theme = this.getAttribute('theme') || 'light';
      const query = this.getAttribute('query');
      const summary = this.getAttribute('summary');
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            margin: 0;
          }
  
          .search-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
  
          .search-summary {
            font-size: 13px;
            color: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
            margin: 0 0 4px 0;
            line-height: 1.3;
          }
  
          .search-query {
            font-weight: 500;
            color: ${theme === 'dark' ? '#E2E8F0' : '#1E293B'};
          }
  
          ::slotted(chat-article-preview) {
            margin-top: 4px;
          }
  
          .results-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
        </style>
  
        <div class="search-container">
          ${query ? `
            <div class="search-summary">
              <span class="search-query">"${query}"</span> - ${summary}
            </div>
          ` : ''}
          <div class="results-container">
            <slot></slot>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('chat-search-results', ChatSearchResults);
  