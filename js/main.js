// Education module toggle
const educationToggles = document.querySelectorAll('.education-module__toggle');

educationToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);

        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        if (content) {
            content.classList.toggle('open');
        }
    });
});

// Preloader
const preloader = document.querySelector('.preloader');

window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('preloader--hidden');
            setTimeout(() => {
                preloader.remove();
            }, 800);
        }
    }, 500);
});

// Mobile menu toggle
const hamburger = document.querySelector('.header__hamburger');
const nav = document.querySelector('.header__nav');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when nav link is clicked
document.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Reset mobile menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        nav.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! This form is not yet connected to a backend. Please contact us via WhatsApp or email in the meantime.');
        contactForm.reset();
    });
}

// Intersection Observer for scroll fade-in animations
const sections = document.querySelectorAll('.section');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section--visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Make hero section visible immediately
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.classList.add('section--visible');
}