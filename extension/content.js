function scrapeEmailDetails() {
  const emails = document.querySelectorAll('.zA'); // Select both read and unread emails
  let emailDetails = [];

  emails.forEach(email => {
    let senderElement = email.querySelector('.yX.xY .yP') || email.querySelector('.yW .zF');
    if (senderElement == email.querySelector('.yW .zF')) {
      email.style.background = 'red';
    }
    console.log(senderElement);
    const subjectElement = email.querySelector('.bog');
    const snippetElement = email.querySelector('.y2');

    if (senderElement && subjectElement && snippetElement) {
      const sender = senderElement.innerText;
      const subject = subjectElement.innerText;
      const snippet = snippetElement.innerText;

      emailDetails.push({ sender, subject, snippet });
    } else {
      console.error('Missing elements in email:', email);
    }
  });

  console.log('Scraped Emails:', emailDetails);
  return emailDetails;
}


function loadAllEmails() {
  return new Promise((resolve) => {
    let previousHeight = document.body.scrollHeight;
    const interval = setInterval(() => {
      window.scrollTo(0, document.body.scrollHeight);

      setTimeout(() => {
        const currentHeight = document.body.scrollHeight;
        if (currentHeight === previousHeight) {
          clearInterval(interval);
          console.log('Finished loading all emails.');
          resolve();
        } else {
          previousHeight = currentHeight;
        }
      }, 1500); // Increased timeout to allow more time for emails to load
    }, 2000); // Increased interval to allow more time for scroll actions
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapeEmails') {
    console.log('Received request to scrape emails.');
    loadAllEmails().then(() => {
      const scrapedData = scrapeEmailDetails();
      sendResponse({ emails: scrapedData });
    }).catch(error => {
      console.error('Error in scraping emails:', error);
      sendResponse({ emails: [], error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});

