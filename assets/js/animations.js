// assets/js/animations.js
(() => {
    const { openModal, modalMedia } = window.ModalHelpers;

    async function loadAnimationData(card) {
        const src = card.dataset.src;
        if (!src) return null;
        try {
            const res = await fetch(src);
            return await res.json();
        } catch (err) {
            console.error("Failed to load animation JSON:", err);
            return null;
        }
    }

    document.querySelectorAll('.animation-card').forEach(card => {
        card.addEventListener('click', async () => {
            const data = await loadAnimationData(card);
            if (!data) return;

            // Open modal with title + description
            openModal(data.title, data.description);

            // Loop through animations array
            if (Array.isArray(data.animations)) {

                data.animations.forEach(anim => {
                    const box = document.createElement('div');
                    box.className = 'modal-media-box';
                    box.innerHTML = `
            <div class="animation">
              <h3 class="animation-title">${anim.title || 'Animation'}</h3>
              <video src="${anim.video}" autoplay loop muted playsinline
                     style="width:100%; border-radius:6px;"></video>
              <p class="animation-description">${anim.text || ''}</p>
            </div>
          `;
                    modalMedia.appendChild(box);
                });
            }
        });
    });
})();