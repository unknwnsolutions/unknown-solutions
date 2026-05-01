// Slides functionality for Dreamers Island presentation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const slidesOverlay = document.getElementById('slidesOverlay');
const closeSlidesBtn = document.getElementById('closeSlides');

function showSlide(n) {
    // Wrap around
    if (n >= slides.length) n = 0;
    if (n < 0) n = slides.length - 1;

    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('slide--active');
    });

    // Show target slide
    slides[n].classList.add('slide--active');
    currentSlide = n;
}

// Close slides and show homepage
function closeSlides() {
    if (slidesOverlay) {
        slidesOverlay.classList.add('hidden');
        localStorage.setItem('slidesClosed', 'true');
    }
}

// Check if slides were previously closed
function checkSlidesState() {
    const slidesClosed = localStorage.getItem('slidesClosed');
    if (slidesClosed === 'true' && slidesOverlay) {
        slidesOverlay.classList.add('hidden');
    }
}

// Initialize slides
if (slides.length > 0) {
    showSlide(0);
    checkSlidesState();
}

// Close button
if (closeSlidesBtn) {
    closeSlidesBtn.addEventListener('click', closeSlides);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!slidesOverlay || slidesOverlay.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'Escape') {
        closeSlides();
    }
});

// Prevent scrolling when slides are visible
if (slidesOverlay) {
    slidesOverlay.addEventListener('wheel', (e) => {
        if (!slidesOverlay.classList.contains('hidden')) {
            e.preventDefault();
        }
    }, { passive: false });
}