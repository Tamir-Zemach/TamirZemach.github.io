// assets/js/project.js
(() => {
  const { openModal, modalMedia } = window.ModalHelpers;

  async function loadJSON(src) {
    try { const res = await fetch(src); return await res.json(); }
    catch { return []; }
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', async () => {
      openModal(card.dataset.title, card.dataset.description);

      // Gameplay video
      if (card.dataset.gameplayVideo) {
        const gameplayBox = document.createElement('div');
        gameplayBox.className = 'modal-media-box';
        gameplayBox.innerHTML = `
          <h3 class="mechanic-title">Full Gameplay Footage</h3>
          <video src="${card.dataset.gameplayVideo}" autoplay loop muted playsinline
                 style="width:100%; border-radius:6px;"></video>
        `;
        modalMedia.appendChild(gameplayBox);
      }

      // Mechanics
      let mechanics = [];
      if (card.dataset.mechanicsSrc) mechanics = await loadJSON(card.dataset.mechanicsSrc);
      else try { mechanics = JSON.parse(card.dataset.mechanics || '[]'); } catch {}

      if (!Array.isArray(mechanics)) mechanics = [mechanics];

      if (mechanics.length > 0) {
        const heading = document.createElement('h2');
        heading.textContent = 'Mechanics';
        heading.className = 'mechanics-heading';
        modalMedia.appendChild(heading);

        mechanics.forEach(m => {
          const box = document.createElement('div');
          box.className = 'modal-media-box';
          box.innerHTML = `
            <div class="mechanic">
              <h3 class="mechanic-title">${m.title || 'Mechanic'}</h3>
              <video src="${m.video}" autoplay loop muted playsinline
                     style="width:100%; border-radius:6px;"></video>
              <p class="mechanic-description">${m.text || ''}</p>
              <div class="mechanic-scripts-label">Scripts:</div>
            </div>
          `;

          if (Array.isArray(m.snippets)) {
            const group = document.createElement('div');
            group.className = 'snippet-group';
            m.snippets.forEach(snippet => {
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
          }

          modalMedia.appendChild(box);
        });
      }
    });
  });
})();