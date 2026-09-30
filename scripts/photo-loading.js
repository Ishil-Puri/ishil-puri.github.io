document.querySelectorAll('.photo-placeholder > img').forEach((image) => {
  if (image.complete) return;

  image.classList.add('is-loading');
  const reveal = () => image.classList.remove('is-loading');
  image.addEventListener('load', reveal, { once: true });
  image.addEventListener('error', reveal, { once: true });
});
