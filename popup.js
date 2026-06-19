const content = document.getElementById('content');

function isTarget(url) {
  try {
    const h = new URL(url).hostname;
    return h === 'medium.com' || h.endsWith('.medium.com') || h === 'freedium-mirror.cfd';
  } catch { return false; }
}

function isMedium(url) {
  try {
    const h = new URL(url).hostname;
    return h === 'medium.com' || h.endsWith('.medium.com');
  } catch { return false; }
}

function renderUI(url, data) {
  const onMedium    = isMedium(url);
  const onFreedium  = url.includes('freedium-mirror.cfd');
  const active      = !!data.mfActive;

  content.innerHTML = `
    <div class="section">
      <div class="row">
        <span class="toggle-label">راست‌چین فارسی</span>
        <button class="toggle ${active ? 'on' : ''}" id="tgl-main"></button>
      </div>
    </div>

    <div class="section">
      <div class="label">فعال روی</div>
      <div class="sites">
        <span class="site-badge ${onMedium   ? 'active' : ''}">medium.com</span>
        <span class="site-badge ${onFreedium ? 'active' : ''}">freedium</span>
      </div>
    </div>

    ${onMedium ? `
    <div class="section">
      <button class="btn-action" id="btn-freedium">
        <span class="icon">🔓</span>
        <span>باز در Freedium</span>
      </button>
    </div>
    ` : ''}
  `;

  // toggle
  document.getElementById('tgl-main').addEventListener('click', function() {
    this.classList.toggle('on');
    const nowActive = this.classList.contains('on');
    chrome.storage.local.set({ mfActive: nowActive });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (on) => {
            // toggle style مستقیم
            const STYLE_ID = 'mf-style';
            if (on) {
              window.__mediumFarsi && (window.__mediumFarsi.state.active = true);
              // trigger click on bar toggle if exists
              const btn = document.getElementById('mf-toggle');
              if (btn) {
                const isOff = btn.classList.contains('off');
                if (isOff) btn.click();
              }
            } else {
              window.__mediumFarsi && (window.__mediumFarsi.state.active = false);
              const btn = document.getElementById('mf-toggle');
              if (btn) {
                const isOn = !btn.classList.contains('off');
                if (isOn) btn.click();
              }
            }
          },
          args: [nowActive]
        });
      }
    });
  });

  // Freedium button
  document.getElementById('btn-freedium')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      const path = new URL(tabs[0].url).pathname + new URL(tabs[0].url).search;
      chrome.tabs.create({ url: `https://freedium-mirror.cfd${path}` });
    });
    window.close();
  });
}

function renderNotTarget() {
  content.innerHTML = `
    <div class="not-medium">
      فقط روی<br>
      <strong>medium.com</strong> و <strong>freedium</strong><br>
      کار می‌کند
    </div>
  `;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || '';
  if (!isTarget(url)) { renderNotTarget(); return; }
  chrome.storage.local.get(['mfActive', 'mfFont', 'mfSize'], (data) => {
    renderUI(url, data);
  });
});
