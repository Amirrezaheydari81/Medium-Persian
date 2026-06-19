(() => {
  if (window.__mediumFarsi) return;

  const STYLE_ID = 'mf-style';
  const BAR_ID   = 'mf-bar';

  // ---- فونت‌ها ----
  const FONTS = [
    { label: 'وزیرمتن',   value: 'Vazirmatn' },
    { label: 'یکان',       value: 'Yekan Bakh' },
    { label: 'ایران‌سنس',  value: 'IRANSans' },
    { label: 'شبنم',       value: 'Shabnam' },
    { label: 'پرستو',      value: 'Parastoo' },
    { label: 'تهران',      value: 'Tehran' },
  ];

  // اندازه‌های متن
  const SIZES = [
    { label: 'کوچک',    value: '16px' },
    { label: 'معمولی',  value: '19px' },
    { label: 'بزرگ',    value: '22px' },
    { label: 'خیلی بزرگ', value: '26px' },
  ];

  // ---- وضعیت ----
  let state = {
    active: false,
    font: 'Vazirmatn',
    size: '19px',
  };

  // ---- CSS اصلی ----
  function buildCSS(font, size) {
    return `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap');

/* فونت‌های ایرانی */
@font-face { font-family:'Yekan Bakh'; src:url('https://cdn.jsdelivr.net/gh/rastikerdar/yekan-bakh-font@v7/dist/font-face.css'); }
@font-face { font-family:'Shabnam'; src:url('https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css'); }
@font-face { font-family:'Parastoo'; src:url('https://cdn.jsdelivr.net/gh/rastikerdar/parastoo-font@v4.0.0/dist/font-face.css'); }
@font-face { font-family:'IRANSans'; src:url('https://cdn.jsdelivr.net/gh/rastikerdar/iran-sans@v0.5.0/font-face.css'); }

/* راست‌چین */
article,
[data-testid="post-content"],
.pw-post-body-paragraph,
section[data-field="body"],
.section-content, .section-inner,
.content-wrap, .post-content,
[data-testid="storyTitle"],
.pw-post-title,
h1, h2, h3, h4, h5, h6,
p, li, blockquote, figcaption, td, th {
  direction: rtl !important;
  text-align: right !important;
  font-family: '${font}', Tahoma, Arial, sans-serif !important;
  font-size: ${size} !important;
  line-height: 2 !important;
  letter-spacing: 0 !important;
}

/* پیوند */
a { font-family: '${font}', Tahoma, sans-serif !important; }

/* عنوان بزرگ‌تر */
h1 { font-size: calc(${size} * 1.7) !important; font-weight: 700 !important; }
h2 { font-size: calc(${size} * 1.4) !important; font-weight: 600 !important; }
h3 { font-size: calc(${size} * 1.15) !important; }

/* کد رو دست نزن */
code, pre, kbd { direction: ltr !important; text-align: left !important; font-family: monospace !important; font-size: 14px !important; }
    `;
  }

  function applyStyle() {
    let el = document.getElementById(STYLE_ID);
    if (!el) { el = document.createElement('style'); el.id = STYLE_ID; document.head.appendChild(el); }
    el.textContent = buildCSS(state.font, state.size);
  }

  function removeStyle() {
    document.getElementById(STYLE_ID)?.remove();
  }

  // ---- نوار شناور ----
  function buildBar() {
    if (document.getElementById(BAR_ID)) return;

    const bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.innerHTML = `
      <div id="mf-bar-inner">
        <button id="mf-toggle" title="فعال/غیرفعال">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
          </svg>
        </button>

        <div id="mf-controls">
          <select id="mf-font-select" title="فونت">
            ${FONTS.map(f => `<option value="${f.value}" ${f.value===state.font?'selected':''}>${f.label}</option>`).join('')}
          </select>

          <div id="mf-size-btns">
            <button id="mf-sz-down" title="کوچک‌تر">A-</button>
            <button id="mf-sz-up"   title="بزرگ‌تر">A+</button>
          </div>

          <button id="mf-freedium" title="باز کردن در Freedium">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // استایل نوار
    bar.style.cssText = `
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      font-family: Tahoma, sans-serif;
      direction: rtl;
    `;

    const style = document.createElement('style');
    style.textContent = `
      #mf-bar-inner {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(15,15,15,0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 40px;
        padding: 6px 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
        transition: opacity 0.2s;
      }
      #mf-bar-inner:hover { opacity: 1 !important; }

      #mf-bar button, #mf-bar select {
        background: none;
        border: none;
        color: #aaa;
        cursor: pointer;
        font-family: Tahoma, sans-serif;
        font-size: 12px;
        padding: 4px 7px;
        border-radius: 20px;
        transition: background 0.15s, color 0.15s;
        outline: none;
        line-height: 1;
      }
      #mf-bar button:hover { background: rgba(255,255,255,0.1); color: #fff; }

      #mf-toggle {
        color: #fff !important;
        padding: 5px 8px !important;
      }
      #mf-toggle.off { color: #444 !important; }

      #mf-controls {
        display: flex;
        align-items: center;
        gap: 2px;
        transition: opacity 0.2s, max-width 0.25s;
        overflow: hidden;
        max-width: 300px;
      }
      #mf-controls.hidden { max-width: 0; opacity: 0; pointer-events: none; }

      #mf-font-select {
        appearance: none;
        -webkit-appearance: none;
        background: rgba(255,255,255,0.06) !important;
        color: #ccc !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
        cursor: pointer;
        font-size: 11.5px !important;
        direction: rtl;
      }

      #mf-size-btns {
        display: flex;
        gap: 1px;
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
        padding: 1px;
      }
      #mf-size-btns button { padding: 3px 8px !important; font-weight: 600; }

      #mf-freedium {
        border-right: 1px solid rgba(255,255,255,0.08) !important;
        border-radius: 0 !important;
        padding-right: 10px !important;
        margin-right: 2px !important;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(bar);

    // ---- رویدادها ----
    const toggle    = bar.querySelector('#mf-toggle');
    const controls  = bar.querySelector('#mf-controls');
    const fontSel   = bar.querySelector('#mf-font-select');
    const szDown    = bar.querySelector('#mf-sz-down');
    const szUp      = bar.querySelector('#mf-sz-up');
    const freedium  = bar.querySelector('#mf-freedium');

    function syncToggle() {
      if (state.active) {
        toggle.classList.remove('off');
        controls.classList.remove('hidden');
        applyStyle();
      } else {
        toggle.classList.add('off');
        controls.classList.add('hidden');
        removeStyle();
      }
      chrome.storage.local.set({ mfActive: state.active, mfFont: state.font, mfSize: state.size });
    }

    toggle.addEventListener('click', () => {
      state.active = !state.active;
      syncToggle();
    });

    fontSel.addEventListener('change', () => {
      state.font = fontSel.value;
      if (state.active) applyStyle();
      chrome.storage.local.set({ mfFont: state.font });
    });

    // تغییر اندازه با کلیک‌های پشت‌سر‌هم
    const sizeValues = SIZES.map(s => s.value);
    function changeSize(dir) {
      const idx = sizeValues.indexOf(state.size);
      const next = idx + dir;
      if (next < 0 || next >= sizeValues.length) return;
      state.size = sizeValues[next];
      if (state.active) applyStyle();
      chrome.storage.local.set({ mfSize: state.size });
    }
    szDown.addEventListener('click', () => changeSize(-1));
    szUp.addEventListener('click',   () => changeSize(+1));

    // باز کردن در Freedium
    freedium.addEventListener('click', () => {
      const url = window.location.href;
      if (url.includes('freedium')) return;
      const path = window.location.pathname + window.location.search;
      window.open(`https://freedium-mirror.cfd${path}`, '_blank');
    });

    // محو شدن هنگام اسکرول
    let hideTimer;
    bar.querySelector('#mf-bar-inner').style.opacity = '1';
    window.addEventListener('scroll', () => {
      bar.querySelector('#mf-bar-inner').style.opacity = '0.3';
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { bar.querySelector('#mf-bar-inner').style.opacity = '1'; }, 1000);
    }, { passive: true });

    syncToggle();
  }

  // ---- init ----
  chrome.storage.local.get(['mfActive', 'mfFont', 'mfSize'], (data) => {
    state.active = !!data.mfActive;
    state.font   = data.mfFont || 'Vazirmatn';
    state.size   = data.mfSize || '19px';
    buildBar();
  });

  window.__mediumFarsi = { state };
})();
