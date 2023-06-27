chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostContains: 'bandcamp.com'
        },
      }),
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostContains: 'discogs.com'
        },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
