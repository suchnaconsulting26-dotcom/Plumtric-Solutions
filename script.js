/* ================================================
   PLUMTRIC SOLUTIONS - INTERACTIVE JAVASCRIPT
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ================================================
    // NAVIGATION
    // ================================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.id = 'mobile-overlay';
        document.body.appendChild(overlay);
        return overlay;
    };

    const overlay = document.getElementById('mobile-overlay') || createOverlay();

    const toggleMenu = (show) => {
        const isActive = show !== undefined ? show : !navMenu.classList.contains('active');
        navToggle.classList.toggle('active', isActive);
        navMenu.classList.toggle('active', isActive);
        overlay.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(false));

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Active navigation link based on scroll
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ================================================
    // ANIMATED COUNTER
    // ================================================
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    };

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // ================================================
    // SCROLL ANIMATIONS
    // ================================================
    const animatedElements = document.querySelectorAll('.service-card, .why-card, .feature, .team-card');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(element);
    });

    // ================================================
    // PREMIUM SMOOTH SCROLLING
    // ================================================

    const smoothScrollTo = (targetElement) => {
        if (!targetElement) return;

        const offset = 90; // Match CSS scroll-padding-top
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    // 1. Handle anchor links on the same page
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href) return;

            // Handle links to current page sections
            const isAnchor = href.includes('#');
            const [url, hash] = href.split('#');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const targetPage = url.split('/').pop() || 'index.html';

            if (isAnchor && (targetPage === currentPage || url === '')) {
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    e.preventDefault();
                    toggleMenu(false); // Close mobile menu if open
                    smoothScrollTo(targetElement);
                    history.pushState(null, null, '#' + hash);
                }
            }
            // Handle "Scroll to top" for same-page links without hash
            else if (href === currentPage || (href === 'index.html' && currentPage === '')) {
                e.preventDefault();
                toggleMenu(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                history.pushState(null, null, window.location.pathname);
            }
        });
    });

    // 2. Handle hash on page load (Cross-page smooth scroll)
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetElement = document.getElementById(hash);

        if (targetElement) {
            window.scrollTo(0, 0);
            setTimeout(() => {
                smoothScrollTo(targetElement);
            }, 800);
        }
    }

    // ================================================
    // CONTACT FORM
    // ================================================
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');

        // Create WhatsApp message
        const whatsappMessage = encodeURIComponent(
            `*New Inquiry from Website*\n\n` +
            `*Name:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Service:* ${service}\n` +
            `*Message:* ${message || 'N/A'}`
        );

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/919316808696?text=${whatsappMessage}`, '_blank');

        // Show success message
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
        submitBtn.style.background = '#22C55E';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
    });

    // ================================================
    // PARTICLE EFFECT (Subtle Background Animation)
    // ================================================
    const particlesContainer = document.getElementById('particles');

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${Math.random() > 0.5 ? 'rgba(255, 107, 53, 0.15)' : 'rgba(30, 144, 255, 0.15)'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            pointer-events: none;
        `;
        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => particle.remove(), 20000);
    }

    // Create initial particles
    for (let i = 0; i < 15; i++) {
        setTimeout(createParticle, i * 200);
    }

    // Continuously create new particles
    setInterval(createParticle, 2000);

    // Add floating animation keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() > 0.5 ? '' : '-'}100px, -200px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ================================================
    // BUTTON RIPPLE EFFECT
    // ================================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ================================================
    // TYPING EFFECT FOR HERO (Optional Enhancement)
    // ================================================
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
    }

    // ================================================
    // PRELOADER (Brand-consistent fade-out)
    // ================================================
    window.addEventListener('load', function () {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.style.opacity = '1';

                // Remove from DOM after transition
                setTimeout(() => {
                    loader.remove();
                }, 800);
            }, 600); // 600ms minimum for brand impact
        }
    });

    console.log('🔧 Plumtric Solutions - Website Loaded Successfully');
});
