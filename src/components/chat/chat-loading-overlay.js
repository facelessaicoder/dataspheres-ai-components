class ChatLoadingOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['message', 'type', 'theme', 'progress', 'size'];
    }

    connectedCallback() {
        this.render();
        this.setupAnimation();
        this.adjustSize();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            if (name === 'size') {
                this.adjustSize();
            }
        }
    }

    setupAnimation() {
        const spinner = this.shadowRoot.querySelector('.spinner');
        if (spinner) {
            spinner.style.animation = 'rotate 1s linear infinite';
        }
    }

    // Automatically detect parent height and adjust sizing
    adjustSize() {
        requestAnimationFrame(() => {
            const parent = this.parentElement;
            if (parent) {
                const height = parent.offsetHeight;
                const isCompact = height < 60; // Threshold for compact mode
                
                if (isCompact) {
                    this.setAttribute('size', 'compact');
                } else {
                    this.setAttribute('size', 'normal');
                }
            }
        });
    }

    render() {
        const message = this.getAttribute('message') || 'Loading...';
        const type = this.getAttribute('type') || 'default';
        const theme = this.getAttribute('theme') || 'light';
        const progress = this.getAttribute('progress');
        const size = this.getAttribute('size') || 'normal';

        const spinnerColor = theme === 'dark' ? '#E2E8F0' : '#64748B';
        const backgroundColor = theme === 'dark' ? '#1E293B' : '#FFFFFF';
        const textColor = theme === 'dark' ? '#E2E8F0' : '#1E293B';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10;
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

                .overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: ${backgroundColor}88;
                    backdrop-filter: blur(1px);
                    border-radius: inherit;
                }

                .content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    text-align: center;
                }

                /* Compact mode for attachments */
                :host([size="compact"]) .content {
                    flex-direction: row;
                    padding: 4px 8px;
                }

                /* Normal mode for article previews */
                :host([size="normal"]) .content {
                    flex-direction: column;
                }

                .spinner {
                    width: ${size === 'compact' ? '14px' : '20px'};
                    height: ${size === 'compact' ? '14px' : '20px'};
                    flex-shrink: 0;
                }

                .spinner circle {
                    fill: none;
                    stroke: ${spinnerColor};
                    stroke-width: 4;
                    stroke-linecap: round;
                    animation: dash 1.5s ease-in-out infinite;
                }

                .message {
                    color: ${textColor};
                    font-size: ${size === 'compact' ? '12px' : '13px'};
                    line-height: 1.4;
                    font-weight: 500;
                    text-shadow: 0 1px 2px ${backgroundColor};
                }

                .progress {
                    width: 100%;
                    max-width: ${size === 'compact' ? '80px' : '120px'};
                    height: 2px;
                    background: ${theme === 'dark' ? '#2D3748' : '#E2E8F0'};
                    border-radius: 999px;
                    overflow: hidden;
                    ${size === 'compact' ? 'display: none;' : ''}
                }

                .progress-bar {
                    height: 100%;
                    background: ${type === 'success' ? '#22C55E' : 
                                type === 'error' ? '#EF4444' : '#3B82F6'};
                    width: ${progress || '0'}%;
                    transition: width 0.3s ease;
                }
            </style>

            <div class="overlay">
                <div class="content">
                    <svg class="spinner" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" />
                    </svg>
                    <div class="message">${message}</div>
                    ${progress && size !== 'compact' ? `
                        <div class="progress">
                            <div class="progress-bar"></div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('chat-loading-overlay', ChatLoadingOverlay);
