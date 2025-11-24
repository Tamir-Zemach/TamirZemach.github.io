// assets/js/project.js
(() => {
    const {openModal, modalMedia} = window.ModalHelpers;

    async function loadJSON(src) {
        try {
            const res = await fetch(src);
            return await res.json();
        } catch {
            return [];
        }
    }

    function buildLinkBadge(link) {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'project-link-badge';

        if (link.icon) {
            const icon = document.createElement('span');
            icon.className = `icon brands fa-${link.icon}`;
            a.appendChild(icon);
        }

        const label = document.createElement('span');
        label.textContent = link.label || link.url;
        a.appendChild(label);

        return a;
    }

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', async () => {
            openModal(card.dataset.title, card.dataset.description);

            // Gameplay video + links inside same modal-media-box
            if (card.dataset.gameplayVideo) {
                const gameplayBox = document.createElement('div');
                gameplayBox.className = 'modal-media-box';

                const videoHeading = document.createElement('h3');
                videoHeading.className = 'mechanic-title';
                videoHeading.textContent = 'Full Gameplay Footage';

                const videoEl = document.createElement('video');
                videoEl.src = card.dataset.gameplayVideo;
                videoEl.autoplay = true;
                videoEl.loop = true;
                videoEl.muted = true;
                videoEl.playsInline = true;
                videoEl.style.cssText = 'width:100%; border-radius:6px;';

                gameplayBox.appendChild(videoHeading);
                gameplayBox.appendChild(videoEl);

                // links inside same box
                if (card.dataset.linksSrc) {
                    const links = await loadJSON(card.dataset.linksSrc);
                    if (Array.isArray(links) && links.length > 0) {
                        const innerLinks = document.createElement('div');
                        innerLinks.className = 'modal-links gameplay-links';
                        links.forEach(link => innerLinks.appendChild(buildLinkBadge(link)));
                        gameplayBox.appendChild(innerLinks);
                    }
                }

                modalMedia.appendChild(gameplayBox);
            }

            // Mechanics
            let mechanics = [];
            if (card.dataset.mechanicsSrc) mechanics = await loadJSON(card.dataset.mechanicsSrc);
            else try {
                mechanics = JSON.parse(card.dataset.mechanics || '[]');
            } catch {
            }

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

            // Links bar at bottom (plain .modal-links, no modal-media-box wrapper)
            if (card.dataset.linksSrc) {
                const links = await loadJSON(card.dataset.linksSrc);
                if (Array.isArray(links) && links.length > 0) {
                    const bottomLinks = document.createElement('div');
                    bottomLinks.className = 'modal-links bottom-links';
                    links.forEach(link => bottomLinks.appendChild(buildLinkBadge(link)));
                    modalMedia.appendChild(bottomLinks);
                }
            }
        });
    });
})();