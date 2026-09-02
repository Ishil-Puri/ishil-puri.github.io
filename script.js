const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

function readSetting(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The theme still works when storage is unavailable.
  }
}

const previousTheme = readSetting('darkMode');
const savedTheme = readSetting('colorTheme')
  || (previousTheme === null ? null : previousTheme === 'true' ? 'dark' : 'light');

if (!readSetting('colorTheme') && savedTheme) writeSetting('colorTheme', savedTheme);

function setDarkMode(enabled) {
  document.documentElement.classList.toggle('dark-mode', enabled);
  document.querySelectorAll('.dark-mode-toggle').forEach((button) => {
    button.classList.toggle('dark', enabled);
    button.setAttribute('aria-pressed', String(enabled));
  });
}

function toggleDarkMode() {
  const enabled = !document.documentElement.classList.contains('dark-mode');
  writeSetting('colorTheme', enabled ? 'dark' : 'light');
  setDarkMode(enabled);
}

function typeNextChar(element, textArray, index = 0, charIndex = 0, delay = 30, lineDelay = 900) {
  if (!element || index >= textArray.length) return;

  const currentText = textArray[index];
  if (charIndex < currentText.length) {
    element.textContent += currentText[charIndex];
    window.setTimeout(
      () => typeNextChar(element, textArray, index, charIndex + 1, delay, lineDelay),
      delay,
    );
    return;
  }

  element.textContent += '\n';
  window.setTimeout(() => typeNextChar(element, textArray, index + 1, 0, delay, lineDelay), lineDelay);
}

setDarkMode(savedTheme ? savedTheme === 'dark' : colorScheme.matches);

document.addEventListener('DOMContentLoaded', () => {
  setDarkMode(document.documentElement.classList.contains('dark-mode'));

  document.querySelectorAll('.dark-mode-toggle').forEach((button) => {
    button.addEventListener('click', toggleDarkMode);
  });

  const delightPortal = document.querySelector('.delight-portal');
  if (delightPortal && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const desktopSidebar = window.matchMedia('(min-width: 769px)');
    const hasSidebar = Boolean(document.querySelector('.vertical-nav'));

    window.addEventListener('pointermove', (event) => {
      const x = event.clientX - (hasSidebar && desktopSidebar.matches ? 240 : window.innerWidth / 2);
      const y = event.clientY - (hasSidebar && desktopSidebar.matches ? window.innerHeight / 2 : window.innerHeight - 12);
      const distance = Math.hypot(x, y);
      delightPortal.classList.toggle('is-near', distance < 170);

      if (distance < 240) {
        delightPortal.style.setProperty('--portal-drift-x', `${Math.max(-12, Math.min(12, x / 14))}px`);
        delightPortal.style.setProperty('--portal-drift-y', `${Math.max(-12, Math.min(12, y / 14))}px`);
      } else {
        delightPortal.style.removeProperty('--portal-drift-x');
        delightPortal.style.removeProperty('--portal-drift-y');
      }
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => {
      delightPortal.classList.remove('is-near');
      delightPortal.style.removeProperty('--portal-drift-x');
      delightPortal.style.removeProperty('--portal-drift-y');
    });
  }

  const menuButton = document.querySelector('.hamburger-menu');
  const navigation = document.querySelector('.vertical-nav');
  if (menuButton && navigation) {
    const setMenuOpen = (open) => {
      navigation.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };

    menuButton.addEventListener('click', () => {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;
      setMenuOpen(false);
      menuButton.focus();
    });
  }
});

colorScheme.addEventListener('change', (event) => {
  if (!readSetting('colorTheme')) setDarkMode(event.matches);
});
