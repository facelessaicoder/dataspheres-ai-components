// src/components/web_builder/content/hero/image-hero.js

import { gsap } from 'gsap';

export class ImageHero extends HTMLElement {
  connectedCallback() {
    this.render();
    this.animateContent();
  }

  render() {
    const title = this.getAttribute('title') || 'Welcome';
    const subtitle = this.getAttribute('subtitle') || 'Discover our services';
    const ctaText = this.getAttribute('cta-text') || 'Learn More';
    const ctaUrl = this.getAttribute('cta-url') || '#';
    const backgroundImage = this.getAttribute('background-image') || 'https://via.placeholder.com/1200x600';

    this.innerHTML = `
      <section class="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-1000 ease-in-out"
             style="background-image: url('${backgroundImage}');">
        </div>
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="relative z-10 px-4 opacity-0">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">${title}</h1>
          <p class="text-xl md:text-2xl mb-8">${subtitle}</p>
          <a href="${ctaUrl}" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            ${ctaText}
          </a>
        </div>
      </section>
    `;
  }

  animateContent() {
    const background = this.querySelector('.bg-cover');
    const content = this.querySelector('.relative.z-10');

    gsap.to(background, { opacity: 1, duration: 1.5, ease: 'power2.inOut' });
    gsap.to(content, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power2.out' });
  }
}

customElements.define('image-hero', ImageHero);