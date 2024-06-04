// src/components/story-section.js
class StorySection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.logContent(); // Log the content to verify rendering
    }

    render() {
        const title = this.getAttribute('title') || 'Default Title';
        const content = this.innerHTML;

        this.shadowRoot.innerHTML = `
            <style>
                .story-section {
                    padding: 50px 0;
                    border-bottom: 1px solid #ddd;
                }
                h2 {
                    font-size: 2em;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 1.2em;
                }
            </style>
            <div class="story-section">
                <h2 class="animate" data-animation="fade">${title}</h2>
                <div class="animate" data-animation="slide">${content}</div>
            </div>
        `;
    }

    logContent() {
        const animateElements = this.shadowRoot.querySelectorAll('.animate');
        console.log('StorySection animate elements:', animateElements);
    }
}

customElements.define('story-section', StorySection);
