let selectedId = -1;
let url = ""
function refreshCounter() {
  chrome.tabs.query({lastFocusedWindow: true, active: true}, function (tabs) {
    url = tabs[0].url;
    url = url.replace(/\/$/, '');
    fetch(`https://api.notes.club/v1/notes/count?url=${url}`).then(r => r.text()).then(result => {
      let badge = ""
      if (result > 9) {
        badge = "+9"
      } else if (result > 0) {
        badge = `${result}`
      } else {
        // Remove the badge:
        badge = ""
      }
      chrome.browserAction.setBadgeText({ "text": badge, tabId: selectedId });
    })
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, props) {
  if (props.status == "loading" && tabId == selectedId)
    refreshCounter();
});

chrome.tabs.onSelectionChanged.addListener(function (tabId, props) {
  selectedId = tabId;
  refreshCounter();
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  selectedId = tabs[0].id;
  refreshCounter();
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({ 'url': `https://notes.club/notes/${parameterize(url, 100)}?content=${url}` })
});
