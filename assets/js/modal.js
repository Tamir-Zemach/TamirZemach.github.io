// assets/js/modal.js
(() => {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalMedia = document.getElementById('modalMedia');
  const modalClose = document.querySelector('.modal-close');

  let mouseDownTarget = null;

  function openModal(title, description) {
    modalTitle.textContent = title || '';
    modalDescription.textContent = description || '';
    modalMedia.innerHTML = '';
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.style.display = 'none';
    modalMedia.innerHTML = '';
    document.body.classList.remove('modal-open');
  }

  // Track where the mouse went down
  window.addEventListener('mousedown', (e) => {
    mouseDownTarget = e.target;
  });

  // Only close if both down and up were on the backdrop
  window.addEventListener('mouseup', (e) => {
    if (
      modal.style.display === 'block' &&
      e.target === modal &&
      mouseDownTarget === modal
    ) {
      closeModal();
    }
    mouseDownTarget = null; // reset
  });

  // Close when clicking the X button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Optional: close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Expose helpers globally
  window.ModalHelpers = { openModal, closeModal, modalMedia };
})();