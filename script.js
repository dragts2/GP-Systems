// Grand Pine Systems - Website JavaScript

(function() {
    'use strict';

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add stronger shadow on scroll
        if (currentScroll > 10) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
        }
        
        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all feature cards and benefit items
    document.querySelectorAll('.feature-card, .benefit-item, .use-case').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Stats counter animation
    function animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('%')) {
                        const value = parseInt(text);
                        stat.textContent = '0%';
                        animateCounter(stat, 0, value, 1500);
                        setTimeout(() => {
                            stat.textContent = text; // Restore original text
                        }, 1500);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Mobile menu toggle (for future enhancement)
    const createMobileMenu = () => {
        const navLinks = document.querySelector('.nav-links');
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.innerHTML = '☰';
        menuButton.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0.5rem;
        `;

        // Show menu button on mobile
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                menuButton.style.display = 'block';
            } else {
                menuButton.style.display = 'none';
            }
        };

        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const navbar = document.querySelector('.nav-wrapper');
        navbar.appendChild(menuButton);
    };

    // Initialize mobile menu
    createMobileMenu();

    // Form validation (for future contact form)
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Track CTA button clicks
    document.querySelectorAll('.btn-primary, .btn-whatsapp').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('CTA clicked:', e.target.textContent.trim());
        });
    });

    // Performance: Lazy load images (if any are added in the future)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add visual feedback for interactive elements
    document.querySelectorAll('.feature-card, .use-case, .benefit-item').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Console branding
    console.log('%cGrand Pine Systems', 'color: #2f3819; font-size: 24px; font-weight: bold;');
    console.log('%cModern ERP Solutions for Lebanese Businesses', 'color: #6c757d; font-size: 14px;');
    console.log('%cInterested in joining our team? Email us at careers@grandpinesystems.com', 'color: #17a2b8; font-size: 12px;');

})();
