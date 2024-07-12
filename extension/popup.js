document.getElementById('scrapeButton').addEventListener('click', () => {

  document.getElementById('mainPanel').style.display = 'none';
  document.getElementById('loaderPanel').style.display = 'flex';

  console.log('Button clicked, sending message to background script');


  chrome.runtime.sendMessage({ action: 'startScraping' });


  setTimeout(function() {

    document.getElementById('loaderPanel').style.display = 'none';
    document.getElementById('resultPanel').style.display = 'block';
  }, 3000); // 3 seconds delay
});

document.getElementById('backButton').addEventListener('click', function() {

  document.getElementById('resultPanel').style.display = 'none';
  document.getElementById('mainPanel').style.display = 'block';
});
