// src/components/scroll-animator.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollAnimator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initAnimations(); // Directly initialize animations after rendering
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ::slotted(.animate) {
                    opacity: 0;
                }
            </style>
            <slot></slot>
        `;
    }

    initAnimations() {
        const slot = this.shadowRoot.querySelector('slot');
        const assignedElements = slot.assignedElements();
        console.log('Assigned elements:', assignedElements);

        assignedElements.forEach(element => {
            console.log('Inspecting element:', element);
            if (element.shadowRoot) {
                const animateElements = element.shadowRoot.querySelectorAll('.animate');
                console.log('Found animate elements in shadowRoot:', animateElements);

                animateElements.forEach(child => {
                    const animationType = child.getAttribute('data-animation');
                    console.log(`Applying ${animationType} animation to`, child);
                    this.applyAnimation(child, animationType);
                });
            } else {
                const animateElements = element.querySelectorAll('.animate');
                console.log('Found animate elements in light DOM:', animateElements);

                animateElements.forEach(child => {
                    const animationType = child.getAttribute('data-animation');
                    console.log(`Applying ${animationType} animation to`, child);
                    this.applyAnimation(child, animationType);
                });
            }
        });
    }

    applyAnimation(target, type) {
        switch(type) {
            case 'fade':
                gsap.fromTo(target, 
                    { opacity: 0 },
                    { opacity: 1, duration: 1, scrollTrigger: {
                        trigger: target,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: true,
                    }}
                );
                break;
            case 'slide':
                gsap.fromTo(target, 
                    { x: '-100%' },
                    { x: '0%', duration: 1, scrollTrigger: {
                        trigger: target,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: true,
                    }}
                );
                break;
            // Add more animation types as needed
            default:
                console.warn('Unknown animation type:', type);
                break;
        }
    }
}

customElements.define('scroll-animator', ScrollAnimator);
