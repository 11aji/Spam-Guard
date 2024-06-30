function scrapeEmailDetails() {
  const emails = document.querySelectorAll('.zA');
  let emailDetails = [];

  emails.forEach(email => {
    const senderElement = email.querySelector('.yX.xY .yP');
    const subjectElement = email.querySelector('.bog');
    const snippetElement = email.querySelector('.y2');

    if (senderElement && subjectElement && snippetElement) {
      const sender = senderElement.innerText;
      const subject = subjectElement.innerText;
      const snippet = snippetElement.innerText;

      emailDetails.push({ sender, subject, snippet });
    }
  });

  console.log('Scraped Emails:', emailDetails);
  return emailDetails;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrapeEmails') {
    const scrapedData = scrapeEmailDetails();
    sendResponse({ emails: scrapedData });
  }
});
