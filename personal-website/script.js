// Enhanced JavaScript with better error handling, performance, and accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Utility functions
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const safeQuerySelector = (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Error selecting element: ${selector}`, error);
            return null;
        }
    };

    const safeQuerySelectorAll = (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Error selecting elements: ${selector}`, error);
            return [];
        }
    };

    // Mobile menu functionality
    const initMobileMenu = () => {
        const mobileMenuBtn = safeQuerySelector('.mobile-menu-btn');
        const navLinks = safeQuerySelector('.nav-links');
        
        if (!mobileMenuBtn || !navLinks) return;
        
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');
            
            // Toggle menu state
            navLinks.classList.toggle('active');
            
            // Update ARIA attributes
            mobileMenuBtn.setAttribute('aria-expanded', !isActive);
            navLinks.setAttribute('aria-hidden', isActive);
            
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (spans.length === 3) {
                if (!isActive) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileMenuBtn.click();
            }
        });
    };

    // Smooth scrolling with enhanced accessibility
    const initSmoothScrolling = () => {
        const scrollLinks = safeQuerySelectorAll('a[href^="#"]');
        const navLinks = safeQuerySelector('.nav-links');
        const mobileMenuBtn = safeQuerySelector('.mobile-menu-btn');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    mobileMenuBtn?.click();
                }
                
                // Scroll to target with error handling
                const targetId = this.getAttribute('href');
                const targetElement = safeQuerySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    };

    // Enhanced scroll spy with performance optimization
    const initScrollSpy = () => {
        const sections = safeQuerySelectorAll('section');
        const navLinks = safeQuerySelectorAll('.nav-links a');
        
        if (!sections.length || !navLinks.length) return;
        
        const updateActiveNavLink = debounce(() => {
            const scrollPosition = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.setAttribute('aria-current', 'false');
                        
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });
                }
            });
        }, 100);
        
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    };

    // Initialize all functionality
    const init = () => {
        try {
            initMobileMenu();
            initSmoothScrolling();
            initScrollSpy();
            
            // Update copyright year
            const yearElement = safeQuerySelector('#year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
            
            // Add loading animation
            document.body.classList.add('loaded');
            
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    };

    // Start initialization
    init();
}); 