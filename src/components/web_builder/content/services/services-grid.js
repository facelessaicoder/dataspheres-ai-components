// src/components/web_builder/content/services/services-grid.js

export class ServicesGrid extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    render() {
      const services = JSON.parse(this.getAttribute('services') || '[]');

      this.innerHTML = `
        <section class="py-12 bg-gray-100">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-8">Our Services</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${services.map(service => `
                <div class="bg-white rounded-lg shadow-md p-6">
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
  }

  customElements.define('services-grid', ServicesGrid);