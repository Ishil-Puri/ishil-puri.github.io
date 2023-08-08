document.addEventListener("DOMContentLoaded", function() {
  const emailButton = document.getElementById("emailButton");
  const copyNotification = document.getElementById("copyNotification");

  emailButton.addEventListener("click", function(event) {
    event.preventDefault();
    const emailAddress = "ishil@berkeley.edu";

    // Create a temporary input element to copy text to clipboard
    const tempInput = document.createElement("input");
    tempInput.value = emailAddress;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Show the copy notification
    copyNotification.style.opacity = "1";

    // Hide the notification after a delay
    setTimeout(() => {
      copyNotification.style.opacity = "0";
    }, 2000); // Adjust the delay as needed
  });
});
