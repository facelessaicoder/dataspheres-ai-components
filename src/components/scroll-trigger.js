import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollTriggerComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.runScrollAnimation();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  runScrollAnimation() {
    const contentElement = this.shadowRoot.querySelector('.content');
    gsap.from(contentElement, {
      scrollTrigger: {
        trigger: contentElement,
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });
  }
}

customElements.define('scroll-trigger', ScrollTriggerComponent);
