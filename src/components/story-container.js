// src/components/story-container.js
import { initializeScrollAnimations } from './scroll-animations.js';

class StoryContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initializeAnimations();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .story-container {
                    padding: 20px;
                }
            </style>
            <div class="story-container">
                <slot></slot>
            </div>
        `;
    }

    initializeAnimations() {
        const slot = this.shadowRoot.querySelector('slot');
        const assignedElements = slot.assignedElements();
        assignedElements.forEach(element => {
            initializeScrollAnimations(element);
        });
    }
}

customElements.define('story-container', StoryContainer);
