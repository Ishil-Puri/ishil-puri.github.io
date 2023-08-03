// script.js

function typeNextChar(element, text, index = 0, delay = 30) {
  if (index < text.length) {
    element.textContent += text[index];
    index++;
    setTimeout(() => typeNextChar(element, text, index, delay), delay);
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

  document.body.classList.add('disable-fill-transition');
  setTimeout(() => {
    document.body.classList.remove('disable-fill-transition');
  }, 20) // Adjust the delay as needed

  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.classList.add('loaded');

  // work in progress badge

  const wipBadge = document.getElementById("wip");

    wipBadge.addEventListener("click", function() {
      const originalText = wipBadge.textContent;
      wipBadge.textContent = "";
      typeNextChar(wipBadge, "work in progress", 0, 30);

      setTimeout(() => {
        wipBadge.textContent = originalText;
      }, 3000);
  });
});