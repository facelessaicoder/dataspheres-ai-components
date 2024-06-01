class VideoChat extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        video {
          width: 100%;
          height: auto;
          border: 1px solid var(--video-border);
        }
        button {
          margin-top: 10px;
          margin-right: 10px;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 5px;
        }
        button:hover {
          background-color: #0056b3;
        }
        #errorMessage {
          color: red;
          display: none;
        }
      </style>
      <video id="localVideo" autoplay muted></video>
      <video id="remoteVideo" autoplay></video>
      <button id="startVideoButton">Start Video</button>
      <button id="stopVideoButton" style="display: none;">Stop Video</button>
      <div id="errorMessage">Camera access is blocked. Please enable it in your browser settings.</div>
    `;

    this.localVideo = this.shadowRoot.querySelector('#localVideo');
    this.remoteVideo = this.shadowRoot.querySelector('#remoteVideo');
    this.startVideoButton = this.shadowRoot.querySelector('#startVideoButton');
    this.stopVideoButton = this.shadowRoot.querySelector('#stopVideoButton');
    this.errorMessage = this.shadowRoot.querySelector('#errorMessage');
    this.localStream = null;

    this.startVideoButton.addEventListener('click', () => this.startVideoChat());
    this.stopVideoButton.addEventListener('click', () => this.stopVideoChat());
  }

  async startVideoChat() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.srcObject = this.localStream;
      this.startVideoButton.style.display = 'none';
      this.stopVideoButton.style.display = 'inline-block';

      // For simplicity, this example does not include signaling or peer connection setup.
      // In a real application, you would use WebRTC APIs to connect to a remote peer.
    } catch (error) {
      console.error('Error accessing media devices.', error);
      this.showErrorMessage(error);
    }
  }

  stopVideoChat() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localVideo.srcObject = null;
      this.localStream = null;
      this.startVideoButton.style.display = 'inline-block';
      this.stopVideoButton.style.display = 'none';
    }
  }

  showErrorMessage(error) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      this.errorMessage.style.display = 'block';
      // Optionally, show a more detailed message or provide a link to browser settings
    } else {
      alert('Could not access your camera and microphone. Please grant permissions and try again.');
    }
  }
}

customElements.define('video-chat', VideoChat);
