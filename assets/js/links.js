// assets/js/links.js
(() => {
    // Build a single badge-style link element
    function buildLinkBadge(link) {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'project-link-badge';

        // Optional icon (Font Awesome "brands" set: github, youtube, unity, etc.)
        if (link.icon) {
            const icon = document.createElement('span');
            icon.className = `icon brands fa-${link.icon}`;
            a.appendChild(icon);
        }

        const label = document.createElement('span');
        label.className = 'project-link-label';
        label.textContent = link.label || link.url;
        a.appendChild(label);

        return a;
    }

    // Render an array of link objects into a container element
    function renderLinks(container, links) {
        container.innerHTML = '';
        if (!Array.isArray(links) || links.length === 0) {
            container.innerHTML = '<span class="project-links-empty">No links available.</span>';
            return;
        }

        // Use .modal-links styling if that’s the container
        const list = document.createElement('div');
        list.className = 'project-links-list';

        links.forEach(link => {
            const badge = buildLinkBadge(link);
            list.appendChild(badge);
        });

        container.appendChild(list);
    }

    // Fetch links JSON and render into a container selector
    async function loadLinksInto(containerSelector, src) {
        const container = document.querySelector(containerSelector);
        if (!container || !src) return;

        // Ensure the container has the correct styling class
        container.classList.add('modal-links');

        container.innerHTML = 'Loading links...';
        try {
            const res = await fetch(src);
            const data = await res.json();
            renderLinks(container, data);
        } catch (err) {
            container.innerHTML = 'Failed to load links.';
        }
    }

    // Load links into the modal when a project card is clicked
    function initModalLinks() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            const linksSrc = card.dataset.linksSrc;
            // Assumes your modal contains: <div id="modalLinks" class="modal-links"></div>
            loadLinksInto('#modalLinks', linksSrc);
        });
    }

    // Optional: auto-load footer/global links if an element provides a data source
    function initFooterLinks() {
        const footerContainer = document.querySelector('#footerLinks');
        if (!footerContainer) return;

        const src = footerContainer.getAttribute('data-links-src');
        if (!src) return;

        loadLinksInto('#footerLinks', src);
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        initModalLinks();
        initFooterLinks();
    });

    // Expose helpers (optional)
    window.LinksHelpers = {loadLinksInto, renderLinks, buildLinkBadge};
})();