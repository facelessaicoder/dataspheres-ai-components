class TextQuestion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeInput = 'text';
    this.isRecording = false;
    this.mediaRecorder = null;
    this.mediaChunks = [];
    this.recordingStartTime = 0;
    this.timerInterval = null;
  }

  static get observedAttributes() {
    return ['question', 'rows', 'enable-audio', 'enable-video', 'theme-color', 'text-color'];
  }

  getThemeColors() {
    return {
      primary: this.getAttribute('theme-color') || '#005f56',
      text: this.getAttribute('text-color') || '#ffffff',
      inputBg: '#ffffff',
      inputText: '#1a1a1a',
      border: 'rgba(255, 255, 255, 0.2)',
      tabInactive: 'rgba(255, 255, 255, 0.6)',
      tabActive: '#ffffff',
      tabHover: 'rgba(255, 255, 255, 0.1)',
      recordBtn: '#22c55e',
      stopBtn: '#ef4444',
      timerText: '#ffffff'
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {
    const colors = this.getThemeColors();
    const question = this.getAttribute('question') || 'Please answer the question';
    const rows = parseInt(this.getAttribute('rows')) || 1;
    const enableAudio = this.hasAttribute('enable-audio');
    const enableVideo = this.hasAttribute('enable-video');

    const inputTypes = ['text'];
    if (enableAudio) inputTypes.push('audio');
    if (enableVideo) inputTypes.push('video');

    if (inputTypes.length === 1) {
      this.activeInput = inputTypes[0];
    }

    this.shadowRoot.innerHTML = `
      <style>
        .question-container {
          font-family: system-ui, -apple-system, sans-serif;
          margin-bottom: 20px;
          color: ${colors.text};
        }
        label {
          display: block;
          margin-bottom: 10px;
          font-weight: 500;
        }
        textarea, input[type="text"] {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          border: 1px solid ${colors.border};
          border-radius: 8px;
          background-color: ${colors.inputBg};
          color: ${colors.inputText};
          font-size: 16px;
          transition: all 0.2s ease;
        }
        textarea:focus, input[type="text"]:focus {
          outline: none;
          border-color: ${colors.primary};
          box-shadow: 0 0 0 3px rgba(0, 95, 86, 0.1);
        }
        .input-type-tabs {
          display: flex;
          border-bottom: 2px solid ${colors.border};
          margin-bottom: 15px;
          padding: 0 4px;
        }
        .tab {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          cursor: pointer;
          border: none;
          background: none;
          color: ${colors.tabInactive};
          font-size: 16px;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }
        .tab.active {
          color: ${colors.tabActive};
          border-bottom: 2px solid ${colors.tabActive};
        }
        .tab:hover {
          background-color: ${colors.tabHover};
        }
        .tab svg {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        .media-controls {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .control-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border: none;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .control-btn svg {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        .record-btn {
          background-color: ${colors.recordBtn};
          color: white;
        }
        .stop-btn {
          background-color: ${colors.stopBtn};
          color: white;
        }
        .control-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .timer {
          font-family: ui-monospace, monospace;
          font-size: 18px;
          margin-left: 15px;
          color: ${colors.timerText};
          font-weight: 500;
        }
        .media-preview {
          position: relative;
          margin-top: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .media-preview audio,
        .media-preview video {
          max-width: 70%;
          border-radius: 8px;
          background: ${colors.tabHover};
        }
        .delete-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: ${colors.stopBtn};
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .delete-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .delete-btn svg {
          width: 18px;
          height: 18px;
          margin-right: 6px;
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .input-content {
          padding-top: 15px;
        }
      </style>
      <div class="question-container">
        <label>${question}</label>
        ${inputTypes.length > 1 ? `
          <div class="input-type-tabs">
            ${inputTypes.map(type => this.renderTab(type)).join('')}
          </div>
        ` : ''}
        <div class="input-content">
          <div id="textInput" ${this.activeInput !== 'text' ? 'style="display:none;"' : ''}>
            ${rows > 1 
              ? `<textarea rows="${rows}"></textarea>` 
              : `<input type="text">`
            }
          </div>
          ${enableAudio ? this.renderMediaInput('audio') : ''}
          ${enableVideo ? this.renderMediaInput('video') : ''}
        </div>
      </div>
    `;
  }

  renderTab(type) {
    const labels = { text: 'Text', audio: 'Audio', video: 'Video' };
    const icons = {
      text: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>`,
      audio: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>`,
      video: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>`
    };

    return `
      <button id="${type}Tab" class="tab ${this.activeInput === type ? 'active' : ''}">
        ${icons[type]}
        ${labels[type]}
      </button>
    `;
  }

  renderMediaInput(mediaType) {
    const capitalizedMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
    return `
      <div id="${mediaType}Input" ${this.activeInput !== mediaType ? 'style="display:none;"' : ''}>
        <div class="media-controls">
          <button id="start${capitalizedMediaType}Btn" class="control-btn record-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <circle cx="12" cy="12" r="6" />
            </svg>
            Record ${capitalizedMediaType}
          </button>
          <button id="stop${capitalizedMediaType}Btn" class="control-btn stop-btn" style="display:none;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
            </svg>
            Stop Recording
          </button>
          <span id="${mediaType}Timer" class="timer">00:00</span>
        </div>
        <div class="media-preview" id="${mediaType}Preview"></div>
      </div>
    `;
  }

  setupEventListeners() {
    const inputTypes = ['text', 'audio', 'video'];
    inputTypes.forEach(type => {
      const tab = this.shadowRoot.getElementById(`${type}Tab`);
      if (tab) {
        tab.addEventListener('click', () => this.setActiveInput(type));
      }
    });

    if (this.hasAttribute('enable-audio')) {
      this.setupMediaRecording('audio');
    }
    if (this.hasAttribute('enable-video')) {
      this.setupMediaRecording('video');
    }
  }

  setActiveInput(inputType) {
    this.activeInput = inputType;
    ['text', 'audio', 'video'].forEach(type => {
      const inputElement = this.shadowRoot.getElementById(`${type}Input`);
      const tabElement = this.shadowRoot.getElementById(`${type}Tab`);
      if (inputElement) {
        inputElement.style.display = type === inputType ? 'block' : 'none';
      }
      if (tabElement) {
        tabElement.classList.toggle('active', type === inputType);
      }
    });
  }

  setupMediaRecording(mediaType) {
    const startBtn = this.shadowRoot.getElementById(`start${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}Btn`);
    const stopBtn = this.shadowRoot.getElementById(`stop${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}Btn`);
    
    if (!startBtn || !stopBtn) return;

    startBtn.addEventListener('click', () => this.startRecording(mediaType));
    stopBtn.addEventListener('click', () => this.stopRecording(mediaType));
  }

  startRecording(mediaType) {
    const constraints = mediaType === 'audio' ? { audio: true } : { audio: true, video: true };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;
        this.mediaChunks = [];
        this.recordingStartTime = Date.now();

        const preview = this.shadowRoot.getElementById(`${mediaType}Preview`);
        if (mediaType === 'video') {
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.muted = true;
          videoElement.play();
          preview.innerHTML = '';
          preview.appendChild(videoElement);
        }

        this.startTimer(mediaType);

        this.mediaRecorder.addEventListener("dataavailable", event => {
          this.mediaChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener("stop", () => {
          this.isRecording = false;
          this.updateRecordingUI(mediaType, false);
          this.displayRecordedMedia(mediaType);
          this.stopTimer(mediaType);
        });

        this.updateRecordingUI(mediaType, true);
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
  }

  stopRecording(mediaType) {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  deleteRecording(mediaType) {
    this.mediaChunks = [];
    const preview = this.shadowRoot.getElementById(`${mediaType}Preview`);
    preview.innerHTML = '';
    this.updateRecordingUI(mediaType, false);
  }

  updateRecordingUI(mediaType, isRecording) {
    const capitalizedMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
    const startBtn = this.shadowRoot.getElementById(`start${capitalizedMediaType}Btn`);
    const stopBtn = this.shadowRoot.getElementById(`stop${capitalizedMediaType}Btn`);
    const timerElement = this.shadowRoot.getElementById(`${mediaType}Timer`);

    if (isRecording) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-flex';
      startBtn.classList.remove('pulse-animation');
      stopBtn.classList.add('pulse-animation');
      timerElement.style.display = 'inline-block';
    } else {
      startBtn.style.display = 'inline-flex';
      stopBtn.style.display = 'none';
      startBtn.classList.remove('pulse-animation');
      stopBtn.classList.remove('pulse-animation');
      timerElement.style.display = 'none';
    }
  }

  startTimer(mediaType) {
    const timerElement = this.shadowRoot.getElementById(`${mediaType}Timer`);
    this.timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - this.recordingStartTime;
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  stopTimer(mediaType) {
    clearInterval(this.timerInterval);
  }

  displayRecordedMedia(mediaType) {
    const preview = this.shadowRoot.getElementById(`${mediaType}Preview`);
    const blob = new Blob(this.mediaChunks, { type: mediaType === 'audio' ? 'audio/webm' : 'video/webm' });
    const url = URL.createObjectURL(blob);

    preview.innerHTML = `
      <${mediaType} controls src="${url}"></${mediaType}>
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Delete ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
      </button>
    `;

    const deleteBtn = preview.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => this.deleteRecording(mediaType));
  }

  // Helper method to get the current value of the question
  getValue() {
    switch (this.activeInput) {
      case 'text':
        const textInput = this.shadowRoot.querySelector('textarea, input[type="text"]');
        return textInput ? textInput.value : '';
      case 'audio':
      case 'video':
        return new Blob(this.mediaChunks, { type: this.activeInput === 'audio' ? 'audio/webm' : 'video/webm' });
      default:
        return null;
    }
  }

  // Helper method to reset the question
  reset() {
    this.mediaChunks = [];
    this.activeInput = 'text';
    this.render();
  }
}

customElements.define('text-question', TextQuestion);
