// Smooth scroll function
function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuart(progress);
        window.scrollTo({
            top: startPosition + distance * ease,
            behavior: 'auto'
        });
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Handle navigation clicks
document.querySelectorAll('nav a, .scroll-indicator').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target, 2000);
    });
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
            entry.target.classList.add('visible');
            // Remove observer after element is visible
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Function to start observing elements
function startObserving() {
    // Observe sections and their content
    document.querySelectorAll('section').forEach(section => {
        // Add fade-in to section
        section.classList.add('fade-in');
        observer.observe(section);

        // Add fade-in to section content
        const content = section.querySelector('.container');
        if (content) {
            content.classList.add('fade-in');
            observer.observe(content);
        }
    });

    // Observe about content specifically
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.classList.add('fade-in');
        observer.observe(aboutContent);

        // Handle about text and skills container separately
        const aboutText = aboutContent.querySelector('.about-text');
        const skillsContainer = aboutContent.querySelector('.skills-container');
        
        if (aboutText) {
            aboutText.classList.add('fade-in');
            observer.observe(aboutText);
        }
        
        if (skillsContainer) {
            skillsContainer.classList.add('fade-in');
            observer.observe(skillsContainer);
        }
    }

    // Observe section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('fade-in');
        observer.observe(title);
    });

    // Observe individual elements with staggered delay
    document.querySelectorAll('.skill-card, .job-content, .project-card, .contact-item').forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });

    // Special handling for experience timeline
    const timeline = document.querySelector('.experience-timeline');
    if (timeline) {
        timeline.classList.add('fade-in');
        observer.observe(timeline);
        
        // Observe job items with delay
        document.querySelectorAll('.job').forEach((job, index) => {
            job.classList.add('fade-in');
            job.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(job);
        });
    }

    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = index % 2 === 0 
            ? 'translateX(-100px)' 
            : 'translateX(100px)';
        
        // Create intersection observer for each card
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animate card when it comes into view
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                        cardObserver.unobserve(entry.target);
                        
                        // Add hover effect after card is visible
                        entry.target.addEventListener('mousemove', (e) => {
                            const rect = entry.target.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            
                            const xPercent = ((x / rect.width) - 0.5) * 20;
                            const yPercent = ((y / rect.height) - 0.5) * 20;
                            
                            entry.target.style.transform = `
                                translateY(-10px)
                                rotateX(${-yPercent}deg)
                                rotateY(${xPercent}deg)
                                scale(1.02)
                            `;
                        });
                        
                        entry.target.addEventListener('mouseleave', () => {
                            entry.target.style.transform = 'translateX(0)';
                        });
                    }
                });
            },
            { threshold: 0.2 }
        );
        
        cardObserver.observe(card);
    });
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Auto-hide intro screen after 1.5 seconds
    setTimeout(() => {
        const introScreen = document.querySelector('.intro-screen');
        if (introScreen) {
            introScreen.classList.add('hidden');
            // Start observing elements after intro screen is hidden
            setTimeout(startObserving, 500);
        }
    }, 1500);

    // Show navbar initially
    const navbar = document.querySelector('nav');
    if (navbar) {
        navbar.classList.add('visible');
    }
});

// Handle scroll events for navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.querySelector('nav');
    
    if (navbar) {
        if (currentScroll > 50) {
            navbar.classList.add('visible');
            navbar.classList.add('scrolled');
            if (currentScroll > lastScroll) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
    }
    
    lastScroll = currentScroll;
});

// Parallax effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width - 0.5) * 20;
        const yPercent = (y / rect.height - 0.5) * 20;
        
        card.querySelector('.project-content').style.transform = 
            `translateZ(20px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.project-content').style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
    });
}); 