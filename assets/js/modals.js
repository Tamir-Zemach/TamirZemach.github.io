// assets/js/modals.js
(() => {
    const { openModal, modalMedia } = window.ModalHelpers;

    async function loadModalData(card) {
        const src = card.dataset.src;
        if (!src) return null;
        try {
            const res = await fetch(src);
            return await res.json();
        } catch (err) {
            console.error("Failed to load modal JSON:", err);
            return null;
        }
    }

    document.querySelectorAll('.modal-card').forEach(card => {
        card.addEventListener('click', async () => {
            const data = await loadModalData(card);
            if (!data) return;

            // Open modal with title + description (big top heading)
            openModal(data.title, data.description);

            // Loop through modals array (or animations if you kept that key)
            const items = data.modals || data.animations || [];
            if (Array.isArray(items)) {
                items.forEach(modalItem => {
                    const box = document.createElement('div');
                    box.className = 'modal-media-box';
                    box.innerHTML = `
                        <div class="modal-item">
                          <h3 class="animation-title">${modalItem.title || 'Modal'}</h3>
                          <video src="${modalItem.video}" autoplay loop muted playsinline
                                 style="width:100%; border-radius:6px;"></video>
                          <p class="modal-description">${modalItem.text || ''}</p>
                        </div>
                    `;
                    modalMedia.appendChild(box);
                });
            }
        });
    });
})();