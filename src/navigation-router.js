export function navigateTo(page) {
    const event = new CustomEvent('navigate', { detail: { page } });
    document.dispatchEvent(event);
  }
  
  export function setupNavigation() {
    document.querySelectorAll('[data-nav]').forEach(navElement => {
      navElement.addEventListener('click', (e) => {
        const page = e.target.getAttribute('data-nav');
        navigateTo(page);
      });
    });
  
    document.addEventListener('navigate', (e) => {
      const { page } = e.detail;
      document.querySelectorAll('.page').forEach(pageElement => {
        pageElement.style.display = 'none';
      });
      document.getElementById(page).style.display = 'block';
    });
  }
  