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

                    const sharedPre = document.createElement('pre');
                    sharedPre.id = 'snippetContent';
                    sharedPre.className = 'snippet-content';
                    sharedPre.dataset.active = '';

                    box.appendChild(buttonGroup);
                    box.appendChild(sharedPre);
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
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.snippet-toggle');
        if (!button) return;

        const pre = button.parentElement.nextElementSibling;
        const isOpen = pre.classList.contains('open') && pre.dataset.active === button.textContent;

        // Remove active class from all buttons in this group
        button.parentElement.querySelectorAll('.snippet-toggle').forEach(btn => {
            btn.classList.remove('active');
        });

        if (isOpen) {
            pre.classList.remove('open');
            pre.style.maxHeight = '0';
            pre.textContent = '';
            pre.dataset.active = '';
            return;
        }

        // Mark this button as active
        button.classList.add('active');

        pre.classList.add('open');
        pre.textContent = 'Loading...';
        pre.dataset.active = button.textContent;

        fetch(button.dataset.url)
            .then(res => res.text())
            .then(code => {
                pre.textContent = code;
                pre.style.maxHeight = pre.scrollHeight + 'px';
            })
            .catch(() => {
                pre.textContent = 'Failed to load script.';
            });
    });
});