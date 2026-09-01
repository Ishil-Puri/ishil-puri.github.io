document.addEventListener('DOMContentLoaded', () => {

  const typingText = [
    "curious, pastry loving, cycling enthusiast — computer science + public policy @ uc berkeley.",
    "so many interesting topics to learn.",
    "always looking for a good problem to solve."
  ];
  
  const typingElement = document.getElementById("typing-effect");
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingElement.textContent = typingText.join('\n');
  } else {
    typeNextChar(typingElement, typingText, 0, 0, 30, 900);
  }
});
