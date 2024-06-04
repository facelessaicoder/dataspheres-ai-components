class FeaturesSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const features = JSON.parse(this.getAttribute('features'));
        this.shadowRoot.innerHTML = `
            <style>
                .features {
                    padding: 50px 20px;
                    background: #f9f9f9;
                    text-align: center;
                }
                .features h2 {
                    font-size: 2.5em;
                    margin-bottom: 30px;
                }
                .feature {
                    display: inline-block;
                    width: calc(33.333% - 30px); /* Adjust to ensure cards don't overlap */
                    margin: 0 15px 30px; /* Add margin to separate cards */
                    padding: 20px;
                    background: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    transition: transform 0.3s;
                }
                .feature:hover {
                    transform: translateY(-10px);
                }
                .feature h3 {
                    font-size: 1.5em;
                    margin-bottom: 10px;
                }
                .feature p {
                    font-size: 1em;
                    color: #666;
                }
                .feature icon-element {
                    margin-bottom: 20px;
                }
            </style>
            <div class="features">
                ${features.map(feature => `
                    <div class="feature">
                        <icon-element icon-name="${feature.icon}" size="50px" color="#007bff"></icon-element>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('features-section', FeaturesSection);
