class AudioChatInterface extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._isDragging = false;
      this._dragOffset = { x: 0, y: 0 };
      // Track AI and user visualizer references
      this._aiVisualizer = null;
      this._userVisualizer = null;
    }
  
    static get observedAttributes() {
      return ['avatar-url', 'agent-name', 'muted', 'ai-color', 'user-color', 'theme'];
    }
  
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.setupVisualizers();
    }
  
    setupEventListeners() {
      // Toggle mute with spacebar
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.toggleMute();
        }
      });

       // Add drag handling
    const container = this.shadowRoot.querySelector('.container');
    const dragHandle = this.shadowRoot.querySelector('.header');

    dragHandle.addEventListener('mousedown', (e) => {
        if (e.target.closest('.control-button')) return; // Don't drag when clicking controls
        
        this._isDragging = true;
        const rect = container.getBoundingClientRect();
        
        this._dragOffset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        container.style.transition = 'none';
        dragHandle.style.cursor = 'grabbing';
      });
  
      document.addEventListener('mousemove', (e) => {
        if (!this._isDragging) return;
        
        const x = e.clientX - this._dragOffset.x;
        const y = e.clientY - this._dragOffset.y;
        
        // Keep within window bounds
        const rect = container.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        container.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        container.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        container.style.transform = 'none';
      });
  
      document.addEventListener('mouseup', () => {
        if (!this._isDragging) return;
        
        this._isDragging = false;
        container.style.transition = '';
        dragHandle.style.cursor = 'grab';
      });
  
      this.shadowRoot.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
  
        switch (target.dataset.action) {
          case 'close':
            this.dispatchEvent(new CustomEvent('chat-audio-close'));
            break;
          case 'mute':
            this.toggleMute();
            this.render();
            break;
        }
      });
    }
  
    toggleMute() {
        const isMuted = this.getAttribute('muted') === 'true';
        this.setAttribute('muted', (!isMuted).toString());
        
        // Only toggle the user's visualizer
        if (this._userVisualizer) {
          this._userVisualizer.setAttribute('active', isMuted ? 'false' : 'true');
        }
        
        this.dispatchEvent(new CustomEvent('mute-change', { 
          detail: { muted: !isMuted }
        }));
        
        this.render();
    }

    setupVisualizers() {
        // Get references to both visualizers
        this._aiVisualizer = this.shadowRoot.querySelector('audio-visualizer[data-type="ai"]');
        this._userVisualizer = this.shadowRoot.querySelector('audio-visualizer[data-type="user"]');
  
        // Always keep AI visualizer active
        if (this._aiVisualizer) {
          this._aiVisualizer.setAttribute('active', 'true');
        }
  
        // Set user visualizer based on mute state
        if (this._userVisualizer) {
          const isMuted = this.getAttribute('muted') === 'true';
          this._userVisualizer.setAttribute('active', !isMuted ? 'true' : 'false');
        }
    }
  
    render() {
      const avatarUrl = this.getAttribute('avatar-url') || '/api/placeholder/64/64';
      const agentName = this.getAttribute('agent-name') || 'AI Assistant';
      const isMuted = this.getAttribute('muted') === 'true';
      const aiColor = this.getAttribute('ai-color') || '#4f46e5';
      const userColor = this.getAttribute('user-color') || '#22c55e';
      const theme = this.getAttribute('theme') || 'light';
  
      this.shadowRoot.innerHTML = `
        <style>
  :host {
    --interface-bg: ${theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    --text-primary: ${theme === 'dark' ? '#f3f4f6' : '#0f172a'};
    --text-secondary: ${theme === 'dark' ? '#c0c5cf' : '#374151'};
    display: block;
    position: fixed;
    z-index: 1000;
  }

  .container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: var(--interface-bg);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    cursor: grab;
    border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    user-select: none;
  }

  .header:active {
    cursor: grabbing;
  }

  .agent-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    object-fit: cover;
  }

  .agent-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  .control-button {
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-secondary);
    border-radius: 8px;
    transition: all 0.2s;
  }

  .control-button:hover {
    background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }

  .visualization-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
    border-radius: 12px;
    min-height: 300px;
  }

  .visualization-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    opacity: 0.95;
  }

  .mute-button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: none;
    background: ${isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'};
    color: ${isMuted ? '#ef4444' : '#22c55e'};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .mute-button:hover {
    background: ${isMuted ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)'};
    transform: translateY(-1px);
  }

  .mute-button:active {
    transform: translateY(0px);
  }

  .mute-icon {
    flex-shrink: 0;
  }

  .mute-text {
    text-align: left;
    line-height: 1.3;
  }

  .instructions {
    font-size: 0.875rem;
    padding: 1rem;
    background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 8px;
    margin-top: 1rem;
    border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }

  .instructions strong {
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
  }

  .instructions ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    list-style-type: none;
  }

  .instructions li {
    position: relative;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .instructions li::before {
    content: "•";
    position: absolute;
    left: -1rem;
    color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
  }

  /* SVG icon styles */
  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
</style>
  
        <div class="container">
      <div class="chat-container">
        <div class="header">
          <div class="agent-info">
            <img class="avatar" src="${avatarUrl}" alt="${agentName}">
            <span class="agent-name">${agentName}</span>
          </div>
          <div class="controls">
            <button class="control-button" data-action="close" title="End Call">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="visualization-container">
          <div class="visualization-label">AI Neural Pattern</div>
           <audio-visualizer 
                data-type="ai"
                color="${aiColor}" 
                active="true">
            </audio-visualizer>
          
          <div class="visualization-label">Your Quantum Field</div>
          <audio-visualizer 
                data-type="user"
                color="${userColor}" 
                active="${!isMuted}">
              </audio-visualizer>
        </div>

        <button class="mute-button" data-action="mute">
              <span class="mute-icon">
                ${isMuted ? `
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ` : `
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                `}
              </span>
              <span class="mute-text">
                ${isMuted ? 
                  'Microphone Off (Space to unmute)' : 
                  'Microphone On (Space to mute)'}
              </span>
        </button>

        <div class="instructions">
          <strong>How to interact:</strong>
          <ul>
            <li>Press space or click the mic button to toggle your microphone</li>
            <li>When muted, the AI will continue speaking</li>
            <li>Unmute and speak to interject naturally in the conversation</li>
            <li>Like a human conversation, speaking while unmuted will pause the AI</li>
          </ul>
        </div>
      </div>
    </div>
      `;

      // Re-setup visualizers after render
      this.setupVisualizers();
    }
}

customElements.define('audio-chat-interface', AudioChatInterface);
