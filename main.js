// Privacy-friendly analytics (GoatCounter): cookieless page counts, no
// consent banner needed. count.js skips localhost by default, so local
// previews don't pollute the stats.
(function () {
  var gc = document.createElement('script');
  gc.async = true;
  gc.src = 'https://gc.zgo.at/count.js';
  gc.setAttribute('data-goatcounter', 'https://papaonlegs.goatcounter.com/count');
  document.head.appendChild(gc);
})();

// Progressive enhancement for the "Book a call" link: opens the Calendly
// popup widget instead of navigating away. Falls back to a plain link
// (already the href) if this script fails to load or run for any reason.
(function () {
  var link = document.querySelector('[data-calendly]');
  if (!link) return;

  var scriptLoaded = false;
  function loadCalendly(callback) {
    if (scriptLoaded) return callback();
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);

    var script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = function () {
      scriptLoaded = true;
      callback();
    };
    document.head.appendChild(script);
  }

  link.addEventListener('click', function (event) {
    event.preventDefault();
    // Conversion metric: count "Book a call" clicks as a GoatCounter event.
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: 'book-call-click', title: 'Book a call clicked', event: true });
    }
    loadCalendly(function () {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: link.href });
      } else {
        window.open(link.href, '_blank');
      }
    });
  });
})();
