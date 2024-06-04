import { gsap } from "gsap";

class HeroSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.animateHero();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .hero {
                    background: #f4f4f4;
                    padding: 50px 20px;
                    text-align: center;
                }
                .hero h1 {
                    margin: 0;
                    font-size: 2.5em;
                }
                .hero p {
                    font-size: 1.2em;
                    margin: 20px 0;
                }
                .cta-button {
                    display: inline-block;
                    padding: 10px 20px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
            <div class="hero">
                <h1>${this.getAttribute('title')}</h1>
                <p>${this.getAttribute('description')}</p>
                <a href="${this.getAttribute('cta-link')}" class="cta-button">${this.getAttribute('cta-text')}</a>
            </div>
        `;
    }

    animateHero() {
        const animationType = this.getAttribute('animation') || 'fade';
        switch (animationType) {
            case 'slide':
                gsap.from(this.shadowRoot.querySelector("h1"), { duration: 1, x: -300, opacity: 0, ease: "power3.out" });
                gsap.from(this.shadowRoot.querySelector("p"), { duration: 1, x: 300, opacity: 0, delay: 0.5 });
                gsap.from(this.shadowRoot.querySelector(".cta-button"), { duration: 1, y: 50, opacity: 0, delay: 1 });
                break;
            case 'zoom':
                gsap.from(this.shadowRoot.querySelector("h1"), { duration: 1, scale: 0, opacity: 0, ease: "back.out(1.7)" });
                gsap.from(this.shadowRoot.querySelector("p"), { duration: 1, scale: 0, opacity: 0, delay: 0.5, ease: "back.out(1.7)" });
                gsap.from(this.shadowRoot.querySelector(".cta-button"), { duration: 1, scale: 0, opacity: 0, delay: 1, ease: "back.out(1.7)" });
                break;
            case 'fade':
            default:
                gsap.from(this.shadowRoot.querySelector("h1"), { duration: 1, opacity: 0 });
                gsap.from(this.shadowRoot.querySelector("p"), { duration: 1, opacity: 0, delay: 0.5 });
                gsap.from(this.shadowRoot.querySelector(".cta-button"), { duration: 1, opacity: 0, delay: 1 });
                break;
        }
    }
}

customElements.define('hero-section', HeroSection);
