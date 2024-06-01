// Importing components
import './components/chat-message.js';
import './components/message-input.js';
import './components/chat-window.js';
import './components/chat-topbar.js';
import './components/video-chat.js';
import './components/document-sharing.js';
import './components/grid-layout.js';
import './components/flex-layout.js';
import './components/left-sidebar.js';
import './components/right-sidebar.js';
import './components/horizontal-navbar.js';

// Importing configuration, theme, and navigation handling functions
import { initializeConfig } from './config.js';
import { initializeTheme } from './theme.js';
import { setupNavigation } from './navigation-router.js';

export function initializeLibrary(config) {
  initializeConfig(config);
  initializeTheme();
  setupNavigation();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeLibrary({
    defaultTheme: 'light',
  });
});
