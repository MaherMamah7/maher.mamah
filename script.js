// ===== Light / Dark Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

function syncIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon', theme === 'light');
    icon.classList.toggle('fa-sun', theme === 'dark');
}
syncIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        syncIcon(next);
    });
}

// ===== Navbar scroll border =====
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ===== Mobile menu =====
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ===== BibTeX toggle (publications page) =====
document.querySelectorAll('.bibtex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const entry = btn.closest('.pub-entry');
        const block = entry && entry.querySelector('.bibtex-block');
        if (block) block.classList.toggle('open');
    });
});

// ===== University logo fallback (show monogram if image fails) =====
document.querySelectorAll('.edu-logo-img').forEach(img => {
    img.addEventListener('error', () => {
        const badge = img.closest('.edu-logo');
        if (!badge) return;
        img.remove();
        badge.classList.add('fallback');
        badge.textContent = badge.getAttribute('data-monogram') || '';
    });
});
