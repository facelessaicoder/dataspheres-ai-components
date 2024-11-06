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
import './components/comparison-matrix.js';
import './components/matrix-table.js';
import './event-bus.js'
import './components/list-item.js';
import './components/flex-container.js';
import './components/base-card.js';
import './components/action-buttons.js';

// notification component imports
import './components/notifications/toast-notification.js';
import './components/notifications/toast-container.js';

// New survey component imports
import './components/surveys/survey-container.js';
import './components/surveys/text-question.js';
import './components/surveys/multiple-choice-question.js';

// Import and export web builder components
import './components/web_builder/layout/full-page-layout.js';
import './components/web_builder/layout/header/basic-header.js';
import './components/web_builder/content/contact/contact-us-section.js';
import './components/web_builder/content/hero/image-hero.js';
import './components/web_builder/content/services/services-grid.js';
import './components/web_builder/content/services/services-section.js';

// Import and export researchChat components
import './components/research/research_chat.js';
import './components/research/research-message.js';

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
