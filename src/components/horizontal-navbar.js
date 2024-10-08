// src/components/horizontal-navbar.js
import { EventBus } from '../event-bus.js';

class HorizontalNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['nav-links'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'nav-links' && oldValue !== newValue) {
      this.render();
    }
  }

  navigateToSection(event) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget.getAttribute('data-href');
    if (target) {
      EventBus.emit('navigate', { target });
      // Optionally, scroll to the section
      document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const navLinks = JSON.parse(this.getAttribute('nav-links') || '[]');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background-color: var(--navbar-bg, #36393f);
          color: var(--navbar-color, #ffffff);
          height: 60px;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          z-index: 1000;
        }
        nav {
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
        nav a {
          text-decoration: none;
          color: inherit;
          padding: 10px 15px;
          cursor: pointer;
        }
        nav a:hover {
          background-color: var(--navbar-hover-bg, #3b3e44);
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          background-color: var(--button-bg, #36393f);
          color: var(--navbar-color, #ffffff);
          cursor: pointer;
          border-radius: 5px;
        }
        button:hover {
          background-color: var(--navbar-hover-bg, #3b3e44);
          color: var(--navbar-color, #ffffff);
          cursor: pointer;
        }
      </style>
      <nav>
        <button id="toggle-left-sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="25">
            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
          </svg>                
        </button>
        <div style="align-content: center;">
          ${navLinks.map(link => `<a data-href="${link.href}" onclick="${this.navigateToSection}" data-nav="${link.nav}" target="${link.target || "_parent"}">${link.label}</a>`).join('')}
        </div>
        <button id="toggle-right-sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="25">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </nav>
    `;

    this.shadowRoot.querySelectorAll('nav a').forEach(anchor => {
      anchor.addEventListener('click', this.navigateToSection.bind(this));
    });

    this.shadowRoot.querySelector('#toggle-left-sidebar').addEventListener('click', () => {
      const leftSidebar = document.querySelector('left-sidebar');
      if (leftSidebar) {
        leftSidebar.classList.toggle('expanded');
      }
    });

    this.shadowRoot.querySelector('#toggle-right-sidebar').addEventListener('click', () => {
      const rightSidebar = document.querySelector('right-sidebar');
      if (rightSidebar) {
        rightSidebar.classList.toggle('hidden');
      }
    });
  }
}

customElements.define('horizontal-navbar', HorizontalNavbar);
