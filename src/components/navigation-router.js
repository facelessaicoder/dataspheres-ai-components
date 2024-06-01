class NavigationRouter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            height: 100%;
          }
          .hidden {
            display: none;
          }
          .view {
            display: block;
          }
        </style>
        <div id="home" class="view">Home View</div>
        <div id="chat" class="view hidden">Chat View</div>
        <div id="settings" class="view hidden">Settings View</div>
      `;
    }
  
    connectedCallback() {
      this.navigateTo('home');
    }
  
    navigateTo(view) {
      this.shadowRoot.querySelectorAll('.view').forEach(el => {
        el.classList.add('hidden');
      });
      this.shadowRoot.getElementById(view).classList.remove('hidden');
    }
  }
  
  customElements.define('navigation-router', NavigationRouter);
  