chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkEmail') {
      let emailContent = document.body.innerText; // Extract email content
      chrome.runtime.sendMessage({ action: 'analyzeEmail', content: emailContent }, (response) => {
        sendResponse({ result: response.result });
      });
      return true;
    }
  });
  