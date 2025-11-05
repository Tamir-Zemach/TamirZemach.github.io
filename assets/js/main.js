(function ($) {
  const $window = $(window),
    $body = $('body'),
    $nav = $('#nav');

  // Breakpoints
  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: [null, '736px'],
  });

  // Initial animation
  $window.on('load', function () {
    window.setTimeout(() => {
      $body.removeClass('is-preload');
    }, 100);
  });

  // Scrolly
  $('#nav a, .scrolly').scrolly({
    speed: 1000,
    offset: () => $nav.height()
  });

  // Formspree AJAX submission
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    fetch('https://formspree.io/f/mjkozwkz', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.reset();
        $('#popup').addClass('show');
      } else {
        alert('Oops! Something went wrong.');
      }
    });
  });
})(jQuery);
// Modal logic
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalMedia = document.getElementById('modalMedia');
  const modalClose = document.querySelector('.modal-close');

  let isDragging = false;
  let suppressClick = false;

  const stopDrag = () => {
    if (isDragging) {
      suppressClick = true;
    }
    isDragging = false;
    document.body.style.userSelect = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
      modalMedia.innerHTML = "";
      document.body.classList.remove('modal-open');
    });
  }

  window.addEventListener('click', (e) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (e.target === modal) {
      modal.style.display = 'none';
      modalMedia.innerHTML = "";
      document.body.classList.remove('modal-open');
    }
  });

  // Load mechanics from external JSON
  async function loadMechanicsForCard(card) {
    if (card.dataset.mechanics) {
      try { return JSON.parse(card.dataset.mechanics); } catch { }
    }
    const src = card.dataset.mechanicsSrc;
    if (!src) return [];
    try {
      const res = await fetch(src);
      const data = await res.json();
      card.dataset.mechanics = JSON.stringify(data);
      return data;
    } catch (err) {
      console.error('Failed to load mechanics JSON:', err);
      return [];
    }
  }

  // Load links from external JSON
  async function loadLinksForCard(card) {
    if (card.dataset.links) {
      try { return JSON.parse(card.dataset.links); } catch { }
    }
    const src = card.dataset.linksSrc;
    if (!src) return [];
    try {
      const res = await fetch(src);
      const data = await res.json();
      card.dataset.links = JSON.stringify(data);
      return data;
    } catch (err) {
      console.error('Failed to load links JSON:', err);
      return [];
    }
  }

  // Project card click → open modal
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', async () => {
      const title = card.dataset.title || card.querySelector('h3').innerText;
      const description = card.dataset.description || card.querySelector('p')?.innerText || '';

      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalMedia.innerHTML = "";

      // Load mechanics
      let mechanics = [];
      if (card.dataset.mechanicsSrc) {
        mechanics = await loadMechanicsForCard(card);
      } else {
        try { mechanics = JSON.parse(card.dataset.mechanics); } catch { }
      }

      mechanics.forEach(m => {
        const box = document.createElement('div');
        box.className = 'modal-media-box';
        box.innerHTML = `
          <div class="mechanic">
            <h3 class="mechanic-title">${m.title || "Mechanic"}</h3>
            <video src="${m.video}" autoplay loop muted controls style="width: 100%; border-radius: 6px;"></video>
            <p class="mechanic-description">${m.text || ""}</p>
            <div class="mechanic-scripts-label">Scripts:</div>
          </div>
        `;

        if (Array.isArray(m.snippets)) {
          const buttonGroup = document.createElement('div');
          buttonGroup.className = 'snippet-group';

          m.snippets.forEach(snippet => {
            const button = document.createElement('button');
            button.className = 'snippet-toggle';
            button.textContent = snippet.title;
            button.dataset.url = snippet.url;
            buttonGroup.appendChild(button);
          });

          const snippetWrapper = document.createElement('div');
          snippetWrapper.className = 'snippet-wrapper';

          const codeBox = document.createElement('div');
          codeBox.className = 'code-box';

          const sharedPre = document.createElement('pre');
          sharedPre.className = 'snippet-content';
          sharedPre.dataset.active = "";

          const resizeHandle = document.createElement('div');
          resizeHandle.className = 'resize-handle';
          resizeHandle.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';

          codeBox.appendChild(sharedPre);
          codeBox.appendChild(resizeHandle);
          snippetWrapper.appendChild(codeBox);
          // Restore drag-to-resize functionality
          let startY, startHeight;

          resizeHandle.addEventListener('mousedown', e => {
            e.preventDefault();
            if (!sharedPre.classList.contains('open')) {
              sharedPre.classList.add('open');
            }
            if (!sharedPre.offsetHeight) {
              sharedPre.style.height = '300px';
            }
            isDragging = true;
            startY = e.clientY;
            startHeight = sharedPre.offsetHeight;
            document.body.style.userSelect = 'none';
          });

          resizeHandle.addEventListener('touchstart', e => {
            e.preventDefault();
            if (!sharedPre.classList.contains('open')) {
              sharedPre.classList.add('open');
            }
            if (!sharedPre.offsetHeight) {
              sharedPre.style.height = '300px';
            }
            isDragging = true;
            startY = e.touches[0].clientY;
            startHeight = sharedPre.offsetHeight;
          });

          window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dy = e.clientY - startY;
            const modalContent = document.querySelector('.modal-content');
            const modalRect = modalContent.getBoundingClientRect();
            const panelRect = sharedPre.getBoundingClientRect();
            const availableHeight = modalRect.height - (panelRect.top - modalRect.top) - 50;
            const next = Math.min(Math.max(120, startHeight + dy), availableHeight);
            sharedPre.style.height = `${next}px`;
          });

          window.addEventListener('touchmove', e => {
            if (!isDragging) return;
            const dy = e.touches[0].clientY - startY;
            const modalContent = document.querySelector('.modal-content');
            const panelRect = sharedPre.getBoundingClientRect();
            const modalRect = modalContent.getBoundingClientRect();
            const availableHeight = modalRect.height - (panelRect.top - modalRect.top) - 50;
            const next = Math.min(Math.max(120, startHeight + dy), availableHeight);
            sharedPre.style.height = `${next}px`;
          });

          window.addEventListener('mouseup', stopDrag);
          window.addEventListener('touchend', stopDrag);

          box.appendChild(buttonGroup);
          box.appendChild(snippetWrapper);
        }

        modalMedia.appendChild(box);
      });

      // Load links
      let links = [];
      if (card.dataset.linksSrc) {
        links = await loadLinksForCard(card);
      } else {
        try { links = JSON.parse(card.dataset.links); } catch { }
      }

      if (links.length > 0) {
        const linkContainer = document.createElement("div");
        linkContainer.className = "modal-links";

        links.forEach(link => {
          const a = document.createElement("a");
          a.href = link.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";

          if (link.icon) {
            const icon = document.createElement("i");
            icon.classList.add("fa-brands", `fa-${link.icon}`);
            a.appendChild(icon);
          }

          a.append(" " + link.label);
          linkContainer.appendChild(a);
        });

        modalMedia.appendChild(linkContainer);

        const topLinks = linkContainer.cloneNode(true);
        topLinks.classList.add("modal-links-top");
        const modalContent = modal.querySelector(".modal-content");
        modalContent.prepend(topLinks);
      }

      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    });
  });

  // Snippet toggle logic (unchanged)
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.snippet-toggle');
    if (!button) return;

    const snippetWrapper = button.parentElement.nextElementSibling;
    const codeBox = snippetWrapper.querySelector('.code-box');
    const pre = codeBox.querySelector('.snippet-content');
    const isOpen = pre.classList.contains('open') && pre.dataset.active === button.textContent;

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

