chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeEmail') {
      let emailContent = request.content;
      analyzeEmail(emailContent).then(result => sendResponse({ result: result }));
      return true;  // Keeps the message channel open until `sendResponse` is called
  }
});

function analyzeEmail(content) {
  return fetch('http://localhost:8080/analyze_email', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: content })
  })
  .then(response => response.json())
  .then(data => data.result)
  .catch(error => console.error('Error:', error));
}
