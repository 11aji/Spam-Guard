async function classifyEmail(emailText) {
  try {
    const response = await fetch('http://127.0.0.1:5000/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email_text: emailText })
    });
    if (!response.ok) {
      console.error('Failed to classify email:', response.statusText);
      return 'none';
    }
    const result = await response.json();
    return result.spam_classification;
  } catch (error) {
    console.error('Error classifying email:', error);
    return 'none';
  }
}

function highlightEmail(emailElement, classification) {
  if (classification === 'high') {
    emailElement.style.backgroundColor = 'red';
  } else if (classification === 'medium') {
    emailElement.style.backgroundColor = 'yellow';
  } else {
    emailElement.style.backgroundColor = 'green';
  }
}

async function scrapeEmailDetails() {
  const emails = document.querySelectorAll('.zA'); // Select both read and unread emails
  let emailDetails = [];

  for (let email of emails) {
    let senderElement = email.querySelector('.yX.xY .yP') || email.querySelector('.yW .zF');
    const subjectElement = email.querySelector('.bog');
    const snippetElement = email.querySelector('.y2');

    if (senderElement && subjectElement && snippetElement) {
      const sender = senderElement.innerText;
      const subject = subjectElement.innerText;
      const snippet = snippetElement.innerText;

      const emailText = `${subject} ${snippet}`;
      const classification = await classifyEmail(emailText);
      highlightEmail(email, classification);

      emailDetails.push({ sender, subject, snippet, classification });
    } else {
      console.error('Missing elements in email:', email);
    }
  }

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
      scrapeEmailDetails().then(scrapedData => {
        sendResponse({ emails: scrapedData });
      }).catch(error => {
        console.error('Error in scraping emails:', error);
        sendResponse({ emails: [], error: error.message });
      });
    }).catch(error => {
      console.error('Error in loading emails:', error);
      sendResponse({ emails: [], error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});
