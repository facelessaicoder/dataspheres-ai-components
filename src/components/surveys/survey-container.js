class SurveyContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentQuestionIndex = 0;
    this.isMenuOpen = false;
    this._questions = [];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  set questions(value) {
    this._questions = value;
    this.render();
  }

  get questions() {
    return this._questions;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100vh; overflow: hidden; }
        .container { height: 100vh; overflow-y: auto; scroll-snap-type: y mandatory; }
        .question { 
          height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          scroll-snap-align: start;
          position: relative;
          overflow: hidden;
        }
        .question-content { 
          max-width: 64rem; 
          width: 100%; 
          padding: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .question.active .question-content {
          opacity: 1;
          transform: translateY(0);
        }
        .title { 
          font-size: 3rem; 
          font-weight: bold; 
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .description { 
          font-size: 1.5rem; 
          margin-bottom: 2rem;
          line-height: 1.5;
        }
        .nav-button { 
          position: fixed; 
          left: 50%; 
          transform: translateX(-50%); 
          background: rgba(255, 255, 255, 0.1);
          border: none; 
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .nav-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .nav-button.hidden {
          opacity: 0;
          pointer-events: none;
        }
        .nav-button-up {
          top: 2rem;
        }
        .nav-button-down {
          bottom: 2rem;
        }
        .nav-button svg {
          width: 40px;
          height: 40px;
          stroke: white;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }
        .menu-button { 
          position: fixed; 
          top: 1.5rem; 
          right: 1.5rem; 
          background-color: white; 
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          z-index: 10;
          color: #1a1a1a;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        .menu-button:hover {
          background-color: #f9fafb;
          transform: translateY(-1px);
        }
        .menu { 
          position: fixed; 
          top: 0;
          right: 0;
          height: 100vh;
          width: 300px;
          background-color: white; 
          box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1); 
          padding: 2rem;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 9;
        }
        .menu.open {
          transform: translateX(0);
        }
        .menu h3 { 
          font-size: 1.25rem; 
          font-weight: 600; 
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          color: #005f56;
        }
        .menu ul { 
          list-style-type: none; 
          padding: 0;
          margin: 0;
        }
        .menu li { 
          cursor: pointer; 
          padding: 0.75rem 1rem;
          margin: 0.25rem 0;
          border-radius: 6px;
          color: #374151;
          font-size: 0.9375rem;
          transition: all 0.2s ease;
        }
        .menu li:hover {
          background-color: #f3f4f6;
          color: #005f56;
        }
        .menu li.active { 
          background-color: #f0f9f8;
          color: #005f56;
          font-weight: 500;
        }
        .background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.1;
          z-index: -1;
        }
      </style>
      <div class="container">
        ${this._questions.map((question, index) => `
          <div class="question" data-index="${index}">
            <div class="background" style="background-image: url(${question.backgroundImage || ''})"></div>
            <div class="question-content">
              <h2 class="title">${question.title || 'Untitled Question'}</h2>
              <p class="description">${question.description || ''}</p>
              <${question.component || 'p'} ${this.generateAttributes(question.attributes)}></${question.component || 'p'}>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="nav-button nav-button-up hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
      </button>
      <button class="nav-button nav-button-down">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <button class="menu-button">☰</button>
      <div class="menu">
        <h3>Survey Sections</h3>
        <ul>
          ${this._questions.map((question, index) => `
            <li data-index="${index}">${question.title}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  generateAttributes(attributes = {}) {
    return Object.entries(attributes)
      .map(([key, value]) => {
        let attributeValue = value;
        if (value === null || value === undefined) {
          attributeValue = '';
        } else if (typeof value === 'object') {
          attributeValue = JSON.stringify(value);
        } else {
          attributeValue = String(value);
        }
        return `${key}="${attributeValue.replace(/"/g, '&quot;')}"`;
      })
      .join(' ');
  }
  
  setupEventListeners() {
    const container = this.shadowRoot.querySelector('.container');
    const navButtonUp = this.shadowRoot.querySelector('.nav-button-up');
    const navButtonDown = this.shadowRoot.querySelector('.nav-button-down');
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    const menu = this.shadowRoot.querySelector('.menu');

    container.addEventListener('scroll', () => {
      const newIndex = Math.round(container.scrollTop / container.clientHeight);
      if (newIndex !== this.currentQuestionIndex) {
        this.currentQuestionIndex = newIndex;
        this.updateActiveQuestion();
        this.updateActiveMenuItem();
        this.updateNavButtons();
      }
    });

    navButtonUp.addEventListener('click', () => {
      this.scrollToQuestion(this.currentQuestionIndex - 1);
    });

    navButtonDown.addEventListener('click', () => {
      this.scrollToQuestion(this.currentQuestionIndex + 1);
    });

    menuButton.addEventListener('click', () => {
      this.isMenuOpen = !this.isMenuOpen;
      menu.classList.toggle('open', this.isMenuOpen);
    });

    menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        const index = parseInt(e.target.dataset.index);
        this.scrollToQuestion(index);
      }
    });

    // Initial setup
    this.updateActiveQuestion();
    this.updateActiveMenuItem();
    this.updateNavButtons();
  }

  scrollToQuestion(index) {
    const questions = this.shadowRoot.querySelectorAll('.question');
    if (index >= 0 && index < questions.length) {
      questions[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateActiveQuestion() {
    const questions = this.shadowRoot.querySelectorAll('.question');
    questions.forEach((question, index) => {
      if (index === this.currentQuestionIndex) {
        question.classList.add('active');
      } else {
        question.classList.remove('active');
      }
    });
  }

  updateActiveMenuItem() {
    const menuItems = this.shadowRoot.querySelectorAll('.menu li');
    menuItems.forEach((item, index) => {
      if (index === this.currentQuestionIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  updateNavButtons() {
    const navButtonUp = this.shadowRoot.querySelector('.nav-button-up');
    const navButtonDown = this.shadowRoot.querySelector('.nav-button-down');
    
    navButtonUp.classList.toggle('hidden', this.currentQuestionIndex === 0);
    navButtonDown.classList.toggle('hidden', this.currentQuestionIndex === this._questions.length - 1);
  }
}

customElements.define('survey-container', SurveyContainer);
