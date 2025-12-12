document.addEventListener('DOMContentLoaded', () => {
    const cardCircle = document.getElementById('cardCircle');
    const totalCards = 22; // Cards 0 to 21
    const radius = 600; // Radius of the 3D circle

    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.className = 'tarot-bg-card';

        // Image path corresponds to the new route we added
        // Assuming images are named 0.jpg, 1.jpg, ...
        card.style.backgroundImage = `url('/cards/${i}.jpg')`;

        // Calculate angle for placement
        const angle = (360 / totalCards) * i;

        // Position card in 3D space
        // rotateY distributes them in a circle facing the center
        // translateZ pushes them out to the radius
        card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

        cardCircle.appendChild(card);
    }
});
