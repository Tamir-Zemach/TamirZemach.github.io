// assets/js/tool.js
(() => {
  const { openModal, modalMedia } = window.ModalHelpers;

  async function loadToolData(card) {
    const src = card.dataset.src;
    if (!src) return null;
    try {
      const res = await fetch(src);
      return await res.json();
    } catch (err) {
      console.error("Failed to load tool JSON:", err);
      return null;
    }
  }

  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', async () => {
      const data = await loadToolData(card);
      if (!data) return;

      openModal(data.title, data.description);

      // Video + description
      if (data.video) {
        const videoBox = document.createElement('div');
        videoBox.className = 'modal-media-box';
        videoBox.innerHTML = `
          <h3 class="mechanic-title">Tool Demo</h3>
          <video src="${data.video}" autoplay loop muted playsinline
                 style="width:100%; border-radius:6px;"></video>
          <p class="mechanic-description">${data.text || ''}</p>
        `;
        modalMedia.appendChild(videoBox);
      }

      // Snippets
      if (Array.isArray(data.snippets) && data.snippets.length > 0) {
        const box = document.createElement('div');
        box.className = 'modal-media-box';

        const group = document.createElement('div');
        group.className = 'snippet-group';
        data.snippets.forEach(snippet => {
          const btn = document.createElement('button');
          btn.className = 'snippet-toggle';
          btn.textContent = snippet.title;
          btn.dataset.url = snippet.url;
          group.appendChild(btn);
        });

        const wrapper = document.createElement('div');
        wrapper.className = 'snippet-wrapper';
        const codeBox = document.createElement('div');
        codeBox.className = 'code-box';
        const pre = document.createElement('pre');
        pre.className = 'snippet-content';
        pre.dataset.active = '';
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        handle.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';
        codeBox.appendChild(pre);
        codeBox.appendChild(handle);
        wrapper.appendChild(codeBox);

        box.appendChild(group);
        box.appendChild(wrapper);
        modalMedia.appendChild(box);
      }
    });
  });
})();