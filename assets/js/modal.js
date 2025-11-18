// assets/js/modal.js
(() => {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalMedia = document.getElementById('modalMedia');
  const modalClose = document.querySelector('.modal-close');

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

  if (modalClose) modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Expose helpers globally
  window.ModalHelpers = { openModal, closeModal, modalMedia };
})();