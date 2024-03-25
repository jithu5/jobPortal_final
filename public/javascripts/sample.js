
function showCustomPrompt(message) {
  const customPrompt = document.getElementById('customPrompt');
  const promptMessage = document.getElementById('promptMessage');
  const promptOK = document.getElementById('promptOK');

  promptMessage.textContent = message;
  customPrompt.style.display = 'block';

  promptOK.onclick = function() {
      customPrompt.style.display = 'none';
  };
}