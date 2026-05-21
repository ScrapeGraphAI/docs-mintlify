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
