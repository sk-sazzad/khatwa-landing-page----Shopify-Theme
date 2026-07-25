/* Cross Classic Star Clogs — Shopify Arabic RTL Theme JS */
document.addEventListener('DOMContentLoaded', function () {

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item    = btn.closest('.faq-item');
      var content = item ? item.querySelector('.faq-content') : null;
      var chevron = btn.querySelector('svg');
      if (!content) return;

      var isOpen = !content.classList.contains('hidden');

      /* Close all others */
      document.querySelectorAll('.faq-content').forEach(function (c) {
        c.classList.add('hidden');
      });
      document.querySelectorAll('.faq-toggle svg').forEach(function (s) {
        s.classList.remove('rotate-180', 'text-blue-600');
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (chevron) {
          chevron.classList.add('rotate-180', 'text-blue-600');
        }
      }
    });
  });

  /* Open first FAQ by default */
  var firstFaq = document.querySelector('.faq-item .faq-content');
  var firstChevron = document.querySelector('.faq-item .faq-toggle svg');
  if (firstFaq) firstFaq.classList.remove('hidden');
  if (firstChevron) firstChevron.classList.add('rotate-180', 'text-blue-600');

  /* ── Countdown Timer (Hero Section) ── */
  var countdownEl = document.getElementById('hero-countdown');
  if (countdownEl) {
    var hours = 3, minutes = 42, seconds = 18;
    setInterval(function () {
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      } else {
        hours = 3; minutes = 59; seconds = 59;
      }
      var pad = function (n) { return String(n).padStart(2, '0'); };
      countdownEl.querySelector('span').textContent =
        pad(hours) + 'س : ' + pad(minutes) + 'د : ' + pad(seconds) + 'ث';
    }, 1000);
  }

  /* ── Stock Progress Bar Animation ── */
  var stockFill = document.querySelector('.stock-fill, [class*="from-amber-500"][class*="rounded-full"]');
  if (stockFill) {
    setTimeout(function () {
      stockFill.style.width = '67%';
    }, 300);
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Rating bars animation on scroll ── */
  var ratingBars = document.querySelectorAll('.rating-bar-fill, [class*="from-amber-400"][class*="h-full"]');
  if (ratingBars.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          /* Already set via inline style — trigger reflow */
          var el = entry.target;
          var width = el.style.width;
          el.style.width = '0';
          setTimeout(function () { el.style.width = width; }, 50);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    ratingBars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  /* ── Social proof counter animation ── */
  var statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var rawText = el.textContent.replace(/[^0-9]/g, '');
          var target = parseInt(rawText, 10);
          if (!target) return;

          var suffix = el.textContent.replace(/[0-9,]/g, '');
          var start = performance.now();
          var duration = 2000;

          function animate(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var easeOut = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(easeOut * target);
            el.textContent = current.toLocaleString('ar-SA') + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

});
