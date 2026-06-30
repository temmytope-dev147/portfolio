// main.js - Interactive and engaging JavaScript for portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Typed.js for animated typing effect
    if (window.Typed) {
        new Typed('#typed-text', {
            strings: [
                "Quadri Temmytope",
                "Full Stack Developer",
                "UI/UX Designer",
                "App Developer",
                "Let's Build Your Project!"
            ],
            typeSpeed: 60,
            backSpeed: 30,
            backDelay: 1800,
            loop: true
        });
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');

    window.toggleMobile = function() {
        // Use the 'open' class to match CSS (.mobile-menu.open and .hamburger.open)
        if (mobileMenu) mobileMenu.classList.toggle('open');
        if (hamburger) hamburger.classList.toggle('open');
    };
    window.closeMobile = function() {
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
    };

    // Close mobile menu on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window.closeMobile();
    });

    // Custom cursor
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    if (cursorDot && cursorRing) {
        document.addEventListener('mousemove', function(e) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top = e.clientY + 'px';
        });

        // Add hover behaviour for interactive elements to enlarge the ring
        ['a', 'button', '.btn', '.work-card', '.service-card', '.project-card'].forEach(selector => {
            document.addEventListener('mouseover', function(ev) {
                if (ev.target.closest && ev.target.closest(selector)) {
                    document.body.classList.add('cursor-hover');
                }
            });
            document.addEventListener('mouseout', function(ev) {
                if (ev.target.closest && ev.target.closest(selector)) {
                    document.body.classList.remove('cursor-hover');
                }
            });
        });
    }

    // Reveal animations
    const reveals = document.querySelectorAll('.reveal');
    function revealOnScroll() {
        for (const el of reveals) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Skill bar animation
    document.querySelectorAll('.skill-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) bar.style.width = width;
    });

    // Tabs in About section
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('tab-' + btn.dataset.tab);
            if (panel) panel.classList.add('active');
        };
    });

    // Testimonial slider
    const testimonialTrack = document.getElementById('testimonialTrack');
    if (testimonialTrack) {
        const testimonialItems = testimonialTrack.querySelectorAll('.testimonial-item');
        let testimonialIndex = 0;
        function showTestimonial(idx) {
            testimonialItems.forEach((item, i) => item.classList.toggle('active', i === idx));
        }
        const prevBtn = document.querySelector('.t-prev');
        const nextBtn = document.querySelector('.t-next');
        if (prevBtn) prevBtn.onclick = function() {
            testimonialIndex = (testimonialIndex - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(testimonialIndex);
        };
        if (nextBtn) nextBtn.onclick = function() {
            testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
            showTestimonial(testimonialIndex);
        };
        showTestimonial(testimonialIndex);
    }

    // Dynamic year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Contact form — submits to the /api/send endpoint on this same server
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.onsubmit = async function(e) {
            e.preventDefault();
            const status = document.getElementById('formStatus');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            const payload = {
                name: document.getElementById('inputName').value.trim(),
                email: document.getElementById('inputEmail').value.trim(),
                subject: document.getElementById('inputSubject').value.trim(),
                message: document.getElementById('inputMessage').value.trim()
            };

            if (!payload.name || !payload.email || !payload.message) {
                if (status) {
                    status.textContent = 'Please fill in your name, email, and message.';
                    status.className = 'form-status error';
                }
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            if (status) {
                status.textContent = 'Sending...';
                status.className = 'form-status';
            }

            try {
                const res = await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    if (status) {
                        status.textContent = 'Thank you for reaching out! I will get back to you soon.';
                        status.className = 'form-status success';
                    }
                    contactForm.reset();
                } else {
                    if (status) {
                        status.textContent = data.error || 'Something went wrong. Please email me directly instead.';
                        status.className = 'form-status error';
                    }
                }
            } catch (err) {
                if (status) {
                    status.textContent = 'Network error. Please email me directly instead.';
                    status.className = 'form-status error';
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        };
    }
});
