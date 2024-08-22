// src/components/web_builder/content/contact/contact-us-section.js

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ContactUsSection extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupFormSubmission();
    this.animateSection();
  }

  render() {
    const phone = this.getAttribute('phone') || '(123) 456-7890';
    const email = this.getAttribute('email') || 'info@glamourcuts.com';
    const address = this.getAttribute('address') || '123 Style Street, Beauty City, ST 12345';

    this.innerHTML = `
      <section class="min-h-screen bg-gray-200 py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="contact-info opacity-0">
              <h3 class="text-2xl font-semibold mb-4">Get in Touch</h3>
              <p class="mb-2"><strong>Phone:</strong> ${phone}</p>
              <p class="mb-2"><strong>Email:</strong> ${email}</p>
              <p class="mb-2"><strong>Address:</strong> ${address}</p>
            </div>
            <form id="contact-form" class="space-y-4 opacity-0">
              <input type="text" name="name" placeholder="Your Name" required
                     class="w-full p-2 border border-gray-300 rounded">
              <input type="email" name="email" placeholder="Your Email" required
                     class="w-full p-2 border border-gray-300 rounded">
              <textarea name="message" placeholder="Your Message" required
                        class="w-full p-2 border border-gray-300 rounded" rows="4"></textarea>
              <button type="submit" 
                      class="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  setupFormSubmission() {
    const form = this.querySelector('#contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would typically send the form data to a server
      alert('Thank you for your message! We will get back to you soon.');
      form.reset();
    });
  }

  animateSection() {
    gsap.to('.contact-info', {
      opacity: 1,
      x: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 80%',
      },
    });

    gsap.to('#contact-form', {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: 0.2,
      scrollTrigger: {
        trigger: '#contact-form',
        start: 'top 80%',
      },
    });
  }
}

customElements.define('contact-us-section', ContactUsSection);