class LeftSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Get attributes
    const title = this.getAttribute('title') || 'Menu';
    const sections = JSON.parse(this.getAttribute('sections')) || [];
    const newChatEnabled = this.hasAttribute('new-chat-enabled');

    // Create component HTML structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 55px; /* Slim bar width */
          background-color: var(--sidebar-bg, #2f3136);
          color: var(--sidebar-color, #ffffff);
          height: 100%;
          position: fixed;
          top: 55px;
          left: 0;
          overflow: hidden;
          transition: width 0.3s ease; /* Smooth transition for expanding */
        }
        :host(.expanded) {
          width: 250px; /* Expanded sidebar width */
        }
        .sidebar {
          width: 100%;
          height: 100%;
          background-color: var(--sidebar-bg, #2f3136);
          position: relative;
        }
        h2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .new-chat {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .new-chat svg {
          margin-left: 8px;
        }
        .section {
          margin-top: 15px;
          margin-bottom: 15px;
        }
        .section-title {
          font-weight: bold;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
        }
        .section-title .title-text {
          margin-right: 8px;
        }
        .links {
          display: none;
          margin-top: 5px;
        }
        .links a {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 10px 0;
        }
        .links a:hover {
          background-color: var(--sidebar-hover-bg, #393c43);
        }
        .icon-only,
        .full-content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 15px;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .icon-only {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .icon {
          margin-bottom: 20px;
          margin-left: 12px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--icon-bg, #4f545c);
          color: var(--icon-color, #ffffff);
          font-size: 16px;
          text-transform: uppercase;
        }
        .icon img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .icon svg {
          height: 20px;
          width: 20px;
        }
        .full-content {
          opacity: 0;
          transform: translateX(-20px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        :host(.expanded) .icon-only {
          opacity: 0;
          transform: translateX(-20px);
        }
        :host(.expanded) .full-content {
          opacity: 1;
          transform: translateX(0);
        }
      </style>
      <div class="sidebar">
        <div class="icon-only">
        ${newChatEnabled ? `
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>` : ''}
          ${sections.map(section => `
            <div class="icon">${section.icon}</div>
          `).join('')}
        </div>
        <div class="full-content">
          ${newChatEnabled ? `
          <div class="new-chat">
            <span style="font-weight: bold;">Start New Chat</span>
            <svg style="margin-left: 8px; margin-top: -2px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>` : ''}
          ${sections.map(section => `
            <div class="section">
              <div class="section-title">
                <span class="title-text">${section.title}</span>
                <span class="toggle-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>            
                </span>
              </div>
              <div class="links">
                ${section.links.map(link => `<a href="${link.href}">${link.label}</a>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add event listeners for section toggling
    this.shadowRoot.querySelectorAll('.section-title').forEach((sectionTitle, index) => {
      sectionTitle.addEventListener('click', () => {
        const links = this.shadowRoot.querySelectorAll('.links')[index];
        const arrow = sectionTitle.querySelector('.toggle-arrow');
        if (links.style.display === 'none' || links.style.display === '') {
          links.style.display = 'block';
          arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>`;
        } else {
          links.style.display = 'none';
          arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg> `; 
        }
      });
    });

    // Add event listener for new chat action
    if (newChatEnabled) {
      this.shadowRoot.querySelector('.new-chat').addEventListener('click', () => {
        const event = new CustomEvent('new-chat', { bubbles: true, composed: true });
        this.dispatchEvent(event);
      });
    }

    // Expand on hover
    this.addEventListener('mouseenter', () => {
      console.log('Mouse enter');
      this.classList.add('expanded');
    });

    this.addEventListener('mouseleave', () => {
      console.log('Mouse leave');
      this.classList.remove('expanded');
    });
  }
}

customElements.define('left-sidebar', LeftSidebar);
