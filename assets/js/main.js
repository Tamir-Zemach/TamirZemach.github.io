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

    // Toggle snippet visibility (for dynamically created buttons)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('snippet-toggle')) {
            const content = e.target.nextElementSibling;
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
            e.target.textContent = e.target.textContent.replace(isVisible ? '▲' : '▼', isVisible ? '▼' : '▲');
        }
    });

    // Project card click
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title || card.querySelector('h3').innerText;
            const description = card.dataset.description || card.querySelector('p').innerText;
            const mechanics = JSON.parse(card.dataset.mechanics || '[]');

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
                        button.textContent = `${snippet.title} ▼`;

                        const pre = document.createElement('pre');
                        pre.className = 'snippet-content';
                        pre.style.display = 'none';   // start hidden
                        pre.textContent = 'Loading...';

                        button.addEventListener('click', () => {
                            const isVisible = pre.style.display === 'block';
                            pre.style.display = isVisible ? 'none' : 'block';
                            button.textContent = `${snippet.title} ${isVisible ? '▼' : '▲'}`;

                            if (!pre.dataset.loaded) {
                                fetch(snippet.url)
                                    .then(res => res.text())
                                    .then(code => {
                                        pre.textContent = code;
                                        pre.dataset.loaded = true;
                                    })
                                    .catch(() => {
                                        pre.textContent = 'Failed to load script.';
                                    });
                            }
                        });

                        buttonGroup.appendChild(button);
                        buttonGroup.appendChild(pre);
                    });

                    box.appendChild(buttonGroup);
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
});