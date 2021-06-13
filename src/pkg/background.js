// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

  chrome.tabs.insertCSS(null, {file: "guides.css"});
  chrome.tabs.executeScript(null, {file: "guides.js"});

});

