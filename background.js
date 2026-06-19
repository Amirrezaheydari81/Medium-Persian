chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "mf-toggle",
      title: "↔ راست‌چین فارسی",
      contexts: ["page"],
      documentUrlPatterns: [
        "https://medium.com/*",
        "https://*.medium.com/*",
        "https://freedium-mirror.cfd/*"
      ]
    });
    chrome.contextMenus.create({
      id: "mf-freedium",
      title: "🔓 باز در Freedium",
      contexts: ["page"],
      documentUrlPatterns: ["https://medium.com/*", "https://*.medium.com/*"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'mf-toggle') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const s = window.__mediumFarsi?.state;
        if (s) document.getElementById('mf-toggle')?.click();
      }
    });
  } else if (info.menuItemId === 'mf-freedium') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const path = window.location.pathname + window.location.search;
        chrome.runtime.sendMessage({ action: 'openTab', url: `https://freedium-mirror.cfd${path}` });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'openTab') chrome.tabs.create({ url: msg.url });
});
