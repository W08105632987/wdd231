// ============================================
// ABUJA CHAMBER OF COMMERCE - JOIN PAGE JAVASCRIPT
// ============================================

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const joinForm = document.getElementById('joinForm');
const timestampField = document.getElementById('timestamp');

// ============================================
// SET TIMESTAMP ON PAGE LOAD
// ============================================

function setTimestamp() {
    const now = new Date();
    timestampField.value = now.toISOString();
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    
    // Trigger reflow to enable animation
    modal.offsetHeight;
    
    modal.classList.add('show');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.style.display = 'none';
        // Only restore scroll if no other modals are open
        if (!document.querySelector('.modal.show')) {
            document.body.style.overflow = 'auto';
        }
    }, 300);
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close menu when clicking a nav link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ============================================
// FOOTER DATE FUNCTIONS
// ============================================

function updateFooterDates() {
    // Update current year
    const currentYearSpan = document.getElementById('currentYear');
    const currentYear = new Date().getFullYear();
    if (currentYearSpan) {
        currentYearSpan.textContent = currentYear;
    }

    // Update last modified date
    const lastModifiedSpan = document.getElementById('lastModified');
    const lastModified = new Date(document.lastModified);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// ============================================
// FORM VALIDATION
// ============================================

// Add custom validation messages
const inputs = document.querySelectorAll('input[required], select[required]');
inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        if (input.validity.valueMissing) {
            input.setCustomValidity('This field is required');
        } else if (input.validity.typeMismatch) {
            input.setCustomValidity('Please enter a valid ' + input.type);
        } else if (input.validity.patternMismatch) {
            input.setCustomValidity('Please match the requested format');
        }
    });

    input.addEventListener('input', () => {
        input.setCustomValidity('');
    });
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Set timestamp when page loads
    setTimestamp();

    // Update footer dates
    updateFooterDates();

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});