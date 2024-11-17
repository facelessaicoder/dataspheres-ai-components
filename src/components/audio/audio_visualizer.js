class AudioVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._isAnimating = false;
        this._particles = [];
        this._strands = 4; // Default to 4 strands
        this._points = 20;
        this._analyserNode = null;
    }
  
    static get observedAttributes() {
      return ['color', 'active'];
    }

    // Add setter for analyser node
    set analyserNode(node) {
        this._analyserNode = node;
    }
  
    connectedCallback() {
      this.render();
      if (this.getAttribute('active') !== 'false') {
        this.startVisualization();
      }
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            height: 80px;
          }
          canvas {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.05);
          }
        </style>
        <canvas></canvas>
      `;
  
      this.canvas = this.shadowRoot.querySelector('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
    }
  
    resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
    }
  
    startVisualization() {
      if (!this._isAnimating) {
        this._isAnimating = true;
        this.animate();
      }
    }
  
    stopVisualization() {
      this._isAnimating = false;
    }

    resize() {
        const rect = this.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size to match container with device pixel ratio
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        // Scale context
        this.ctx.scale(dpr, dpr);
        
        // Set canvas style dimensions
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
    }
  
    animate() {
        if (!this._isAnimating) return;

    const { width, height } = this.canvas;
    const baseColor = this.getAttribute('color') || '#4f46e5';
    const time = Date.now() / 1000;
    
    // Calculate a safe margin to prevent cutoff
    const margin = height * 0.2;  // 20% margin
    const visualHeight = height - (margin * 2);  // Available height for visualization
    
    this.ctx.clearRect(0, 0, width, height);

    // Get audio data if available
    let audioData = new Uint8Array(128);
    let audioScale = 1;
    
    if (this._analyserNode) {
      this._analyserNode.getByteFrequencyData(audioData);
      audioScale = Array.from(audioData).reduce((a, b) => a + b) / (audioData.length * 256);
    }

    // Draw helix strands
    for (let strand = 0; strand < this._strands; strand++) {
      const points = [];
      const phaseOffset = (strand * Math.PI) / this._strands;

      for (let i = 0; i < this._points; i++) {
        const x = (i / (this._points - 1)) * width;
        const phase = (x / width) * Math.PI * 4 + time * 2;
        
        // Calculate base amplitude with audio reactivity
        let amplitude = visualHeight * 0.25; // Reduced from 0.3 to 0.25 to ensure no cutoff
        if (this._analyserNode) {
          const audioIndex = Math.floor((i / this._points) * audioData.length);
          amplitude *= (1 + (audioData[audioIndex] / 256) * 0.5);
        }
        
        // Calculate y position with margin offset
        const y = (height/2) + 
                 Math.sin(phase + phaseOffset) * amplitude * 
                 (1 + Math.sin(time * 0.5) * 0.2);

        points.push({ x, y });

        // Draw glow with intensity based on audio
        const glowSize = this._analyserNode ? 6 + (audioData[i % audioData.length] / 256) * 4 : 6;
        this.ctx.beginPath();
        this.ctx.fillStyle = `${baseColor}33`;
        this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw node
        const nodeSize = this._analyserNode ? 2 + (audioData[i % audioData.length] / 256) * 2 : 2;
        this.ctx.beginPath();
        this.ctx.fillStyle = baseColor;
        this.ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw connecting lines
      this.ctx.beginPath();
      this.ctx.strokeStyle = baseColor;
      this.ctx.lineWidth = this._analyserNode ? 1 + audioScale : 1;
      
      points.forEach((point, i) => {
        if (i === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          const xc = (point.x + points[i - 1].x) / 2;
          const yc = (point.y + points[i - 1].y) / 2;
          this.ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
      });
      
      this.ctx.stroke();

      // Add cross-connections between strands
      if (strand > 0) {
        for (let i = 0; i < points.length; i += 2) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `${baseColor}33`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(points[i].x, points[i].y);
          
          // Calculate safe connection distance
          const maxConnection = visualHeight * 0.25;
          const distance = this._analyserNode ? 
            maxConnection * (1 + audioScale * 0.5) : 
            maxConnection;
            
          // Ensure we don't draw beyond safe boundaries
          const targetY = Math.min(height - margin, points[i].y + distance);
          this.ctx.lineTo(points[i].x, targetY);
          this.ctx.stroke();
        }
      }
    }
    
        // More aggressive particle generation
        const particleChance = this._analyserNode ? 0.3 + audioScale * 0.3 : 0.3;
        if (Math.random() < particleChance) {
          // Create multiple particles per frame
          for (let i = 0; i < 3; i++) {
            const speed = this._analyserNode ? 
              2 + audioScale * 3 : 
              2 + Math.random() * 3;
    
            this._particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              size: Math.random() * 3 + 2,
              speedX: (Math.random() - 0.5) * speed,
              speedY: (Math.random() - 0.5) * speed,
              life: 1
            });
          }
        }
    
        // Update particles
        this._particles = this._particles.filter(particle => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.life -= 0.015; // Slower decay
    
          if (particle.life > 0) {
            // Make particles more visible
            const alpha = Math.min(255, Math.floor(particle.life * 355));
            this.ctx.beginPath();
            this.ctx.fillStyle = `${baseColor}${alpha.toString(16).padStart(2, '0')}`;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            return true;
          }
          return false;
        });
    
        requestAnimationFrame(() => this.animate());
      }
  }
  
customElements.define('audio-visualizer', AudioVisualizer);
