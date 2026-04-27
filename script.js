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

  function findTocAside() {
    var candidates = document.querySelectorAll('aside, nav');
    for (var i = 0; i < candidates.length; i++) {
      var node = candidates[i];
      var label = (node.getAttribute('aria-label') || '').toLowerCase();
      if (label.indexOf('table of contents') !== -1 || label.indexOf('on this page') !== -1) {
        return node;
      }
    }
    var toc = document.querySelector('#table-of-contents, [data-toc], .toc');
    if (toc) return toc.closest('aside') || toc.parentElement;
    return null;
  }

  function inject() {
    if (document.getElementById(CTA_ID)) return;
    var host = findTocAside();
    if (!host) return;
    host.appendChild(buildCta());
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
})();
