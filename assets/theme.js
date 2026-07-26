/**
 * Shopify Theme JS - خطوة - Landing Page
 * Full interactivity, state management, animations, and cart integration.
 */

window.KhatwaTheme = window.KhatwaTheme || {};

(function () {
  'use strict';

  // Global Theme State
  const state = {
    selectedImgIndex: 0,
    selectedColor: '',
    selectedSize: '',
    quantity: 1,
    basePrice: 189,
    annIndex: 0,
    statsAnimated: false,
    reviewBarsAnimated: false,
    faqOpen: 0
  };

  // Utility Functions
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Meta Pixel Event Tracker Helper
  function trackFB(eventName, data) {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', eventName, data || {});
      } catch (err) {
        console.warn('Meta Pixel Tracking Error:', err);
      }
    }
  }

  function scrollToOrder() {
    const el = $('order') || $('order-form-wrapper');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    trackFB('AddToCart', {
      content_name: 'كروس كلاسيك ستار كلوجز',
      currency: 'SAR',
      value: state.basePrice * state.quantity
    });
  }

  // ─── 1. ANNOUNCEMENT BAR ROTATOR ───────────────────────────────────────────
  function initAnnouncementBar() {
    const items = document.querySelectorAll('.ann-item');
    if (!items.length) return;

    setInterval(() => {
      items[state.annIndex].classList.remove('visible-ann');
      items[state.annIndex].classList.add('hidden-ann');
      state.annIndex = (state.annIndex + 1) % items.length;
      items[state.annIndex].classList.remove('hidden-ann');
      items[state.annIndex].classList.add('visible-ann');
    }, 3800);
  }

  // ─── 2. NAVBAR SCROLL STYLING ────────────────────────────────────────────────
  function initNavbarScroll() {
    const nav = $('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 12) {
        nav.classList.add('border-b', 'border-slate-200', 'dark:border-slate-800', 'shadow-sm');
      } else {
        nav.classList.remove('border-b', 'border-slate-200', 'dark:border-slate-800', 'shadow-sm');
      }
    }, { passive: true });
  }

  // ─── 3. GALLERY SYSTEM ───────────────────────────────────────────────────────
  window.setImage = function (idx) {
    const mainImg = $('main-img');
    const skeleton = $('img-skeleton');

    if (!mainImg) return;
    const total = parseInt(mainImg.getAttribute('data-total-images') || '1', 10);
    const validIdx = (parseInt(idx, 10) + total) % total;
    state.selectedImgIndex = validIdx;

    const thumbnails = document.querySelectorAll('.hero-thumb-btn');
    thumbnails.forEach((btn, i) => {
      if (i === validIdx) {
        btn.className = 'relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden border bg-white shrink-0 cursor-pointer transition-all duration-300 hero-thumb-btn border-blue-600 ring-4 ring-blue-500/30 opacity-100 scale-105 shadow-md';
      } else {
        btn.className = 'relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden border bg-white shrink-0 cursor-pointer transition-all duration-300 hero-thumb-btn border-slate-200 opacity-70 hover:opacity-100';
      }
    });

    const newSrc = mainImg.getAttribute('data-img-' + validIdx) || mainImg.src;
    if (newSrc) {
      if (mainImg.src !== newSrc) {
        if (skeleton) skeleton.style.display = 'block';
        mainImg.classList.add('loading');

        mainImg.onload = function () {
          mainImg.classList.remove('loading');
          if (skeleton) skeleton.style.display = 'none';
        };
        mainImg.onerror = function () {
          mainImg.classList.remove('loading');
          if (skeleton) skeleton.style.display = 'none';
        };
        mainImg.src = newSrc;
      } else {
        mainImg.classList.remove('loading');
        if (skeleton) skeleton.style.display = 'none';
      }
    }

    const orderPreview = $('order-preview-img');
    if (orderPreview && newSrc) {
      orderPreview.src = newSrc;
    }
  };

  window.setImageUrl = function (url) {
    if (!url) return;
    const mainImg = $('main-img');
    const skeleton = $('img-skeleton');
    if (mainImg) {
      if (mainImg.src !== url) {
        if (skeleton) skeleton.style.display = 'block';
        mainImg.classList.add('loading');

        mainImg.onload = function () {
          mainImg.classList.remove('loading');
          if (skeleton) skeleton.style.display = 'none';
        };
        mainImg.onerror = function () {
          mainImg.classList.remove('loading');
          if (skeleton) skeleton.style.display = 'none';
        };
        mainImg.src = url;
      } else {
        mainImg.classList.remove('loading');
        if (skeleton) skeleton.style.display = 'none';
      }
    }
    const orderPreview = $('order-preview-img');
    if (orderPreview) {
      orderPreview.src = url;
    }
  };

  window.prevImg = function () {
    const mainImg = $('main-img');
    if (!mainImg) return;
    const total = parseInt(mainImg.getAttribute('data-total-images') || '1', 10);
    const nextIdx = (state.selectedImgIndex - 1 + total) % total;
    window.setImage(nextIdx);
  };

  window.nextImg = function () {
    const mainImg = $('main-img');
    if (!mainImg) return;
    const total = parseInt(mainImg.getAttribute('data-total-images') || '1', 10);
    const nextIdx = (state.selectedImgIndex + 1) % total;
    window.setImage(nextIdx);
  };

  // ─── 4. COLOR & SIZE SELECTION SYNC ──────────────────────────────────────────
  window.selectColor = function (name, imgIndex, customImgUrl) {
    state.selectedColor = name;

    const heroColorLabel = $('selected-color-label');
    if (heroColorLabel) heroColorLabel.textContent = name;

    const orderColorLabel = $('order-color-label');
    if (orderColorLabel) orderColorLabel.textContent = name;

    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      if (btn.dataset.colorName === name) {
        btn.classList.add('ring-4', 'ring-blue-500/40', 'border-white', 'dark:border-slate-800', 'scale-110', 'shadow-md');
        btn.classList.remove('border-slate-300', 'dark:border-slate-700');
      } else {
        btn.classList.remove('ring-4', 'ring-blue-500/40', 'border-white', 'dark:border-slate-800', 'scale-110', 'shadow-md');
        btn.classList.add('border-slate-300', 'dark:border-slate-700');
      }
    });

    if (customImgUrl && customImgUrl.trim() !== '') {
      window.setImageUrl(customImgUrl);
    } else if (imgIndex !== undefined && imgIndex !== null && imgIndex !== '') {
      window.setImage(parseInt(imgIndex, 10));
    }

    updateOrderSummary();
    trackFB('CustomizeProduct', {
      content_name: 'كروس كلاسيك ستار كلوجز',
      color: name,
      size: state.selectedSize || ''
    });
  };

  window.selectSize = function (size) {
    state.selectedSize = size;

    const sizeErr = $('size-error');
    if (sizeErr) sizeErr.classList.add('hidden');
    const errSize = $('err-size');
    if (errSize) errSize.classList.add('hidden');

    const orderSizeLabel = $('order-size-label');
    if (orderSizeLabel) orderSizeLabel.textContent = size;

    document.querySelectorAll('.size-select-btn').forEach(btn => {
      if (btn.dataset.sizeValue === size) {
        btn.className = 'size-select-btn py-2.5 px-3 rounded-xl border text-sm font-black transition-all cursor-pointer border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-102';
      } else {
        btn.className = 'size-select-btn py-2.5 px-3 rounded-xl border text-sm font-black transition-all cursor-pointer border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400';
      }
    });

    updateOrderSummary();
    trackFB('CustomizeProduct', {
      content_name: 'كروس كلاسيك ستار كلوجز',
      color: state.selectedColor || '',
      size: size
    });
  };

  window.heroBuyNow = function () {
    if (!state.selectedSize) {
      const sizeErr = $('size-error');
      if (sizeErr) sizeErr.classList.remove('hidden');
    }
    scrollToOrder();
  };

  // ─── 5. COUNTDOWN TIMER ─────────────────────────────────────────────────────
  function initCountdownTimer() {
    const el = $('countdown');
    if (!el) return;

    let totalSeconds = parseInt(el.dataset.seconds || '13338', 10); // default 3h 42m 18s

    function update() {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      el.textContent =
        String(h).padStart(2, '0') + 'h : ' +
        String(m).padStart(2, '0') + 'm : ' +
        String(s).padStart(2, '0') + 's';
    }

    update();
    setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        totalSeconds = 14400; // reset to 4h
      }
      update();
    }, 1000);

    const stockBar = $('stock-bar');
    if (stockBar) {
      setTimeout(() => {
        stockBar.style.width = '67%';
      }, 200);
    }
  }

  // ─── 6. INTERSECTION OBSERVERS (STATS & REVIEWS) ───────────────────────────
  function initObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'social-proof' && !state.statsAnimated) {
            state.statsAnimated = true;
            animateStats();
          }
          if (entry.target.id === 'reviews' && !state.reviewBarsAnimated) {
            state.reviewBarsAnimated = true;
            animateReviewBars();
          }
        }
      });
    }, { threshold: 0.2 });

    ['social-proof', 'reviews'].forEach(id => {
      const target = $(id);
      if (target) observer.observe(target);
    });
  }

  function animateStats() {
    document.querySelectorAll('.stat-counter').forEach(el => {
      const target = parseInt(el.dataset.target || '0', 10);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        el.textContent = start.toLocaleString('ar-SA') + suffix;
      }, 16);
    });
  }

  function animateReviewBars() {
    document.querySelectorAll('.review-bar').forEach(bar => {
      setTimeout(() => {
        bar.style.width = (bar.dataset.width || '0') + '%';
      }, 100);
    });
  }

  // ─── 7. FAQ ACCORDION ────────────────────────────────────────────────────────
  window.toggleFaq = function (index) {
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allIcons = document.querySelectorAll('.faq-icon');

    allAnswers.forEach((ans, i) => {
      const icon = allIcons[i];
      if (i === index) {
        const isOpen = ans.classList.contains('max-h-48');
        if (isOpen) {
          ans.classList.remove('max-h-48', 'opacity-100', 'pb-5');
          ans.classList.add('max-h-0', 'opacity-0');
          if (icon) icon.classList.remove('rotate-45');
        } else {
          ans.classList.add('max-h-48', 'opacity-100', 'pb-5');
          ans.classList.remove('max-h-0', 'opacity-0');
          if (icon) icon.classList.add('rotate-45');
        }
      } else {
        ans.classList.remove('max-h-48', 'opacity-100', 'pb-5');
        ans.classList.add('max-h-0', 'opacity-0');
        if (icon) icon.classList.remove('rotate-45');
      }
    });
  };

  // ─── 8. QUANTITY & SUMMARY CALCULATIONS ──────────────────────────────────────
  window.changeQty = function (delta) {
    state.quantity = Math.max(1, Math.min(10, state.quantity + delta));
    const qtyDisplay = $('qty-display');
    if (qtyDisplay) qtyDisplay.textContent = state.quantity;
    updateOrderSummary();
  };

  function updateOrderSummary() {
    const priceEl = $('order-base-price');
    if (priceEl) {
      state.basePrice = parseFloat(priceEl.dataset.price || '189');
    }

    const total = state.basePrice * state.quantity;
    const colorLabel = state.selectedColor || 'أبيض عاجي';
    const sizeLabel = state.selectedSize || 'اختر المقاس';

    const desc = $('order-product-desc');
    if (desc) desc.textContent = colorLabel + ' · ' + sizeLabel;

    const qtyLabel = $('order-qty-label');
    if (qtyLabel) qtyLabel.textContent = 'الكمية: ' + state.quantity;

    const subtotalLabel = $('subtotal-label');
    if (subtotalLabel) subtotalLabel.textContent = 'المجموع الفرعي (' + state.quantity + ' × ' + state.basePrice + ' ر.س)';

    const subtotalVal = $('subtotal-val');
    if (subtotalVal) subtotalVal.textContent = total + ' ر.س';

    const grandTotal = $('grand-total');
    if (grandTotal) {
      grandTotal.innerHTML = total + ' <span class="text-base font-extrabold text-slate-500">ر.س</span>';
    }
  }

  // ─── 9. ORDER FORM VALIDATION & SUBMISSION ───────────────────────────────────
  function showErr(id, msg) {
    const el = $(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    const inp = $(id.replace('err-', 'inp-'));
    if (inp) {
      inp.classList.add('border-red-500');
      inp.classList.remove('border-slate-200', 'dark:border-slate-700');
    }
  }

  function clearErr(id) {
    const el = $(id);
    if (!el) return;
    el.classList.add('hidden');
    const inp = $(id.replace('err-', 'inp-'));
    if (inp) {
      inp.classList.remove('border-red-500');
      inp.classList.add('border-slate-200', 'dark:border-slate-700');
    }
  }

  window.submitOrder = function () {
    const nameInp = $('inp-name');
    const phoneInp = $('inp-phone');
    const cityInp = $('inp-city');
    const addressInp = $('inp-address');

    const name = nameInp ? nameInp.value.trim() : '';
    const phone = phoneInp ? phoneInp.value.trim() : '';
    const city = cityInp ? cityInp.value : '';
    const address = addressInp ? addressInp.value.trim() : '';

    let valid = true;

    if (!name) {
      showErr('err-name', 'الرجاء إدخال اسمك الكامل.');
      valid = false;
    } else {
      clearErr('err-name');
    }

    if (!phone || !/^[+]?[0-9\s\-]{8,}$/.test(phone)) {
      showErr('err-phone', 'الرجاء إدخال رقم هاتف صحيح.');
      valid = false;
    } else {
      clearErr('err-phone');
    }

    if (!city) {
      showErr('err-city', 'الرجاء اختيار مدينتك.');
      valid = false;
    } else {
      clearErr('err-city');
    }

    if (!address) {
      showErr('err-address', 'الرجاء إدخال عنوان التوصيل.');
      valid = false;
    } else {
      clearErr('err-address');
    }

    if (!state.selectedSize) {
      const errSize = $('err-size');
      if (errSize) {
        errSize.textContent = 'الرجاء اختيار المقاس.';
        errSize.classList.remove('hidden');
      }
      valid = false;
    } else {
      const errSize = $('err-size');
      if (errSize) errSize.classList.add('hidden');
    }

    if (!valid) return;

    const btn = $('submit-btn');
    const btnText = $('submit-btn-text');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('opacity-50');
    }
    if (btnText) btnText.textContent = 'جاري تقديم الطلب...';

    // Get Variant ID from section hidden element
    const variantEl = $('order-variant-id');
    const variantId = variantEl ? parseInt(variantEl.dataset.variantId || '0', 10) : 0;

    // Order notes & line item properties
    const orderNote = [
      'اسم العميل: ' + name,
      'رقم الهاتف: ' + phone,
      'المدينة: ' + city,
      'عنوان التوصيل: ' + address,
      'اللون: ' + (state.selectedColor || 'أبيض عاجي'),
      'المقاس: ' + state.selectedSize,
      'الكمية: ' + state.quantity
    ].join('\n');

    // Generate unique Order ID (e.g. KHT-84920)
    const generatedOrderId = 'KHT-' + Math.floor(10000 + Math.random() * 90000);

    // Google Sheet Script URL (from global variable, hidden input, or direct fallback URL)
    const defaultSheetUrl = 'https://script.google.com/macros/s/AKfycbwEteodimCTIkk62BZLMauc1QRd_RKznlYb482QJsyj0Gmr2u0pqO2hCjn_IXePvQnN/exec';
    const sheetScriptUrl = (window.GOOGLE_SHEET_SCRIPT_URL || (document.getElementById('google-sheet-url') ? document.getElementById('google-sheet-url').value : '') || defaultSheetUrl).trim();

    const priceVal = state.basePrice * state.quantity;
    const orderData = {
      order_id: generatedOrderId,
      name: name,
      phone: phone,
      city: city,
      address: address,
      color: state.selectedColor || 'أبيض عاجي',
      size: state.selectedSize || '',
      quantity: state.quantity,
      price: priceVal
    };

    function showSuccessScreen() {
      var formWrapper = document.getElementById('order-form-wrapper');
      if (formWrapper) formWrapper.classList.add('hidden');

      var success = document.getElementById('order-success');
      if (success) {
        success.classList.remove('hidden');
      }

      var orderIdBadge = document.getElementById('success-order-id');
      if (orderIdBadge) {
        orderIdBadge.textContent = '#' + generatedOrderId;
      }

      var whatsappLink = document.getElementById('success-whatsapp-link');
      if (whatsappLink) {
        var waMessage = encodeURIComponent('مرحباً، أريد الاستفسار عن الطلب رقم #' + generatedOrderId);
        whatsappLink.href = 'https://wa.me/8801742820767?text=' + waMessage;
        whatsappLink.onclick = function () {
          trackFB('Contact', {
            content_name: 'WhatsApp Support',
            order_id: generatedOrderId
          });
        };
      }

      var msg = document.getElementById('success-msg');
      if (msg) {
        msg.innerHTML = 'شكراً لك، <strong class="text-slate-900 dark:text-white font-extrabold">' + escapeHTML(name) + '</strong>! تم تسجيل طلبك بنجاح وسيتصل بك فريق التوصيل لتأكيد الشحن على الرقم <span class="font-extrabold text-blue-600 dark:text-blue-400" dir="ltr">' + escapeHTML(phone) + '</span>.';
      }

      // Track Meta Pixel Purchase Event
      trackFB('Purchase', {
        content_name: 'كروس كلاسيك ستار كلوجز',
        currency: 'SAR',
        value: priceVal,
        num_items: state.quantity,
        order_id: generatedOrderId
      });

      // Smoothly redirect view to the Thank You Page section
      window.location.hash = 'thank-you';
      const orderSec = document.getElementById('order') || success;
      if (orderSec) {
        orderSec.scrollIntoView({ behavior: 'smooth' });
      }

      var details = document.getElementById('success-details');
      if (details) {
        var productTitleEl = document.querySelector('h4.font-extrabold');
        var productTitle = productTitleEl ? productTitleEl.textContent.trim() : 'كروس كلاسيك ستار كلوجز';
        var previewImg = document.getElementById('order-preview-img');
        var previewSrc = previewImg ? previewImg.src : '';

        details.innerHTML = `
          <!-- Product Summary Box -->
          <div class="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-slate-900/90 dark:to-slate-900/80 p-4 sm:p-5 rounded-2xl border border-blue-100 dark:border-slate-700/80 flex items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-3.5">
              ${previewSrc ? `<img src="${previewSrc}" class="w-16 h-16 rounded-xl object-contain bg-white dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs" alt="Product" />` : ''}
              <div>
                <h5 class="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">${escapeHTML(productTitle)}</h5>
                <div class="flex items-center gap-2 mt-1 text-xs">
                  <span class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold">${escapeHTML(state.selectedColor || 'أبيض عاجي')}</span>
                  <span class="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold">${escapeHTML(state.selectedSize || 'N/A')}</span>
                  <span class="text-slate-500 font-bold">× ${state.quantity}</span>
                </div>
              </div>
            </div>
            <div class="text-left shrink-0">
              <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-bold">الإجمالي الكلي</span>
              <span class="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">${priceVal} <span class="text-xs font-bold text-slate-500">ر.س</span></span>
            </div>
          </div>

          <!-- Customer Delivery Info Grid -->
          <div class="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="flex items-start gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">👤</span>
              <div>
                <span class="text-slate-400 block text-[11px] font-bold">اسم العميل</span>
                <strong class="text-slate-900 dark:text-white text-sm font-extrabold">${escapeHTML(name)}</strong>
              </div>
            </div>

            <div class="flex items-start gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">📞</span>
              <div>
                <span class="text-slate-400 block text-[11px] font-bold">رقم الهاتف</span>
                <strong class="text-slate-900 dark:text-white text-sm font-extrabold" dir="ltr">${escapeHTML(phone)}</strong>
              </div>
            </div>

            <div class="flex items-start gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">🏙️</span>
              <div>
                <span class="text-slate-400 block text-[11px] font-bold">المدينة</span>
                <strong class="text-slate-900 dark:text-white text-sm font-extrabold">${escapeHTML(city)}</strong>
              </div>
            </div>

            <div class="flex items-start gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">🏠</span>
              <div>
                <span class="text-slate-400 block text-[11px] font-bold">عنوان التوصيل</span>
                <strong class="text-slate-900 dark:text-white text-sm font-extrabold">${escapeHTML(address)}</strong>
              </div>
            </div>
          </div>
        `;
      }

      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
      }
    }

    if (sheetScriptUrl) {
      // Post order to Google Sheet Web App
      fetch(sheetScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      .then(function () {
        showSuccessScreen();
      })
      .catch(function (err) {
        console.error('Google Sheet API Error:', err);
        showSuccessScreen();
      });
    } else {
      // Fallback: Shopify Cart API
      if (variantId && variantId > 0) {
        fetch('/cart/clear.js', { method: 'POST' })
          .then(function () {
            return fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: [{
                  id: variantId,
                  quantity: state.quantity,
                  properties: {
                    'اللون': state.selectedColor || 'أبيض عاجي',
                    'المقاس': state.selectedSize,
                    'اسم العميل': name,
                    'رقم الهاتف': phone,
                    'المدينة': city,
                    'عنوان التوصيل': address
                  }
                }]
              })
            });
          })
          .then(function () {
            return fetch('/cart/update.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                note: orderNote,
                attributes: {
                  'customer_name': name,
                  'customer_phone': phone,
                  'delivery_city': city,
                  'delivery_address': address
                }
              })
            });
          })
          .then(function () {
            showSuccessScreen();
          })
          .catch(function () {
            showSuccessScreen();
          });
      } else {
        setTimeout(showSuccessScreen, 500);
      }
    }
  };

  window.resetOrder = function () {
    const success = $('order-success');
    if (success) success.classList.add('hidden');
    document.body.style.overflow = '';
    if (window.location.hash === '#thank-you') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    const formWrapper = $('order-form-wrapper');
    if (formWrapper) formWrapper.classList.remove('hidden');
    scrollToOrder();

    ['inp-name', 'inp-phone', 'inp-city', 'inp-address'].forEach(id => {
      const el = $(id);
      if (el) el.value = '';
    });

    state.quantity = 1;
    const qtyDisplay = $('qty-display');
    if (qtyDisplay) qtyDisplay.textContent = '1';

    const btnText = $('submit-btn-text');
    if (btnText) btnText.textContent = 'تأكيد الطلب';

    updateOrderSummary();
  };

  // ─── 10. SIZE GUIDE MODAL ─────────────────────────────────────────────────────
  window.openSizeGuide = function () {
    const modal = $('size-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeSizeGuide = function () {
    const modal = $('size-modal');
    if (modal) modal.classList.add('hidden');
  };

  // ─── 11. STICKY MOBILE BOTTOM CTA ─────────────────────────────────────────────
  function initStickyCta() {
    const cta = $('sticky-cta');
    const orderSec = $('order');
    if (!cta || !orderSec) return;

    window.addEventListener('scroll', () => {
      const rect = orderSec.getBoundingClientRect();
      const pastHero = window.scrollY > 200;
      const beforeOrderEnd = rect.top > window.innerHeight - 100;
      if (pastHero && beforeOrderEnd) {
        cta.classList.remove('sticky-cta-hidden');
        cta.classList.add('sticky-cta-visible');
      } else {
        cta.classList.add('sticky-cta-hidden');
        cta.classList.remove('sticky-cta-visible');
      }
    }, { passive: true });
  }

  // ─── 12. META PIXEL FORM TRACKING (InitiateCheckout) ─────────────────────────
  let initiateCheckoutTracked = false;
  function initFormTracking() {
    ['inp-name', 'inp-phone', 'inp-city', 'inp-address'].forEach(id => {
      const el = $(id);
      if (el) {
        el.addEventListener('focus', () => {
          if (!initiateCheckoutTracked) {
            initiateCheckoutTracked = true;
            trackFB('InitiateCheckout', {
              content_name: 'كروس كلاسيك ستار كلوجز',
              currency: 'SAR',
              value: state.basePrice * state.quantity
            });
          }
        }, { once: true });
      }
    });
  }

  // ─── INITIALIZATION ──────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initAnnouncementBar();
    initNavbarScroll();
    initCountdownTimer();
    initObservers();
    initStickyCta();
    initFormTracking();

    // Default selection
    const firstColor = document.querySelector('.color-swatch-btn');
    if (firstColor) {
      state.selectedColor = firstColor.dataset.colorName || 'أبيض عاجي';
    }
    updateOrderSummary();
  });

  window.scrollToOrder = scrollToOrder;

})();
