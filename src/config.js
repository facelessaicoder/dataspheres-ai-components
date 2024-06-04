let config = {
  defaultTheme: 'auto',
};

export function initializeConfig(userConfig) {
  config = { ...config, ...userConfig };
  
  applyThemeBasedOnConfig();
}

export function getConfig() {
  return config;
}

function applyTheme(theme) {
  let themeLink = document.getElementById('theme-link');
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'theme-link';
    document.head.appendChild(themeLink);
  }
  themeLink.href = `themes/${theme}.css`;
  localStorage.setItem('preferred-theme', theme);
}

function applyThemeBasedOnTime() {
  const now = new Date();
  const hours = now.getHours();
  const isNightTime = (hours >= 18 || hours < 6); // Consider night time as 6 PM to 6 AM

  if (isNightTime) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

export function applyThemeBasedOnConfig() {
  const preferredTheme = localStorage.getItem('preferred-theme');

  if (preferredTheme) {
    applyTheme(preferredTheme);
  } else if (config.defaultTheme === 'auto') {
    applyThemeBasedOnTime();
  } else {
    applyTheme(config.defaultTheme);
  }
}
