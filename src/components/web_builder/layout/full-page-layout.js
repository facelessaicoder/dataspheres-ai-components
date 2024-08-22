// src/components/web_builder/layout/full-page-layout.js

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export class FullPageLayout extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const header = this.querySelector('basic-header');
    const sections = Array.from(this.children).filter(child => child !== header && child.hasAttribute('data-full-section'));

    this.innerHTML = `
      <div class="relative flex flex-col h-screen">
        ${header ? header.outerHTML : ''}
        <div class="flex-grow relative">
          <nav id="table-of-contents" class="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
            <ul class="flex flex-col space-y-2">
              ${sections.map((_, index) => `
                <li>
                  <button class="w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-600 transition-colors duration-300"
                          data-section="${index}"
                          aria-label="Go to section ${index + 1}"></button>
                </li>
              `).join('')}
            </ul>
          </nav>
          <div id="sections-container" class="h-full overflow-y-auto snap-y snap-mandatory">
            ${sections.map(section => `
              <div class="snap-start min-h-full">
                ${section.outerHTML}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.tableOfContents = this.querySelector('#table-of-contents');
    this.sectionsContainer = this.querySelector('#sections-container');
  }

  setupEventListeners() {
    this.tableOfContents.addEventListener('click', this.handleNavClick.bind(this));
  }

  handleNavClick(event) {
    if (event.target.tagName === 'BUTTON') {
      const sectionIndex = parseInt(event.target.dataset.section);
      this.scrollToSection(sectionIndex);
    }
  }

  scrollToSection(sectionIndex) {
    const sections = this.sectionsContainer.children;
    if (sections[sectionIndex]) {
      sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }
}

customElements.define('full-page-layout', FullPageLayout);