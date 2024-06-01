class ChatTopbar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          .topbar {
            position: fixed;
            top: 55px; /* Adjusted to allow space for another top horizontal bar */
            left: 250px; /* Adjust for the left sidebar width */
            right: 250px; /* Adjust for the right sidebar width */
            background-color: var(--topbar-bg, #fff);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            z-index: 1; /* Ensure the topbar is above other elements */
          }
  
          .left-group, .right-group {
            display: flex;
            align-items: center;
          }
  
          .dropdown {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
  
          .dropdown select {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: var(--input-bg, #eee);
            max-width: 100%;
          }
  
          .avatar-group {
            display: flex;
            align-items: center;
            margin-left: 15px;
          }
  
          .avatar {
            display: flex;
            align-items: center;
            position: relative;
          }
  
          .avatar .initials {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: -7px; /* Adjust to overlap like fish scales */
            background-color: var(--avatar-bg, #ccc);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9em;
            color: #fff;
          }
  
          .add-user {
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            background-color: var(--add-user-bg, #007bff);
            color: #fff;
            font-size: 1.2em;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 5px;
          }
  
          .action-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            margin-left: 15px;
          }
  
          .action-button svg {
            width: 24px;
            height: 24px;
          }

          .add-member-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            margin-left: 5px;
          }

          .add-member-button svg {
            width: 32px;
            height: 32px;
            margin-top: 3px;
          }
  
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .topbar {
              left: 10px; /* Adjust for minimal margins */
              right: 10px; /* Adjust for minimal margins */
            }
          }
        </style>
        <div class="topbar">
          <div class="left-group">
            <div class="dropdown">
              <select>
                <option value="ai1">AI with a very long name 1</option>
                <option value="ai2">AI 2</option>
                <option value="ai3">AI 3</option>
              </select>
            </div>
            <button class="action-button" title="Record audio">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>      
            </button>
            <button class="action-button" title="Record video">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>      
            </button>
            <div class="avatar-group">
              <div class="avatar">
                <div class="initials">JD</div>
              </div>
              <div class="avatar">
                <div class="initials">AB</div>
              </div>
              <div class="avatar">
                <div class="initials">CK</div>
              </div>
              <button class="add-member-button" title="Add Member">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>                              
              </button>
            </div>
          </div>
          <div class="right-group">
            
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('chat-topbar', ChatTopbar);
  