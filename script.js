// script.js

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

  const typingText = [
    "curious, pastry loving, cycling enthusiast — computer science + public policy @ uc berkeley.",
    "\nso many interesting topics to learn.",
    "\nalways looking for a good problem to solve."
  ];

  let typingIndex = 0;
  let typingCharIndex = 0;
  let typingTimeout;

  function typeNextChar() {
    const typingElement = document.getElementById("typing-effect");
    if (typingIndex < typingText.length) {
      if (typingCharIndex < typingText[typingIndex].length) {
        typingElement.textContent += typingText[typingIndex][typingCharIndex];
        typingCharIndex++;
        typingTimeout = setTimeout(typeNextChar, 30);
      } else {
        typingElement.innerHTML += "<br>"; 
        typingIndex++;
        typingCharIndex = 0;
        typingTimeout = setTimeout(typeNextChar, 900);
      }
    }
  }

  typeNextChar();
});