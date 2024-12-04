class ChatLoadingStatus extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['message', 'theme'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const message = this.getAttribute('message') || 'Processing...';
        const theme = this.getAttribute('theme') || 'light';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                @keyframes rotate {
                    100% { transform: rotate(360deg); }
                }

                @keyframes dash {
                    0% {
                        stroke-dasharray: 1, 150;
                        stroke-dashoffset: 0;
                    }
                    50% {
                        stroke-dasharray: 90, 150;
                        stroke-dashoffset: -35;
                    }
                    100% {
                        stroke-dasharray: 90, 150;
                        stroke-dashoffset: -124;
                    }
                }

                .loading-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .spinner {
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                    animation: rotate 1s linear infinite;
                }

                .spinner circle {
                    fill: none;
                    stroke: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
                    stroke-width: 4;
                    stroke-linecap: round;
                    animation: dash 1.5s ease-in-out infinite;
                }

                .message {
                    color: ${theme === 'dark' ? '#94A3B8' : '#64748B'};
                    font-size: 13px;
                    line-height: 1.4;
                }
            </style>

            <div class="loading-container">
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" />
                </svg>
                <div class="message">${message}</div>
            </div>
        `;
    }
}

customElements.define('chat-loading-status', ChatLoadingStatus);
