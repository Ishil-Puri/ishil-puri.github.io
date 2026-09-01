document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal');
  const modalImage = modal?.querySelector('.modal-image');
  const closeButton = modal?.querySelector('.modal-close');

  if (!modal || !modalImage || !closeButton) return;

  let trigger;

  document.querySelectorAll('.photo-card').forEach((card) => {
    card.addEventListener('click', () => {
      const thumbnail = card.querySelector('img');
      trigger = card;
      modalImage.src = card.dataset.src;
      modalImage.alt = thumbnail?.alt || '';
      modal.showModal();
    });
  });

  closeButton.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener('close', () => trigger?.focus());
});
