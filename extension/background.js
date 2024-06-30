chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startScraping') {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      console.log('Sending scrapeEmails message to tab:', activeTab.id);

      // Send message to content script in the active tab to start scraping
      chrome.tabs.sendMessage(activeTab.id, { action: 'scrapeEmails' }, (response) => {
        console.log('Response from content script:', response);
        if (response && response.emails) {
          // Send the scraped emails to the server
          fetch('http://127.0.0.1:8080/save_email_data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(response.emails)
          })
          .then(res => res.json())
          .then(data => console.log('Success:', data))
          .catch(error => console.error('Error:', error));
        } else if (response.error) {
          console.error('Error in scraping:', response.error);
        }
      });
    });
  }
});