// Make snippet fill the modal height
const modalContent = document.querySelector('.modal-content');
const modalRect = modalContent.getBoundingClientRect();

// Default: fill modal height
let targetHeight = modalRect.height - 40;

// On small screens, cap the height dynamically (e.g. 60% of modal height)
if (window.innerWidth <= 736) {   // matches your "small" breakpoint
  targetHeight = Math.min(targetHeight, modalRect.height * 0.6);
}

pre.style.height = targetHeight + 'px';

// Mark active
pre.dataset.active = button.textContent;
pre.innerHTML = 'Loading...';

// Scroll the modal so the snippet is in view, but leave space for the button
setTimeout(() => {
  const buttonTop = button.getBoundingClientRect().top;
  const modalTop = modalContent.getBoundingClientRect().top;

  const offset = buttonTop - modalTop;

  modalContent.scrollTo({
    top: modalContent.scrollTop + offset - 40,
    behavior: 'smooth'
  });
}, 100);

fetch(button.dataset.url)
  .then(res => res.text())
  .then(code => {
    pre.innerHTML = '';
    pre.insertAdjacentText('afterbegin', code);
  })
  .catch(() => {
    pre.innerHTML = 'Failed to load script.';
  });
  });

  // Scroll redirect
  const modalContent = document.querySelector('.modal-content');
  const onWheelRedirectToModal = (e) => {
    if (modal.style.display === 'block') {
      if (e.target.closest('.snippet-content.open')) return;
      e.preventDefault();
      modalContent.scrollTop += e.deltaY;
    }
  };
  window.addEventListener('wheel', onWheelRedirectToModal, { passive: false });
});