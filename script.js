(function () {
  var CTA_ID = 'sgai-cta-widget';

  function buildCta() {
    var el = document.createElement('div');
    el.id = CTA_ID;
    el.className = 'sgai-cta';
    el.innerHTML = [
      '<div class="sgai-cta__brand">',
      '  <img src="/logos/logo-color.svg" alt="" class="sgai-cta__brand-logo" />',
      '  <span>ScrapeGraphAI</span>',
      '</div>',
      '<div class="sgai-cta__title">Ready to build?</div>',
      '<p class="sgai-cta__desc">Start extracting structured web data for free and scale seamlessly as your project grows.</p>',
      '<a class="sgai-cta__btn sgai-cta__btn--primary" href="https://scrapegraphai.com/login">Start for free</a>',
      '<a class="sgai-cta__btn sgai-cta__btn--secondary" href="https://scrapegraphai.com/pricing">See our plans</a>'
    ].join('');
    return el;
  }

  function findTocList() {
    var asides = document.querySelectorAll('aside, nav');
    for (var i = 0; i < asides.length; i++) {
      var node = asides[i];
      var label = (node.getAttribute('aria-label') || '').toLowerCase();
      if (label.indexOf('table of contents') !== -1 || label.indexOf('on this page') !== -1) {
        var ul = node.querySelector('ul');
        if (ul) return ul;
        return node;
      }
    }
    var toc = document.querySelector('#table-of-contents, [data-toc], .toc');
    if (toc) return toc.querySelector('ul') || toc;
    return null;
  }

  function inject() {
    if (document.getElementById(CTA_ID)) return;
    var anchor = findTocList();
    if (!anchor) return;
    var parent = anchor.parentElement;
    if (!parent) return;
    var cta = buildCta();
    parent.insertBefore(cta, anchor);
  }

  function schedule() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  schedule();

  var observer = new MutationObserver(function () {
    if (!document.getElementById(CTA_ID)) inject();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  var origPush = history.pushState;
  var origReplace = history.replaceState;
  function onNav() { setTimeout(inject, 50); }
  history.pushState = function () { var r = origPush.apply(this, arguments); onNav(); return r; };
  history.replaceState = function () { var r = origReplace.apply(this, arguments); onNav(); return r; };
  window.addEventListener('popstate', onNav);

  // "Setup for Agents" button — copies a ready-to-paste setup prompt for AI agents
  var AGENT_BTN_ID = 'sgai-agent-setup-btn';

  var AGENT_SETUP_TEXT = [
    '# ScrapeGraphAI — Setup for AI Agents',
    '',
    'You are integrating ScrapeGraphAI, an LLM-powered web-scraping API that turns any website into structured data. Use it for AI-powered structured extraction, page-to-markdown conversion, AI web search, and multi-page crawling.',
    '',
    '## 1. Get an API key',
    'Sign up at https://scrapegraphai.com/dashboard and copy your key (starts with `sgai-`).',
    'Expose it as an environment variable:',
    '',
    '    export SGAI_API_KEY="sgai-..."',
    '',
    '## 2. Install an SDK',
    'Python (>= 3.12):',
    '',
    '    pip install "scrapegraph-py>=2.1.0"',
    '',
    'JavaScript / TypeScript (Node >= 22, ESM-only):',
    '',
    '    npm i scrapegraph-js@latest',
    '',
    '## 3. Core services',
    '- scrape  — fetch a page as markdown / html / screenshot',
    '- extract — AI structured extraction from a URL, HTML, or markdown (prompt + optional JSON schema)',
    '- search  — AI web search returning structured results',
    '- crawl   — async multi-page crawling (sgai.crawl.*)',
    '- monitor — cron-scheduled jobs (sgai.monitor.*)',
    '- history — inspect past requests (sgai.history.*)',
    '',
    'Every call returns an ApiResult: { status: "success" | "error", data, error, elapsed_ms }.',
    'No exceptions are thrown on API errors — always check `status` first.',
    '',
    '## 4. Python quick start',
    '',
    '    from scrapegraph_py import ScrapeGraphAI',
    '',
    '    sgai = ScrapeGraphAI()  # reads SGAI_API_KEY from env',
    '',
    '    res = sgai.extract(',
    '        "Extract the company name and description",',
    '        url="https://scrapegraphai.com",',
    '    )',
    '    print(res.data.json_data if res.status == "success" else res.error)',
    '',
    '## 5. JavaScript quick start',
    '',
    '    import { ScrapeGraphAI } from "scrapegraph-js";',
    '',
    '    const sgai = ScrapeGraphAI(); // reads SGAI_API_KEY from env',
    '',
    '    const res = await sgai.extract({',
    '      url: "https://scrapegraphai.com",',
    '      prompt: "Extract the company name and description",',
    '    });',
    '',
    '    if (res.status === "success") console.log(res.data?.json);',
    '    else console.error(res.error);',
    '',
    '## Docs',
    'Full documentation: https://docs.scrapegraphai.com',
    ''
  ].join('\n');

  function buildAgentBtn() {
    var wrap = document.createElement('div');
    wrap.id = AGENT_BTN_ID;
    wrap.className = 'sgai-agent-setup';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sgai-agent-setup__btn';
    btn.innerHTML = [
      '<svg class="sgai-agent-setup__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>',
      '  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
      '</svg>',
      '<span class="sgai-agent-setup__label">Setup for agents</span>'
    ].join('');

    btn.addEventListener('click', function () {
      copyText(AGENT_SETUP_TEXT).then(function () {
        var label = btn.querySelector('.sgai-agent-setup__label');
        if (!label) return;
        var prev = label.textContent;
        label.textContent = 'Copied!';
        btn.classList.add('is-copied');
        setTimeout(function () {
          label.textContent = prev;
          btn.classList.remove('is-copied');
        }, 1800);
      });
    });

    wrap.appendChild(btn);
    return wrap;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  }

  function findContentRoot() {
    return document.querySelector('#content-area') ||
      document.querySelector('main article') ||
      document.querySelector('article') ||
      document.querySelector('main');
  }

  function injectAgentBtn() {
    if (document.getElementById(AGENT_BTN_ID)) return;
    var root = findContentRoot();
    if (!root) return;
    var btn = buildAgentBtn();
    root.insertBefore(btn, root.firstChild);
  }

  function scheduleAgentBtn() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectAgentBtn);
    } else {
      injectAgentBtn();
    }
  }

  scheduleAgentBtn();

  var agentObserver = new MutationObserver(function () {
    if (!document.getElementById(AGENT_BTN_ID)) injectAgentBtn();
  });
  agentObserver.observe(document.documentElement, { childList: true, subtree: true });

  function onAgentNav() { setTimeout(injectAgentBtn, 50); }
  history.pushState = (function (orig) {
    return function () { var r = orig.apply(this, arguments); onAgentNav(); return r; };
  })(history.pushState);
  history.replaceState = (function (orig) {
    return function () { var r = orig.apply(this, arguments); onAgentNav(); return r; };
  })(history.replaceState);
  window.addEventListener('popstate', onAgentNav);

  // GitHub stars badge auto-update
  var GH_REPO = 'ScrapeGraphAI/Scrapegraph-ai';
  var GH_CACHE_KEY = 'sgai-gh-stars';
  var GH_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
  var lastStars = null;

  function formatStars(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k+';
    return String(n);
  }

  function updateBadgeLabel(count) {
    var label = '⭐ ' + formatStars(count);
    var links = document.querySelectorAll('a[href*="' + GH_REPO + '"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var text = (a.textContent || '').trim();
      if (text.indexOf('⭐') === -1) continue; // only the star badge link, not other GH links
      if (text !== label) a.textContent = label;
    }
  }

  function applyCached() {
    if (lastStars != null) { updateBadgeLabel(lastStars); return true; }
    try {
      var cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY) || 'null');
      if (cached && typeof cached.n === 'number') {
        lastStars = cached.n;
        updateBadgeLabel(cached.n);
        return true;
      }
    } catch (e) {}
    return false;
  }

  function fetchStars() {
    try {
      var cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.t < GH_CACHE_TTL) {
        lastStars = cached.n;
        updateBadgeLabel(cached.n);
        return;
      }
    } catch (e) {}

    fetch('https://api.github.com/repos/' + GH_REPO)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || typeof data.stargazers_count !== 'number') return;
        var n = data.stargazers_count;
        lastStars = n;
        try { localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ n: n, t: Date.now() })); } catch (e) {}
        updateBadgeLabel(n);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchStars);
  } else {
    fetchStars();
  }

  var starObserver = new MutationObserver(applyCached);
  starObserver.observe(document.documentElement, { childList: true, subtree: true });

  function onStarsNav() { setTimeout(applyCached, 50); }
  window.addEventListener('popstate', onStarsNav);

  // Periodic refresh for long-lived tabs
  setInterval(fetchStars, 30 * 60 * 1000);
})();
