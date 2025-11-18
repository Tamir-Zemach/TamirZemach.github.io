// assets/js/snippets.js
(() => {
  // Normalize GitHub raw URLs
  function normalizeUrl(url) {
    if (!url) return url;
    // Replace refs/heads/main with just main
    return url.replace('/refs/heads/main/', '/main/');
  }

  // Toggle snippet open/close
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.snippet-toggle');
    if (!button) return;

    const snippetWrapper = button.parentElement.nextElementSibling;
    const codeBox = snippetWrapper.querySelector('.code-box');
    const pre = codeBox.querySelector('.snippet-content');
    const isOpen = pre.classList.contains('open') && pre.dataset.active === button.textContent;

    // Reset all buttons in this group
    button.parentElement.querySelectorAll('.snippet-toggle').forEach(btn => {
      btn.classList.remove('active');
    });

    if (isOpen) {
      pre.classList.remove('open');
      pre.style.height = '';
      pre.dataset.active = '';
      pre.innerHTML = '';
      return;
    }

    button.classList.add('active');
    pre.classList.add('open');

    // Make snippet fill modal height
    const modalContent = document.querySelector('.modal-content');
    const modalRect = modalContent.getBoundingClientRect();

    let targetHeight = modalRect.height - 40;
    if (window.innerWidth <= 736) {
      targetHeight = Math.min(targetHeight, modalRect.height * 0.6);
    }
    targetHeight = targetHeight - 110; // leave space for handle
    pre.style.height = targetHeight + 'px';

    // Mark active
    pre.dataset.active = button.textContent;
    pre.innerHTML = 'Loading...';

    // Scroll snippet into view
    setTimeout(() => {
      const buttonTop = button.getBoundingClientRect().top;
      const modalTop = modalContent.getBoundingClientRect().top;
      const offset = buttonTop - modalTop;

      modalContent.scrollTo({
        top: modalContent.scrollTop + offset - 40,
        behavior: 'smooth'
      });
    }, 100);

    // Fetch snippet code
    const url = normalizeUrl(button.dataset.url);
    console.log("Fetching snippet from:", url);

    fetch(url)
      .then(res => res.text())
      .then(code => {
        pre.innerHTML = '';
        pre.insertAdjacentText('afterbegin', code);
      })
      .catch(() => {
        pre.innerHTML = 'Failed to load script.';
      });
  });

  // Resize handle logic
  document.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.resize-handle');
    if (!handle) return;

    const codeBox = handle.parentElement;
    const pre = codeBox.querySelector('.snippet-content');
    if (!pre.classList.contains('open')) return;

    let startY = e.clientY;
    let startHeight = pre.offsetHeight;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientY - startY;
      pre.style.height = (startHeight + delta) + 'px';
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Scroll redirect for modal
  const modal = document.getElementById('projectModal');
  const modalContent = document.querySelector('.modal-content');
  const onWheelRedirectToModal = (e) => {
    if (modal.style.display === 'block') {
      if (e.target.closest('.snippet-content.open')) return;
      e.preventDefault();
      modalContent.scrollTop += e.deltaY;
    }
  };
  window.addEventListener('wheel', onWheelRedirectToModal, { passive: false });
})();