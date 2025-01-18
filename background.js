chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked, tab ID:", tab.id);
    console.log("Attempting to inject content script into tab ID:", tab.id);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Script injection failed:", chrome.runtime.lastError);
      } else {
        console.log("Content script injected successfully");
      }
    });
    console.log("Background script executed");
});
