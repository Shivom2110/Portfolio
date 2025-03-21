// Intro screen and scrolling behavior
const introScreen = document.querySelector('.intro-screen');
const mainContent = document.querySelector('.main-content');
const navbar = document.getElementById('navbar');

// Show intro screen initially
document.body.style.overflow = 'auto';

// Handle scroll events
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Hide intro screen when scrolling down
    if (scrollPosition > window.innerHeight * 0.5) {
        introScreen.classList.add('hidden');
        navbar.classList.add('visible');
    } else {
        introScreen.classList.remove('hidden');
        navbar.classList.remove('visible');
    }
    
    // Additional navbar effect when scrolling further
    if (scrollPosition > window.innerHeight + 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const fadeElements = document.querySelectorAll('.fade-in');

function checkFade() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Initial check
checkFade();

// Check on scroll
window.addEventListener('scroll', checkFade);

// Allow users to click the scroll indicator to start scrolling
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Also allow clicking the logo to scroll
document.querySelector('.logo').addEventListener('click', function() {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}); 