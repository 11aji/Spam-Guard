document.getElementById('scrapeButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startScraping' });
  });
  