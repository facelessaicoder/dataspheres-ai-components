import { getConfig } from './config.js';

export function applyTheme() {
  const windowBg = getComputedStyle(document.documentElement).getPropertyValue('--window-bg');
  const headerBg = getComputedStyle(document.documentElement).getPropertyValue('--header-bg');
  const headerColor = getComputedStyle(document.documentElement).getPropertyValue('--header-color');

  // Debugging
  const currentTheme = document.getElementById('theme-link');
  console.log('current-theme:', currentTheme.href);
  console.log('window-bg:', windowBg);
  console.log('header-bg:', headerBg);
  console.log('header-color:', headerColor);
}

export function toggleTheme() {
  const currentTheme = document.getElementById('theme-link');
  const newThemeHref = currentTheme.href.includes('light.css') ? 'themes/dark.css' : 'themes/light.css';
  currentTheme.href = newThemeHref;

  currentTheme.addEventListener('load', () => {
    setTimeout(applyTheme, 100); // Adding a delay to ensure CSS is fully loaded
  });
}

export function initializeTheme() {
  document.addEventListener('toggle-theme', toggleTheme);

  // Initial theme application
  setTimeout(applyTheme, 100); // Adding a delay to ensure CSS is fully loaded
}
