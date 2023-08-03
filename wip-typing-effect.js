function typeNextChar(element, text, index = 0, delay = 30) {
  if (index < text.length) {
    element.textContent += text[index];
    index++;
    setTimeout(() => typeNextChar(element, text, index, delay), delay);
  }
}

document.addEventListener('DOMContentLoaded', () => {
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