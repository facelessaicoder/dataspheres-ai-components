// src/components/web_builder/content/services/services-section.js

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ServicesSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.animateServices();
  }

  render() {
    const services = JSON.parse(this.getAttribute('services') || '[]');

    this.innerHTML = `
      <section class="min-h-screen bg-gray-100 py-16 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${services.map((service, index) => `
              <div class="bg-white rounded-lg shadow-md p-6 service-card opacity-0">
                <h3 class="text-xl font-semibold mb-2">${service.name}</h3>
                <p class="text-gray-600 mb-4">${service.description}</p>
                <p class="text-blue-600 font-bold">$${service.price}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  animateServices() {
    gsap.utils.toArray('.service-card').forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
        },
      });
    });
  }
}

customElements.define('services-section', ServicesSection);