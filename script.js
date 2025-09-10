// Level Craft Business Consulting - Adaptive Theme JavaScript

// Theme management
let currentTheme = 'dark'; // 'light', 'dark' (dark is default)

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
    initializeAnimations();
});

// Theme initialization
function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('levelCraftTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(savedTheme);
    } else {
        // Default to dark mode
        currentTheme = 'dark';
        applyTheme('dark');
    }
    
    updateThemeToggleButton();
}

// Apply theme to the document
function applyTheme(theme) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-mode', 'dark-mode');
    
    if (theme === 'light') {
        body.classList.add('light-mode');
    } else if (theme === 'dark') {
        body.classList.add('dark-mode');
    }
    // Dark mode is default (no class needed)
}

// Toggle theme function
function toggleTheme() {
    const themes = ['dark', 'light'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];
    
    applyTheme(currentTheme);
    localStorage.setItem('levelCraftTheme', currentTheme);
    updateThemeToggleButton();
}

// Update theme toggle button appearance
function updateThemeToggleButton() {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (!sunIcon || !moonIcon) return;
    
    // Show sun icon when in dark mode (to switch to light)
    // Show moon icon when in light mode (to switch to dark)
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Listen for system theme changes
function setupEventListeners() {
    // No system theme listening needed since we use manual toggle only
}

// Mobile menu functionality for animated menu
function setupAnimatedMobileMenu() {
    const nav = document.querySelector('nav');
    const menu = document.querySelector('#menu');
    const menuToggle = document.querySelector('.nav__toggle');
    let isMenuOpen = false;

    if (!nav || !menu || !menuToggle) return;

    // Toggle menu active state
    menuToggle.addEventListener('click', e => {
        e.preventDefault();
        isMenuOpen = !isMenuOpen;
        
        // Toggle a11y attributes and active class
        menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
        menu.hidden = !isMenuOpen;
        nav.classList.toggle('nav--open');
    });

    // Trap tab inside nav when open
    nav.addEventListener('keydown', e => {
        // Abort if menu isn't open or modifier keys are pressed
        if (!isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }
        
        // Listen for tab press and move focus
        // if we're on either end of the navigation
        const menuLinks = menu.querySelectorAll('.nav__link');
        if (e.keyCode === 9) {
            if (e.shiftKey) {
                if (document.activeElement === menuLinks[0]) {
                    menuToggle.focus();
                    e.preventDefault();
                }
            } else if (document.activeElement === menuToggle) {
                menuLinks[0].focus();
                e.preventDefault();
            }
        }
    });

    // Close menu when clicking on links
    const menuLinks = menu.querySelectorAll('.nav__link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            isMenuOpen = false;
            menuToggle.setAttribute('aria-expanded', 'false');
            menu.hidden = true;
            nav.classList.remove('nav--open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !nav.contains(e.target)) {
            isMenuOpen = false;
            menuToggle.setAttribute('aria-expanded', 'false');
            menu.hidden = true;
            nav.classList.remove('nav--open');
        }
    });
}
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);
    
    // Observe elements with loading class
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => observer.observe(el));
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element comes into view
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.getElementById('home');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// Form validation and Formspree integration
function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitBtn = document.getElementById('submit-btn');
        const formMessages = document.getElementById('form-messages');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
        
        // Basic validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Submit to Formspree
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showFormMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Schedule Free Consultation';
        });
    });
}

// Show form messages
function showFormMessage(message, type) {
    const formMessages = document.getElementById('form-messages');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Hide both messages first
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // Show the appropriate message
    if (type === 'success') {
        successMessage.querySelector('strong').nextSibling.textContent = message;
        successMessage.classList.remove('hidden');
    } else {
        errorMessage.querySelector('strong').nextSibling.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    // Show the messages container
    formMessages.classList.remove('hidden');
    
    // Scroll to messages
    formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: var(--bg-dark);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Setup animated mobile menu
function setupAnimatedMobileMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const nav = document.querySelector('nav');
    
    if (!navToggle || !navMenu || !nav) return;
    
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isOpen = nav.classList.contains('nav--open');
        
        if (isOpen) {
            nav.classList.remove('nav--open');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('hidden', '');
        } else {
            nav.classList.add('nav--open');
            navToggle.setAttribute('aria-expanded', 'true');
            navMenu.removeAttribute('hidden');
            navMenu.focus();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && nav.classList.contains('nav--open')) {
            nav.classList.remove('nav--open');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('hidden', '');
        }
    });
    
    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
            nav.classList.remove('nav--open');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('hidden', '');
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
    setupAnimatedMobileMenu();
    initializeAnimations();
    initParallax();
    setupFormValidation();
});

// Expose functions globally
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
};
