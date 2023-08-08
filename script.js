// script.js

function typeNextChar(element, textArray, index = 0, charIndex = 0, delay = 30, lineDelay = 900) {
  if (index < textArray.length) {
    const currentText = textArray[index];
    if (charIndex < currentText.length) {
      element.textContent += currentText[charIndex];
      charIndex++;
      setTimeout(() => typeNextChar(element, textArray, index, charIndex, delay, lineDelay), delay);
    } else {
      element.innerHTML += "\n";
      index++;
      charIndex = 0;
      setTimeout(() => typeNextChar(element, textArray, index, charIndex, delay, lineDelay), lineDelay);
    }
  }
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  darkModeToggle.classList.toggle('dark');

  // Store the dark mode preference in localStorage
  const isDarkModeEnabled = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkModeEnabled);
}

// Apply dark mode preference on page load
document.addEventListener('DOMContentLoaded', () => {
  const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
  if (isDarkModeEnabled) {
    document.body.classList.add('dark-mode');
    document.querySelector('.dark-mode-toggle').classList.add('dark');
  }

  // Function to detect and toggle dark mode based on OS preference
function toggleDarkModeBasedOnOS() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
  ;
  if (prefersDarkMode !== isDarkModeEnabled) {
    toggleDarkMode();
  }
}

  // Listen for changes in OS preference for dark mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleDarkModeBasedOnOS);

  // Initial call to check and toggle dark mode based on OS preference
  toggleDarkModeBasedOnOS()

  document.body.classList.add('disable-fill-transition');
  setTimeout(() => {
    document.body.classList.remove('disable-fill-transition');
  }, 20) // Adjust the delay as needed

  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.classList.add('loaded');

  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const verticalNav = document.querySelector('.vertical-nav');
  const mainContent = document.querySelector('.main-content');
  
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    if (verticalNav.style.display === "none" || verticalNav.style.display === "") {
      verticalNav.style.display = "flex";
      // mainContent.style.display = "none";
    } else {
      verticalNav.style.display = "none";
      // mainContent.style.display = "block";
    }
  });
});
