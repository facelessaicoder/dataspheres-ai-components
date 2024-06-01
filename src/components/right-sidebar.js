class RightSidebar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 250px;
            background-color: var(--sidebar-bg, #2f3136);
            color: var(--sidebar-color, #ffffff);
            height: 100%;
            position: fixed;
            top: 0;
            right: 0;
            overflow-y: auto;
          }
          nav {
            display: flex;
            flex-direction: column;
            padding: 20px;
          }
          nav a {
            text-decoration: none;
            color: inherit;
            padding: 10px 0;
          }
          nav a:hover {
            background-color: var(--sidebar-hover-bg, #393c43);
          }
        </style>
        <nav>
          <a href="#">Notifications</a>
          <a href="#">Direct Messages</a>
          <a href="#">Files</a>
          <a href="#">Help</a>
        </nav>
      `;
    }
  }
  
  customElements.define('right-sidebar', RightSidebar);
  