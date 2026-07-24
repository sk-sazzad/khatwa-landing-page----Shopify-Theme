/* ==========================================================================
   KHATWA SHOPIFY OS 2.0 THEME JAVASCRIPT
   Interactive Cart Drawer, Gallery, Accordions, Sticky Bar & Countdown
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initGallery();
  initFaqAccordion();
  initStickyBar();
  initCountdownTimer();
  initLanguageSwitcher();
});

/* 1. Cart Drawer Logic */
function initCartDrawer() {
  const drawer = document.getElementById('CartDrawer');
  const overlay = document.getElementById('CartDrawerOverlay');
  const triggers = document.querySelectorAll('.js-open-cart');
  const closeBtns = document.querySelectorAll('.js-close-cart');

  if (!drawer) return;

  function openCart() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  closeBtns.forEach(btn => btn.addEventListener('click', closeCart));
  if (overlay) overlay.addEventListener('click', closeCart);

  // Attach to window so AJAX calls can open cart
  window.KhatwaOpenCart = openCart;
  window.KhatwaCloseCart = closeCart;
}

/* 2. Media Gallery Switcher */
function initGallery() {
  const mainImage = document.getElementById('MainProductImage');
  const thumbs = document.querySelectorAll('.js-thumb-btn');

  if (!mainImage || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.getAttribute('data-full-src');
      if (newSrc) {
        mainImage.src = newSrc;
      }
    });
  });
}

/* 3. FAQ Accordion Toggle */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.js-faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 4. Sticky Add to Cart Bar on Scroll */
function initStickyBar() {
  const stickyBar = document.getElementById('StickyAtcBar');
  const mainCta = document.getElementById('MainBuyButton');

  if (!stickyBar || !mainCta) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Show sticky bar when main CTA goes out of view
      if (!entry.isIntersecting) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(mainCta);
}

/* 5. Limited-Time Offer Countdown Timer */
function initCountdownTimer() {
  const timerDisplay = document.getElementById('OfferCountdownTimer');
  if (!timerDisplay) return;

  let totalSeconds = 24 * 3600 - 1420; // Default ~23 hours

  function updateTimer() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      totalSeconds = 24 * 3600; // Reset
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 6. Language Switcher */
function initLanguageSwitcher() {
  const switchBtns = document.querySelectorAll('.js-lang-switch');

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');
      const currentUrl = new URL(window.location.href);

      // In Shopify standard, locale route switching happens via /ar/ or url parameter
      currentUrl.searchParams.set('locale', targetLang);
      window.location.href = currentUrl.toString();
    });
  });
}
