chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['guides.css'],
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['draggabilly.js', 'guides.js'],
  });
});