// comparison-matrix.js
class ComparisonMatrix extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._xAxis = [];
      this._yAxis = [];
      this._matrix = [];
    }
  
    connectedCallback() {
      this.render();
    }
  
    static get observedAttributes() {
      return ['x-axis', 'y-axis', 'matrix-data'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        switch (name) {
          case 'x-axis':
            this._xAxis = JSON.parse(newValue || '[]');
            break;
          case 'y-axis':
            this._yAxis = JSON.parse(newValue || '[]');
            break;
          case 'matrix-data':
            this._matrix = JSON.parse(newValue || '[]');
            break;
        }
        this.render();
      }
    }
  
    render() {
      const upDownSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>`;
  
      const leftRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>`;
  
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --primary-color: #3b82f6;
            --secondary-color: #e5e7eb;
            --text-color: #1f2937;
            --hover-color: #2563eb;
          }
          .matrix-container {
            overflow-x: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--secondary-color);
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
            color: var(--text-color);
          }
          .sort-btn {
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            color: var(--primary-color);
            transition: color 0.3s ease;
          }
          .sort-btn:hover {
            color: var(--hover-color);
          }
          .sort-btn svg {
            width: 18px;
            height: 18px;
            margin-left: 4px;
          }
        </style>
        <div class="matrix-container">
          <table>
            <thead>
              <tr>
                <th></th>
                ${this._xAxis.map((item, index) => `
                  <th>
                    <span class="sort-btn" data-index="${index}" data-axis="x">
                      ${item}
                      ${leftRightSvg}
                    </span>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${this._yAxis.map((item, yIndex) => `
                <tr>
                  <th>
                    <span class="sort-btn" data-index="${yIndex}" data-axis="y">
                      ${item}
                      ${upDownSvg}
                    </span>
                  </th>
                  ${this._matrix[yIndex].map((cell) => `
                    <td>${cell}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
  
      this.setupSorting();
    }
  
    setupSorting() {
      const sortButtons = this.shadowRoot.querySelectorAll('.sort-btn');
      sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          const axis = btn.dataset.axis;
          this.sortMatrix(index, axis);
        });
      });
    }
  
    sortMatrix(index, axis) {
      if (axis === 'x') {
        const sorted = this._matrix[0].map((_, colIndex) => 
          this._matrix.map(row => row[colIndex])
        ).sort((a, b) => a[index] - b[index]);
  
        this._matrix = sorted[0].map((_, rowIndex) => 
          sorted.map(col => col[rowIndex])
        );
      } else {
        const sortedIndices = this._matrix.map((_, i) => i)
          .sort((a, b) => this._matrix[a][index] - this._matrix[b][index]);
  
        this._yAxis = sortedIndices.map(i => this._yAxis[i]);
        this._matrix = sortedIndices.map(i => this._matrix[i]);
      }
  
      this.setAttribute('y-axis', JSON.stringify(this._yAxis));
      this.setAttribute('matrix-data', JSON.stringify(this._matrix));
      this.render();
    }
  }
  
  customElements.define('comparison-matrix', ComparisonMatrix);