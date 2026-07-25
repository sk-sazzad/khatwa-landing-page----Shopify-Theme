document.addEventListener('DOMContentLoaded', function() {
  const stickyBar = document.getElementById('sticky-bottom-bar');
  if (!stickyBar) return;

  function handleScroll() {
    const orderSection = document.getElementById('order');
    if (!orderSection) return;

    const rect = orderSection.getBoundingClientRect();
    const pastHero = window.scrollY > 200;
    const beforeOrderEnd = rect.top > window.innerHeight - 100;

    if (pastHero && beforeOrderEnd) {
      stickyBar.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
      stickyBar.classList.add('translate-y-0', 'opacity-100');
    } else {
      stickyBar.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
      stickyBar.classList.remove('translate-y-0', 'opacity-100');
    }
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});
