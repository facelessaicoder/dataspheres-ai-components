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
import './components/hero-section.js';
import './components/features-section.js';
import './components/icon-element.js';
import './components/animated-text.js';
import './components/scroll-trigger.js';
import './components/scroll-animator.js';
import './components/story-container.js';
import './components/story-section.js';
import './components/scroll-animations.js';
import './components/particle-animation.js';

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
    defaultTheme: 'auto',
  });
});
