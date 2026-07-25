document.addEventListener('DOMContentLoaded', function() {
  const msgs = document.querySelectorAll('.announcement-msg');
  if (msgs.length <= 1) return;

  let currentIndex = 0;
  setInterval(function() {
    msgs[currentIndex].classList.remove('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    msgs[currentIndex].classList.add('opacity-0', '-translate-y-3', 'scale-95', 'pointer-events-none');

    currentIndex = (currentIndex + 1) % msgs.length;

    msgs[currentIndex].classList.remove('opacity-0', '-translate-y-3', 'scale-95', 'pointer-events-none');
    msgs[currentIndex].classList.add('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
  }, 3800);
});
