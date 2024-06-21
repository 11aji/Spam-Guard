chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeEmail') {
      let emailContent = request.content;
      // Perform sentiment analysis and text classification
      let result = analyzeEmail(emailContent);
      sendResponse({ result: result });
    }
  });
  
  function analyzeEmail(content) {
    // Dummy implementation - replace with actual model or API call
    let spamWords = ['lottery', 'prize', 'winner', 'click here', 'free'];
    let spamScore = spamWords.reduce((acc, word) => acc + (content.includes(word) ? 1 : 0), 0);
    return spamScore > 2 ? 'Spam' : 'Not Spam';
  }
  