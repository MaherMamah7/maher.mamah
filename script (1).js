// Ensure DOM is ready before wiring interactions
document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
        AOS.init({ once: true });
    }

    // == Mobile Navbar Toggle ==
    // On small screens the menu icon is shown; this toggles the nav links.
    const navEl = document.getElementById('navbar');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinkEls = document.querySelectorAll('.nav-links a');

    if (menuBtn && navEl) {
        const toggleMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            navEl.classList.toggle('open');
        };

        // Some mobile browsers are finicky: bind both click + touchend
        menuBtn.addEventListener('click', toggleMenu);
        menuBtn.addEventListener('touchend', toggleMenu, { passive: false });

        // Close the menu after tapping a link (mobile UX)
        navLinkEls.forEach((a) => {
            a.addEventListener('click', () => navEl.classList.remove('open'));
            a.addEventListener('touchend', () => navEl.classList.remove('open'), { passive: true });
        });

        // Tap outside closes the menu
        document.addEventListener('click', () => navEl.classList.remove('open'));
        document.addEventListener('touchstart', () => navEl.classList.remove('open'), { passive: true });

        // Prevent taps inside the dropdown from bubbling and closing immediately
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer) {
            navLinksContainer.addEventListener('click', (e) => e.stopPropagation());
            navLinksContainer.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }
    }
});

// == Custom Cursor Logic ==
// Disable on touch devices (prevents odd tap behavior + improves performance)
const isTouch = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .btn');

if (isTouch) {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
} else {

    document.addEventListener('mousemove', (e) => {
        if (!cursor || !follower) return;
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        follower.animate({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        }, { duration: 500, fill: "forwards" });
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!cursor || !follower) return;
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(2)';
            follower.style.borderColor = 'transparent';
            follower.style.background = 'rgba(198, 168, 124, 0.1)';
        });
        link.addEventListener('mouseleave', () => {
            if (!cursor || !follower) return;
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = '#c6a87c';
            follower.style.background = 'transparent';
        });
    });
}

// == Navbar Scroll Effect ==
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// == Lattice Background Animation (Canvas) ==
const canvas = document.getElementById('lattice-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 0.4) - 0.2; 
        this.directionY = (Math.random() * 0.4) - 0.2;
        this.size = Math.random() * 2 + 1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#c6a87c'; 
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000; 
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(198, 168, 124,' + opacityValue * 0.15 + ')'; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();