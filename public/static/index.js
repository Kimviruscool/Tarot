document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
});

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(255, 215, 0, ' + (Math.random() * 0.5 + 0.2) + ')';
    particle.style.borderRadius = '50%';

    // Random starting position
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;

    particle.style.left = startX + '%';
    particle.style.top = startY + '%';

    // Random animation duration and delay
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;

    particle.style.transition = `all ${duration}s linear`;
    container.appendChild(particle);

    // Animate
    setTimeout(() => {
        animateParticle(particle);
    }, 100);
}

function animateParticle(particle) {
    setInterval(() => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random();

        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.opacity = opacity;
    }, Math.random() * 5000 + 3000);
}
