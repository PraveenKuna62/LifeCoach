document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            const service = formData.get('service');
            const phone = formData.get('phone');

            // Basic validation
            if (!name || !email || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            showMessage('Sending your message...', 'info');

            try {
                const response = await fetch('https://formspree.io/f/mzddzavr', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        service: service,
                        message: message,
                        _subject: 'New contact request from LifeCoach website'
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showMessage('Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data && data.errors) {
                        showMessage(data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showMessage('Oops! There was a problem sending your message.', 'error');
                    }
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                showMessage('Oops! Something went wrong. Please try again later.', 'error');
            }
        });
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Video poster/play overlay logic
    const video = document.getElementById('servicesVideo');
    const poster = document.querySelector('.video-poster');

    if (video && poster) {
        const startPlay = () => {
            poster.classList.add('hidden');
            // start playback
            video.play().catch(() => {
                // play() may be blocked until user interaction; poster click should satisfy this
            });
        };

        // Clicking the poster area starts the video
        poster.addEventListener('click', startPlay);
        poster.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startPlay(); } });

        // Keep poster hidden once playback starts; do not re-show on pause/ended for a simpler layout
        video.addEventListener('play', () => poster.classList.add('hidden'));
    }
});