document.getElementById('scrapeButton').addEventListener('click', () => {
    console.log('Button clicked, sending message to background script');
    chrome.runtime.sendMessage({ action: 'startScraping' });
  });
  