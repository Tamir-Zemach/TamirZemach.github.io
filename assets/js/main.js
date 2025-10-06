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

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modalMedia.innerHTML = '';
        });
    }

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalMedia.innerHTML = '';
        }
    });

    // Project card click
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title || card.querySelector('h3').innerText;
            const description = card.dataset.description || card.querySelector('p').innerText;
            let mechanics = [];
            try {
                mechanics = JSON.parse(card.dataset.mechanics);
            } catch (err) {
                console.error('Invalid mechanics JSON:', err);
            }

            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalMedia.innerHTML = '';

            mechanics.forEach(m => {
                const box = document.createElement('div');
                box.className = 'modal-media-box';

                box.innerHTML = `
                    <video src="${m.video}" autoplay loop muted controls style="width:100%;border-radius:6px;"></video>
                    <p>${m.text}</p>
                `;

                if (m.snippets && Array.isArray(m.snippets)) {
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
                    sharedPre.dataset.active = '';

                    const resizeHandle = document.createElement('div');
                    resizeHandle.className = 'resize-handle';
                    resizeHandle.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';
                    codeBox.appendChild(sharedPre);
                    codeBox.appendChild(resizeHandle); // move inside codeBox
                    snippetWrapper.appendChild(codeBox);
                    
                    box.appendChild(buttonGroup);
                    box.appendChild(snippetWrapper);

                    // ✅ Bind resize for this snippet immediately
                    const panel = sharedPre;
                    const handle = resizeHandle;
                    if (handle && panel) {
                        let isDragging = false;
                        let startY, startHeight;

                        handle.addEventListener('mousedown', e => {
                            e.preventDefault();
                            console.log('Drag started');

                            // Ensure panel is visible before resize
                            if (!panel.classList.contains('open')) {
                                panel.classList.add('open');
                            }
                            if (!panel.offsetHeight) {
                                panel.style.height = '300px';
                            }

                            isDragging = true;
                            startY = e.clientY;
                            startHeight = panel.offsetHeight;
                            document.body.style.userSelect = 'none';
                        });

                        handle.addEventListener('touchstart', e => {
                            e.preventDefault();

                            if (!panel.classList.contains('open')) {
                                panel.classList.add('open');
                            }
                            if (!panel.offsetHeight) {
                                panel.style.height = '300px';
                            }

                            isDragging = true;
                            startY = e.touches[0].clientY;
                            startHeight = panel.offsetHeight;
                        });

                        const stopDrag = () => {
                            isDragging = false;
                            document.body.style.userSelect = '';
                        };

                        window.addEventListener('mousemove', e => {
                            if (!isDragging) return;
                            const dy = e.clientY - startY;
                            const next = Math.max(120, startHeight + dy); // min height safeguard
                            panel.style.height = `${next}px`;
                        });

                        window.addEventListener('touchmove', e => {
                            if (!isDragging) return;
                            const dy = e.touches[0].clientY - startY;
                            const next = Math.max(120, startHeight + dy);
                            panel.style.height = `${next}px`;
                        });

                        window.addEventListener('mouseup', stopDrag);
                        window.addEventListener('touchend', stopDrag);
                    }
                }

                modalMedia.appendChild(box);
            });

            const links = JSON.parse(card.dataset.links || '[]');
            if (links.length > 0) {
                const linkBox = document.createElement('div');
                linkBox.className = 'modal-links';

                links.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.target = '_blank';
                    a.innerHTML = `<i class="icon brands fa-${link.icon}"></i> ${link.label}`;
                    linkBox.appendChild(a);
                });

                modalMedia.appendChild(linkBox);
            }

            modal.style.display = 'block';
        });
    });

    // Toggle snippet open/close
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
        pre.style.height = '300px';
        pre.dataset.active = button.textContent;
        pre.innerHTML = 'Loading...';

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
});