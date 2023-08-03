document.addEventListener('DOMContentLoaded', () => {
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