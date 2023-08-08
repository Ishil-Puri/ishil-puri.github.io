document.addEventListener('DOMContentLoaded', () => {
  // work in progress badge
  let isAnimationInProgress = false;
  const wipBadge = document.getElementById("wip");
  wipBadge.addEventListener("click", function() {
  if (!isAnimationInProgress) {
    isAnimationInProgress = true;

    const originalText = wipBadge.textContent;
    wipBadge.textContent = "";
    
    const typingElement = wipBadge; // Using the badge element as the typing element
    const typingText = ["work in progress"];
    typeNextChar(typingElement, typingText, 0, 0, 30, 0); // No line break

    setTimeout(() => {
      wipBadge.textContent = originalText;
      isAnimationInProgress = false;
    }, 3000);
  }
}); 
});
