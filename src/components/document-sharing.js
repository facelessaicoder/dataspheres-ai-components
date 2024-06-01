class DocumentSharing extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --input-bg: var(--input-bg, #fff);
            --input-color: var(--input-color, #000);
            --input-border: var(--input-border, #ccc);
          }
          input {
            margin: 10px 0;
            background-color: var(--input-bg);
            color: var(--input-color);
            border: 1px solid var(--input-border);
          }
          #fileList {
            margin-top: 10px;
          }
        </style>
        <input type="file" id="fileInput" />
        <div id="fileList"></div>
      `;
  
      this.fileInput = this.shadowRoot.querySelector('#fileInput');
      this.fileList = this.shadowRoot.querySelector('#fileList');
  
      this.fileInput.addEventListener('change', () => this.handleFileUpload());
    }
  
    handleFileUpload() {
      const files = this.fileInput.files;
      this.fileList.innerHTML = '';
  
      Array.from(files).forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.textContent = file.name;
        this.fileList.appendChild(fileElement);
      });
  
      // For simplicity, this example does not include file sharing logic.
      // In a real application, you would implement file upload and sharing functionality.
    }
  }
  
  customElements.define('document-sharing', DocumentSharing);
  