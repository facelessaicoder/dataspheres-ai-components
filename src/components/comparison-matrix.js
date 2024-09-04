// comparison-matrix.js
class ComparisonMatrix extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._xAxis = [];
      this._yAxis = [];
      this._matrix = [];
      this._sortState = { index: -1, direction: 'asc', axis: null };
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
      const getSortIcon = (index, axis) => {
        if (this._sortState.index === index && this._sortState.axis === axis) {
          return this._sortState.direction === 'asc' ? '↑' : '↓';
        }
        return '↕';
      };
  
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
          .sort-icon {
            margin-left: 4px;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
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
                      <span class="sort-icon">${getSortIcon(index, 'x')}</span>
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
                      <span class="sort-icon">${getSortIcon(yIndex, 'y')}</span>
                    </span>
                  </th>
                  ${(this._matrix[yIndex] || []).map((cell) => `
                    <td class="${cell.type === 'currency' || cell.type === 'number' ? 'text-right' : cell.type === 'rating' ? 'text-center' : ''}">${this.formatCell(cell)}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
  
      this.setupSorting();
    }
  
    formatCell(cell) {
      if (!cell) return 'N/A';
      switch (cell.type) {
        case 'currency':
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cell.value);
        case 'number':
          return new Intl.NumberFormat('en-US').format(cell.value);
        case 'rating':
          return '★'.repeat(Math.floor(cell.value)) + '☆'.repeat(5 - Math.floor(cell.value));
        case 'text':
        default:
          return cell.value;
      }
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
      const compareFunction = (a, b, direction) => {
        const aValue = a?.value ?? null;
        const bValue = b?.value ?? null;
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return direction === 'asc' ? 1 : -1;
        if (bValue === null) return direction === 'asc' ? -1 : 1;
        if (a.type === 'text') return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      };
  
      // Toggle sort direction if clicking the same column/row
      if (this._sortState.index === index && this._sortState.axis === axis) {
        this._sortState.direction = this._sortState.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this._sortState = { index, axis, direction: 'asc' };
      }
  
      if (axis === 'x') {
        const sorted = this._matrix[0].map((_, colIndex) => 
          this._matrix.map(row => row[colIndex] || { type: 'text', value: 'N/A' })
        ).sort((a, b) => compareFunction(a[index], b[index], this._sortState.direction));
  
        this._matrix = sorted[0].map((_, rowIndex) => 
          sorted.map(col => col[rowIndex])
        );
  
        // Update x-axis order
        const sortedXAxis = this._xAxis.map((_, i) => ({ value: this._xAxis[i], index: i }))
          .sort((a, b) => compareFunction(this._matrix[index][a.index], this._matrix[index][b.index], this._sortState.direction));
        this._xAxis = sortedXAxis.map(item => item.value);
      } else {
        const sortedIndices = this._matrix.map((_, i) => i)
          .sort((a, b) => compareFunction(this._matrix[a][index], this._matrix[b][index], this._sortState.direction));
  
        this._yAxis = sortedIndices.map(i => this._yAxis[i]);
        this._matrix = sortedIndices.map(i => this._matrix[i] || []);
      }
  
      this.setAttribute('x-axis', JSON.stringify(this._xAxis));
      this.setAttribute('y-axis', JSON.stringify(this._yAxis));
      this.setAttribute('matrix-data', JSON.stringify(this._matrix));
      this.render();
    }
  }
  
  customElements.define('comparison-matrix', ComparisonMatrix);
