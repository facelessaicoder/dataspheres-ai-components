class MultipleChoiceQuestion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const question = this.getAttribute('question') || 'Select an option';
    let options = [];
    try {
      const optionsAttr = this.getAttribute('options');
      options = optionsAttr ? JSON.parse(optionsAttr) : [];
      if (!Array.isArray(options)) {
        throw new Error('options attribute must be a JSON array');
      }
    } catch (error) {
      console.error('Error parsing options:', error);
      // Optionally, set default options or show an error message
    }

    this.shadowRoot.innerHTML = `
      <style>
        .option { margin-bottom: 0.5rem; }
        input { margin-right: 0.5rem; }
      </style>
      <fieldset>
        <legend>${question}</legend>
        ${options.map((option, index) => `
          <div class="option">
            <input type="radio" id="option-${index}" name="question" value="${option}">
            <label for="option-${index}">${option}</label>
          </div>
        `).join('')}
      </fieldset>
    `;
  }
}

customElements.define('multiple-choice-question', MultipleChoiceQuestion);