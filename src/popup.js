// Find the toggle button
const toggleButton = document.getElementById('toggleButton');

// Add a click listener to the toggle button
toggleButton.addEventListener('click', function() {
  // Send a message to the content script to toggle the extension
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, 'toggleExtension');
  });
});