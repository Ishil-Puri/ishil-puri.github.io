document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('wip');

  if (!badge) return;

  badge.addEventListener('click', () => {
    const expanded = badge.getAttribute('aria-expanded') === 'true';
    badge.textContent = expanded ? 'WIP' : 'work in progress';
    badge.setAttribute('aria-expanded', String(!expanded));
  });
});
