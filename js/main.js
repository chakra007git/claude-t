// Theme toggle
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger count-up for numbers
            entry.target.querySelectorAll('.count-up').forEach(counter => {
                if (counter.dataset.counted) return;
                counter.dataset.counted = 'true';
                const target = +counter.dataset.target;
                const duration = 1200;
                const start = performance.now();
                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(ease * target);
                    if (progress < 1) requestAnimationFrame(step);
                    else counter.textContent = target;
                };
                requestAnimationFrame(step);
            });

            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
});

// Testimonials Slider
(function () {
    const slider = document.getElementById('testimonialsSlider');
    if (!slider) return;

    const track = document.getElementById('testimonialsTrack');
    const slides = track.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const total = slides.length;
    let current = 0;
    let autoplayTimer = null;

    function goTo(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener('click', function () {
        next();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', function () {
        prev();
        resetAutoplay();
    });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goTo(parseInt(this.dataset.index));
            resetAutoplay();
        });
    });

    // Autoplay
    function startAutoplay() {
        autoplayTimer = setInterval(next, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    startAutoplay();

    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next();
            else prev();
        }
        startAutoplay();
    }, { passive: true });
})();
