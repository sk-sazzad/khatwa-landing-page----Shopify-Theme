document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('size-guide-modal');
  const closeBtn = document.getElementById('close-size-guide');
  const openBtns = document.querySelectorAll('#open-size-guide-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    setTimeout(function() {
      modal.classList.remove('opacity-0');
      modal.classList.add('opacity-100');
    }, 10);
  }

  function closeModal() {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(function() {
      modal.classList.add('hidden');
    }, 200);
  }

  openBtns.forEach(function(btn) {
    btn.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
});
