// src/components/web_builder/layout/header/basic-header.js

export class BasicHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const logoText = this.getAttribute('logo-text') || 'Business Name';
    const menuItems = JSON.parse(this.getAttribute('menu-items') || '[]');

    this.innerHTML = `
      <header class="bg-white shadow-md">
        <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
          <div class="text-xl font-bold text-gray-800">${logoText}</div>
          <ul class="flex space-x-4">
            ${menuItems.map(item => `
              <li>
                <a href="${item.url}" class="text-gray-600 hover:text-gray-800 transition duration-300">
                  ${item.text}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </header>
    `;
  }
}

customElements.define('basic-header', BasicHeader);
