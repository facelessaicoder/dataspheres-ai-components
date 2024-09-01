// src/components/common/global-spinner.js

class GlobalSpinner extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
          }
          
          :host(.visible) {
            opacity: 1;
            visibility: visible;
          }
  
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="spinner"></div>
      `;
    }
  
    show() {
      this.classList.add('visible');
    }
  
    hide() {
      this.classList.remove('visible');
    }
  }
  
  customElements.define('global-spinner', GlobalSpinner);
  
  // Export a singleton instance
  const globalSpinner = document.createElement('global-spinner');
  document.body.appendChild(globalSpinner);
  
  export default globalSpinner;