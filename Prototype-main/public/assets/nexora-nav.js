(function () {
  const path = location.pathname.replace(/\\/g, '/');
  const onStream = /stream\.html$/i.test(path);
  const overviewHref = 'index.html';
  const streamHref = 'stream.html';

  function markActive(el, href) {
    if (!el) return;
    const dest = (el.getAttribute('href') || '').split('#')[0];
    if (dest === href) el.classList.add('is-active');
  }

  function injectSwitcher() {
    if (document.querySelector('.nexora-switcher')) return;
    const wrap = document.createElement('nav');
    wrap.className = 'nexora-switcher';
    wrap.setAttribute('aria-label', 'Nexora pages');
    wrap.innerHTML =
      '<a href="' + overviewHref + '"' + (onStream ? '' : ' class="is-active"') + '>Overview</a>' +
      '<a href="' + streamHref + '"' + (onStream ? ' class="is-active"' : '') + '>Live Stream</a>';
    document.body.appendChild(wrap);
  }

  function injectDrawer() {
    if (document.querySelector('.nexora-drawer')) return;
    const drawer = document.createElement('div');
    drawer.className = 'nexora-drawer';
    const onAnalytics = /analytics\.html$/i.test(path);
    const onSentiment = /sentiment\.html$/i.test(path);
    const onTrends = /trends\.html$/i.test(path);
    const onNetwork = /network\.html$/i.test(path);
    const onAudience = /audience\.html$/i.test(path);
    const onAIInsights = /ai-insights\.html$/i.test(path);
    drawer.innerHTML =
      '<div class="nexora-drawer__scrim" data-close-drawer></div>' +
      '<div class="nexora-drawer__panel">' +
      '<a href="' + overviewHref + '"' + (!onStream && !onAnalytics && !onSentiment && !onTrends && !onNetwork && !onAudience && !onAIInsights ? ' class="is-active"' : '') + '>Overview</a>' +
      '<a href="' + streamHref + '"' + (onStream ? ' class="is-active"' : '') + '>Live Intelligence</a>' +
      '<a href="analytics.html"' + (onAnalytics ? ' class="is-active"' : '') + '>Social Analytics</a>' +
      '<a href="sentiment.html"' + (onSentiment ? ' class="is-active"' : '') + '>Sentiment</a>' +
      '<a href="trends.html"' + (onTrends ? ' class="is-active"' : '') + '>Trends</a>' +
      '<a href="audience.html"' + (onAudience ? ' class="is-active"' : '') + '>Audience</a>' +
      '<a href="network.html"' + (onNetwork ? ' class="is-active"' : '') + '>Network</a>' +
      '<a href="ai-insights.html"' + (onAIInsights ? ' class="is-active"' : '') + '>AI Insights</a>' +
      '</div>';
    document.body.appendChild(drawer);

    document.querySelectorAll('header button, header .material-symbols-outlined').forEach((node) => {
      const btn = node.tagName === 'BUTTON' ? node : node.closest('button');
      if (!btn) return;
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon && icon.textContent.trim() === 'menu') {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          drawer.classList.add('is-open');
        });
      }
    });

    drawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-drawer]')) drawer.classList.remove('is-open');
    });
  }

  function wireExistingLinks() {
    const overviewLabels = ['overview', 'back to overview', 'demo'];
    const streamLabels = ['live intelligence', 'live stream', 'open full stream', 'live'];

    document.querySelectorAll('a').forEach((a) => {
      const label = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const href = a.getAttribute('href') || '';

      if (overviewLabels.includes(label) && (href === '#' || href === '' || href === overviewHref)) {
        a.setAttribute('href', overviewHref);
      }
      if (streamLabels.includes(label) && (href === '#' || href === '' || href === streamHref)) {
        a.setAttribute('href', streamHref);
      }
      markActive(a, onStream ? streamHref : overviewHref);
    });

    document.querySelectorAll('header button').forEach((btn) => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon && icon.textContent.trim() === 'close' && onStream) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          location.href = overviewHref;
        });
      }
    });
  }

  function prefetchOther() {
    const other = onStream ? overviewHref : streamHref;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = other;
    document.head.appendChild(link);
  }

  function samePage(href) {
    try {
      const dest = new URL(href, location.href);
      return dest.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '');
    } catch {
      return false;
    }
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
    if (!/(index\.html|stream\.html)$/i.test(href.split('#')[0])) return;
    if (samePage(href)) {
      e.preventDefault();
    }
  });

  injectDrawer();
  wireExistingLinks();
  prefetchOther();
})();
