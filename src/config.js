let config = {
    defaultTheme: 'light',
  };
  
  export function initializeConfig(userConfig) {
    config = { ...config, ...userConfig };
    
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = `themes/${config.defaultTheme}.css`;
    themeLink.id = 'theme-link';
    document.head.appendChild(themeLink);
  }
  
  export function getConfig() {
    return config;
  }
  