// Build the email link from its parts, so scrapers reading the raw HTML never see the address.
(function () {
    document.querySelectorAll('.email-link').forEach(link => {
        const address = link.dataset.user + '@' + link.dataset.domain;
        link.href = 'mailto:' + address;
        link.querySelector('.email-text').textContent = address;
    });
})();

// Highlight the header tab for the section in view, and drift the background haze.
(function () {
    const tabs = Array.from(document.querySelectorAll('.tabs a'));
    const nav = document.querySelector('.tabs');
    const sections = tabs
        .map(tab => document.querySelector(tab.getAttribute('href')))
        .filter(Boolean);

    // Where the blue blob sits for each section (percent offsets of the backdrop)
    const hazeSpots = [
        [0, 0], [-8, 6], [6, -6], [-6, -4], [8, 6], [-4, 8], [4, -2]
    ];

    function activate(index) {
        tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));

        // Keep the active tab visible when the tab bar scrolls sideways (phones)
        const tab = tabs[index];
        const left = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2;
        nav.scrollTo({ left: left, behavior: 'smooth' });

        // Section colors live in style.css, keyed by this attribute
        document.documentElement.dataset.section = sections[index].id;

        const spot = hazeSpots[index % hazeSpots.length];
        document.documentElement.style.setProperty('--haze-x', spot[0] + '%');
        document.documentElement.style.setProperty('--haze-y', spot[1] + '%');
    }

    // A section is "current" when it crosses a line ~40% down the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activate(sections.indexOf(entry.target));
            }
        });
    }, { rootMargin: '-40% 0px -59% 0px' });

    sections.forEach(section => observer.observe(section));

    // The last section may be too short to reach that line, so pick it at the page bottom
    window.addEventListener('scroll', () => {
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) activate(sections.length - 1);
    }, { passive: true });
    activate(0);
})();
