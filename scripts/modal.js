function openModal(imageSrc) {
  const modal = document.querySelector('.modal');
  const modalImg = document.querySelector('.modal-content');

  modal.style.display = 'block';
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
      closeModal();
    }
  });
  
