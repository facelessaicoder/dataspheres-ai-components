// src/scroll-animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function applyScrollAnimations(target) {
    const animationType = target.getAttribute('data-animation');
    switch (animationType) {
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
            console.warn('Unknown animation type:', animationType);
            break;
    }
}

export function initializeScrollAnimations(container) {
    const animateElements = container.querySelectorAll('.animate');
    animateElements.forEach(target => {
        applyScrollAnimations(target);
    });
}
