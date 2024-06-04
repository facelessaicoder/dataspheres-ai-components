import { gsap } from 'gsap';

class AnimatedText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.animateText();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .text {
          font-size: 1.5rem;
          color: #333;
          overflow: hidden;
        }
      </style>
      <div class="text">${this.getAttribute('text')}</div>
    `;
  }

  animateText() {
    const animationType = this.getAttribute('animation-type') || 'fade';
    const textElement = this.shadowRoot.querySelector('.text');
    
    switch (animationType) {
      case 'split':
        gsap.from(textElement, {
          duration: 1,
          y: 100,
          opacity: 0,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.5
        });
        break;
      case 'fade':
      default:
        gsap.from(textElement, { duration: 1, opacity: 0 });
        break;
    }
  }
}

customElements.define('animated-text', AnimatedText);
