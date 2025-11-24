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

            if (Array.isArray(data.tools)) {
                const heading = document.createElement('h2');
                heading.textContent = 'Editor Tools';
                heading.className = 'mechanics-heading';
                modalMedia.appendChild(heading);

                data.tools.forEach(tool => {
                    const box = document.createElement('div');
                    box.className = 'modal-media-box';
                    box.innerHTML = `
            <div class="mechanic">
              <h3 class="mechanic-title">${tool.title}</h3>
              <video src="${tool.video}" autoplay loop muted playsinline
                     style="width:100%; border-radius:6px;"></video>
              <p class="mechanic-description">${tool.text || ''}</p>
              <div class="mechanic-scripts-label">Scripts:</div>
            </div>
          `;

                    if (Array.isArray(tool.snippets)) {
                        const group = document.createElement('div');
                        group.className = 'snippet-group';
                        tool.snippets.forEach(snippet => {
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