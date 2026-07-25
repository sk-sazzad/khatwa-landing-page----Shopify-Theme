document.addEventListener('DOMContentLoaded', function() {
  const BASE_PRICE = 189;
  let currentQuantity = 1;
  let selectedColor = "أبيض عاجي";
  let selectedSize = "";

  // Elements
  const qtyInput = document.getElementById('checkout-qty-input');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  
  const colorLabel = document.getElementById('selected-color-label');
  const colorValueInput = document.getElementById('input-color-value');
  const colorSwatches = document.querySelectorAll('.color-swatch-btn');
  
  const sizeLabel = document.getElementById('selected-size-label');
  const sizeValueInput = document.getElementById('input-size-value');
  const sizePills = document.querySelectorAll('.size-pill-btn');
  const sizeErrorMsg = document.getElementById('size-error-msg');

  const summaryVariantText = document.getElementById('summary-variant-text');
  const summaryQtyText = document.getElementById('summary-qty-text');
  const summaryCalcText = document.getElementById('summary-calc-text');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryGrandTotal = document.getElementById('summary-grand-total');

  const form = document.getElementById('express-checkout-form');
  const successScreen = document.getElementById('checkout-success-screen');
  const successDetails = document.getElementById('checkout-success-details');
  const resetBtn = document.getElementById('reset-checkout-form');
  const submitBtn = document.getElementById('submit-order-btn');

  // Hero Gallery Switcher
  const heroMainImg = document.getElementById('hero-main-img');
  const heroThumbs = document.querySelectorAll('.hero-thumb');
  const heroPrev = document.getElementById('hero-prev');
  const heroNext = document.getElementById('hero-next');
  let currentHeroIndex = 0;

  function updateHeroImage(index) {
    if (!heroThumbs.length) return;
    if (index < 0) index = heroThumbs.length - 1;
    if (index >= heroThumbs.length) index = 0;
    currentHeroIndex = index;

    heroThumbs.forEach((thumb, i) => {
      if (i === currentHeroIndex) {
        thumb.classList.add('border-blue-600', 'ring-4', 'ring-blue-500/30', 'opacity-100', 'scale-105', 'shadow-md');
        thumb.classList.remove('border-slate-200', 'opacity-70');
      } else {
        thumb.classList.remove('border-blue-600', 'ring-4', 'ring-blue-500/30', 'opacity-100', 'scale-105', 'shadow-md');
        thumb.classList.add('border-slate-200', 'opacity-70');
      }
    });

    const newUrl = heroThumbs[currentHeroIndex].getAttribute('data-img-url');
    if (heroMainImg && newUrl) {
      heroMainImg.src = newUrl;
    }
  }

  heroThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', function() {
      updateHeroImage(index);
    });
  });

  if (heroPrev) heroPrev.addEventListener('click', () => updateHeroImage(currentHeroIndex - 1));
  if (heroNext) heroNext.addEventListener('click', () => updateHeroImage(currentHeroIndex + 1));

  // Price & Quantity Calculation
  function updateCalculations() {
    const total = BASE_PRICE * currentQuantity;
    if (qtyInput) qtyInput.value = currentQuantity;
    if (summaryQtyText) summaryQtyText.textContent = `الكمية: ${currentQuantity}`;
    if (summaryCalcText) summaryCalcText.textContent = `${currentQuantity} × ${BASE_PRICE} ر.س`;
    if (summarySubtotal) summarySubtotal.textContent = `${total} ر.س`;
    if (summaryGrandTotal) summaryGrandTotal.textContent = `${total}`;
    
    const sizeText = selectedSize || 'اختر المقاس';
    if (summaryVariantText) summaryVariantText.textContent = `${selectedColor} · ${sizeText}`;
  }

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function() {
      if (currentQuantity > 1) {
        currentQuantity--;
        updateCalculations();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function() {
      currentQuantity++;
      updateCalculations();
    });
  }

  // Color selection
  colorSwatches.forEach(function(btn) {
    btn.addEventListener('click', function() {
      colorSwatches.forEach(b => {
        b.classList.remove('border-white', 'ring-2', 'ring-blue-600', 'ring-offset-2', 'scale-110');
        b.classList.add('border-slate-300');
      });
      btn.classList.remove('border-slate-300');
      btn.classList.add('border-white', 'ring-2', 'ring-blue-600', 'ring-offset-2', 'scale-110');

      selectedColor = btn.getAttribute('data-color') || "أبيض عاجي";
      if (colorLabel) colorLabel.textContent = selectedColor;
      if (colorValueInput) colorValueInput.value = selectedColor;
      updateCalculations();
    });
  });

  // Size selection
  sizePills.forEach(function(btn) {
    btn.addEventListener('click', function() {
      sizePills.forEach(b => {
        b.classList.remove('border-blue-600', 'bg-blue-600', 'text-white');
        b.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-800');
      });
      btn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-800');
      btn.classList.add('border-blue-600', 'bg-blue-600', 'text-white');

      selectedSize = btn.getAttribute('data-size') || "";
      if (sizeLabel) sizeLabel.textContent = selectedSize;
      if (sizeValueInput) sizeValueInput.value = selectedSize;
      if (sizeErrorMsg) sizeErrorMsg.classList.add('hidden');
      updateCalculations();
    });
  });

  // Form submission via Shopify AJAX Cart API
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!selectedSize) {
        if (sizeErrorMsg) sizeErrorMsg.classList.remove('hidden');
        const sizeContainer = document.getElementById('size-buttons-container');
        if (sizeContainer) sizeContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const fullname = document.getElementById('input-fullname')?.value || '';
      const phone = document.getElementById('input-phone')?.value || '';
      const city = document.getElementById('input-city')?.value || '';
      const address = document.getElementById('input-address')?.value || '';
      const variantId = document.getElementById('selected-variant-id')?.value || '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'جاري إرسال الطلب...';
      }

      // Try sending via Shopify AJAX Cart API (/cart/add.js)
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: variantId,
          quantity: currentQuantity,
          properties: {
            'الاسم الكامل': fullname,
            'رقم الجوال': phone,
            'المدينة': city,
            'العنوان': address,
            'اللون': selectedColor,
            'المقاس': selectedSize
          }
        })
      }).catch(function(err) {
        console.log('Direct checkout fallback');
      }).finally(function() {
        if (form) form.classList.add('hidden');
        if (successScreen) {
          successScreen.classList.remove('hidden');
          successScreen.classList.add('flex');
        }

        const totalAmt = BASE_PRICE * currentQuantity;
        if (successDetails) {
          successDetails.innerHTML = `
            <div><strong>اسم المشتري:</strong> ${fullname}</div>
            <div><strong>رقم الجوال:</strong> ${phone}</div>
            <div><strong>مدينة التوصيل:</strong> ${city}</div>
            <div><strong>العنوان:</strong> ${address}</div>
            <div><strong>المنتج:</strong> ${currentQuantity}× حذاء كروس كلاسيك ستار (${selectedColor} - ${selectedSize})</div>
            <div><strong>المبلغ الإجمالي:</strong> ${totalAmt} ر.س (الدفع عند الاستلام)</div>
          `;
        }
      });

    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (form) {
        form.reset();
        form.classList.remove('hidden');
      }
      if (successScreen) {
        successScreen.classList.add('hidden');
        successScreen.classList.remove('flex');
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'تأكيد الطلب الآن';
      }
      currentQuantity = 1;
      selectedSize = "";
      if (sizeLabel) sizeLabel.textContent = "لم يتم الاختيار";
      sizePills.forEach(b => {
        b.classList.remove('border-blue-600', 'bg-blue-600', 'text-white');
        b.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-800');
      });
      updateCalculations();
    });
  }

});
