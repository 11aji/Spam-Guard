document.getElementById('checkEmail').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'checkEmail' }, (response) => {
        document.getElementById('result').innerText = response.result;
      });
    });
  });
  