class MatrixTable extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._name = '';
    this._description = '';
    this._headers = [];
    this._rows = [];
    this._actions = [];
    this._globalActions = [];
    this._globalActionCallbacks = {};
    this._headerColor = '#005f56';
    this._sortState = { column: null, direction: 'asc' };
    this._filters = {};
  }

  static get observedAttributes() {
    return ['name', 'description', 'headers', 'rows', 'actions', 'global-actions', 'on-column-action', 'on-global-action', 'header-color'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'name':
          this._name = newValue;
          break;
        case 'description':
          this._description = newValue;
          break;
        case 'headers':
        case 'rows':
        case 'actions':
          try {
            this[`_${name}`] = JSON.parse(newValue);
          } catch (e) {
            console.error(`Error parsing ${name}:`, e);
            this[`_${name}`] = [];
          }
          break;
        case 'global-actions':
          this.parseGlobalActions(newValue);
          break;
        case 'on-column-action':
        case 'on-global-action':
          this[name.replace('-', '')] = new Function('event', newValue);
          break;
        case 'header-color':
          this._headerColor = newValue;
          break;
      }
      this.render();
    }
  }

  parseGlobalActions(value) {
    try {
      const actions = JSON.parse(value);
      this._globalActions = actions.map(action => {
        if (typeof action === 'object' && action.id && action.label) {
          // Store the callback string without executing it
          if (action.callback) {
            this._globalActionCallbacks[action.id] = action.callback;
          }
          return { id: action.id, label: action.label };
        }
        return null;
      }).filter(action => action !== null);
    } catch (e) {
      console.error('Failed to parse global actions:', e);
      this._globalActions = [];
      this._globalActionCallbacks = {};
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const style = `
      <style>
        :host {
          --header-color: ${this._headerColor};
          --text-color: #ffffff;
          --hover-color: #004b43;
        }
        .matrix-container {
          font-family: Arial, sans-serif;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .matrix-header {
          padding: 16px;
          background-color: var(--header-color);
          color: var(--text-color);
        }
        .matrix-title {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .matrix-title:hover {
          background-color: var(--hover-color);
        }
        .matrix-name {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0 8px 0 0;
        }
        .matrix-description {
          font-size: 0.875rem;
          margin: 4px 0 0 0;
          opacity: 0.8;
        }
        .chevron {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
          stroke: var(--text-color);
        }
        .table-container {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background-color: var(--header-color);
          font-weight: bold;
          color: var(--text-color);
          cursor: pointer;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dropdown {
          position: relative;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: white;
          min-width: 160px;
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
          z-index: 1;
          border-radius: 4px;
          overflow: hidden;
        }
        .matrix-title .dropdown-content {
          top: 100%;
          left: 0;
          margin-top: 4px;
        }
        .header-content .dropdown-content {
          top: 100%;
          right: 0;
          margin-top: 4px;
        }
        .dropdown-content a {
          color: #333;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          transition: background-color 0.2s ease;
        }
        .dropdown-content a:hover {
          background-color: #f1f5f9;
        }
        .show {
          display: block;
        }
        .rotate {
          transform: rotate(180deg);
        }
        .filter-dropdown {
          position: absolute;
          background-color: white;
          border: 1px solid #ccc;
          padding: 10px;
          z-index: 1000;
          top: 100%;
          left: 0;
        }
        .filter-checkbox {
          margin-right: 5px;
        }
        .header-label {
          display: flex;
          align-items: center;
        }
        .sort-indicator {
          display: inline-flex;
          margin-left: 4px;
        }
        .sort-icon {
          width: 16px;
          height: 16px;
          stroke: currentColor;
        }
      </style>
    `;

    const globalActionsHtml = this._globalActions.length > 0
    ? this._globalActions.map(action => `
        <a href="#" data-action="${action.id}">${action.label}</a>
      `).join('')
    : '<a href="#" data-action="no-action">No actions available</a>';

  const headerHtml = this._headers.map((header, index) => `
    <th>
      <div class="header-content dropdown">
        <span class="header-label">
        ${header.label}
        ${this._sortState.column === index ? 
          `<span class="sort-indicator">
            ${this._sortState.direction === 'asc' ? 
              `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sort-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" />
              </svg>` : 
              `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sort-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
              </svg>`
            }
          </span>` : 
          ''
        }
      </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="chevron">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        <div class="dropdown-content" data-column="${index}">
          <a href="#" data-action="sort">Sort</a>
          <a href="#" data-action="filter">Filter</a>
          ${this._actions.map(action => `
            <a href="#" data-action="${action.id}">${action.label}</a>
          `).join('')}
        </div>
      </div>
    </th>
  `).join('');

    const filteredAndSortedRows = this.getFilteredAndSortedRows();

    const rowsHtml = filteredAndSortedRows.map(row => `
      <tr>
        ${row.map(cell => `<td>${this.formatCell(cell)}</td>`).join('')}
      </tr>
    `).join('');

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="matrix-container">
        <div class="matrix-header">
          <div class="matrix-title dropdown">
            <h2 class="matrix-name">${this._name}</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="chevron">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
            <div class="dropdown-content">
              ${globalActionsHtml}
            </div>
          </div>
          <p class="matrix-description">${this._description}</p>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>${headerHtml}</tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle dropdown toggles
    this.shadowRoot.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-content')) {
          e.stopPropagation();
          this.toggleDropdown(dropdown);
        }
      });
    });

    // Handle dropdown actions
    this.shadowRoot.querySelectorAll('.dropdown-content').forEach(content => {
      content.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          e.stopPropagation();
          const action = e.target.getAttribute('data-action');
          const column = parseInt(content.getAttribute('data-column'));

          if (!isNaN(column)) {
            if (action === 'sort') {
              this.handleSort(column);
            } else if (action === 'filter') {
              this.showFilterDropdown(column);
            } else {
              this.handleColumnAction(action, column);
            }
          } else {
            this.handleGlobalAction(action);
          }
          this.closeAllDropdowns();
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      this.closeAllDropdowns();
    });
  }

  toggleDropdown(dropdown) {
    this.closeAllDropdowns();
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const chevron = dropdown.querySelector('.chevron');
    dropdownContent.classList.toggle('show');
    chevron.classList.toggle('rotate');
  }

  closeAllDropdowns() {
    const dropdowns = this.shadowRoot.querySelectorAll('.dropdown-content, .filter-dropdown');
    const chevrons = this.shadowRoot.querySelectorAll('.chevron');
    dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
    chevrons.forEach(chevron => chevron.classList.remove('rotate'));
  }

  applyFilter(button) {
    const column = parseInt(button.dataset.column);
    const filterDropdown = button.closest('.filter-dropdown');
    const checkedValues = [...filterDropdown.querySelectorAll(':checked')].map(cb => cb.value);
    this._filters[column] = checkedValues.length > 0 ? checkedValues : null;
    this.render();
    this.dispatchEvent(new CustomEvent('filter', {
      bubbles: true,
      composed: true,
      detail: { column, filters: this._filters[column] }
    }));
  }

  handleSort(column) {
    if (this._sortState.column === column) {
      this._sortState.direction = this._sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortState = { column, direction: 'asc' };
    }
    this.render();
    this.dispatchEvent(new CustomEvent('sort', {
      bubbles: true,
      composed: true,
      detail: { column, direction: this._sortState.direction }
    }));
  }

  showFilterDropdown(column) {
    const existingDropdown = this.shadowRoot.querySelector('.filter-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }
  
    const uniqueValues = [...new Set(this._rows.map(row => row[column].value))];
    const filterDropdown = document.createElement('div');
    filterDropdown.className = 'filter-dropdown';
    
    const style = document.createElement('style');
    style.textContent = `
      .filter-dropdown {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 10px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        max-height: 200px;
        overflow-y: auto;
      }
      .filter-dropdown label {
        display: block;
        margin-bottom: 5px;
        color: #333;
      }
      .filter-dropdown input[type="checkbox"] {
        margin-right: 5px;
      }
      .filter-dropdown button {
        margin-top: 10px;
        padding: 5px 10px;
        background-color: ${this._headerColor};
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 3px;
      }
      .filter-dropdown button:hover {
        background-color: ${this.lightenColor(this._headerColor, 10)};
      }
    `;
    filterDropdown.appendChild(style);
  
    filterDropdown.innerHTML += uniqueValues.map(value => `
      <label>
        <input type="checkbox" class="filter-checkbox" value="${value}" ${!this._filters[column] || this._filters[column].includes(value) ? 'checked' : ''}>
        ${value}
      </label>
    `).join('');
  
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply';
    applyButton.addEventListener('click', () => {
      const checkedValues = [...filterDropdown.querySelectorAll(':checked')].map(cb => cb.value);
      this._filters[column] = checkedValues.length === uniqueValues.length ? null : checkedValues;
      this.render();
      this.dispatchEvent(new CustomEvent('filter', {
        bubbles: true,
        composed: true,
        detail: { column, filters: this._filters[column] }
      }));
    });
    filterDropdown.appendChild(applyButton);
  
    const headerContent = this.shadowRoot.querySelector(`th:nth-child(${column + 1}) .header-content`);
    headerContent.appendChild(filterDropdown);
  }

  // Helper method to lighten a color
lightenColor(color, percent) {
  const num = parseInt(color.replace("#",""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

  getFilteredAndSortedRows() {
    let result = this._rows;

    // Apply filters
    Object.entries(this._filters).forEach(([column, values]) => {
      if (values && values.length > 0) {
        result = result.filter(row => values.includes(row[column].value.toString()));
      }
    });

    // Apply sort
    if (this._sortState.column !== null) {
      const column = this._sortState.column;
      const direction = this._sortState.direction;
      result.sort((a, b) => {
        if (a[column].value < b[column].value) return direction === 'asc' ? -1 : 1;
        if (a[column].value > b[column].value) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  handleColumnAction(action, column) {
    const event = new CustomEvent('column-action', {
      bubbles: true,
      composed: true,
      detail: { action, column }
    });
    this.dispatchEvent(event);

    if (this.oncolumnaction) {
      this.oncolumnaction(event);
    }
  }

  handleGlobalAction(action) {
    const event = new CustomEvent('global-action', {
      bubbles: true,
      composed: true,
      detail: { action }
    });
    this.dispatchEvent(event);
  
    if (this._globalActionCallbacks[action]) {
      // Execute the callback string only when the action is triggered
      new Function(this._globalActionCallbacks[action])();
    } else {
      console.warn(`No callback found for global action: ${action}`);
    }
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
}

customElements.define('matrix-table', MatrixTable);
