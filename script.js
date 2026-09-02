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

  if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
    document.querySelectorAll('.delight-cloud').forEach((link) => {
      link.addEventListener('pointermove', (event) => {
        const bounds = link.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        link.style.setProperty('--cloud-x', `${x * 7}px`);
        link.style.setProperty('--cloud-y', `${y * 5}px`);
        link.style.setProperty('--cloud-tilt', `${x * 4}deg`);
      });

      link.addEventListener('pointerleave', () => {
        link.style.removeProperty('--cloud-x');
        link.style.removeProperty('--cloud-y');
        link.style.removeProperty('--cloud-tilt');
      });
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
