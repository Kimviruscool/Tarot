document.addEventListener('DOMContentLoaded', () => {
    // 3-Card Logic for Month Fortune
    const cardsGrid = document.getElementById('cardsGrid');
    const resultContainer = document.getElementById('resultContainer');
    const viewResultBtn = document.getElementById('viewResultBtn');
    const revealedCardsContainer = document.getElementById('revealedCards');
    const interpretationContainer = document.getElementById('interpretationContainer');
    const interpText = document.getElementById('interpText');
    const titleObj = document.querySelector('.title');
    const descObj = document.querySelector('.description');

    const totalCards = 22;
    const selectedCards = new Set();
    const MAX_SELECTION = 3;

    // Store loaded interpretations
    let fortuneData = {
        past: {},
        present: {},
        future: {}
    };

    // Load all fortune data on page load
    Promise.all([
        loadFortuneData('month/monthfortune/past.txt', 'past'),
        loadFortuneData('month/monthfortune/present.txt', 'present'),
        loadFortuneData('month/monthfortune/future.txt', 'future')
    ]).then(() => {
        console.log('All fortune data loaded');
    }).catch(err => {
        console.error('Failed to load fortune data:', err);
    });

    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.className = 'tarot-card-select';
        card.dataset.index = i;
        card.addEventListener('click', () => toggleCardSelection(card));
        cardsGrid.appendChild(card);
    }

    function toggleCardSelection(card) {
        if (revealedCardsContainer.style.display === 'flex') return;
        const index = card.dataset.index;
        if (selectedCards.has(index)) {
            selectedCards.delete(index);
            card.classList.remove('selected');
        } else {
            if (selectedCards.size >= MAX_SELECTION) {
                alert('3장까지만 선택할 수 있습니다.');
                return;
            }
            selectedCards.add(index);
            card.classList.add('selected');
        }
        if (selectedCards.size === MAX_SELECTION) {
            resultContainer.classList.remove('hidden');
        } else {
            resultContainer.classList.add('hidden');
        }
    }

    viewResultBtn.addEventListener('click', showResults);

    function showResults() {
        cardsGrid.style.display = 'none';
        resultContainer.classList.add('hidden');
        titleObj.textContent = "이번 달의 운세";
        descObj.textContent = "카드 3장이 이달의 흐름을 보여줍니다...";
        revealedCardsContainer.classList.remove('hidden');
        revealedCardsContainer.innerHTML = '';

        // Use the actual generated random cards logic or strictly use user selection?
        // The previous logic generated random cards regardless of selection. 
        // Typically user selection is visual, and the "tarot" is random "shuffle" behind the scenes, 
        // OR the user's specific choice matters. 
        // Given the prompt "First selected card..., Second selected card...", 
        // it implies using the order of selection?
        // But the previous code logic was `generateRandomCards`.
        // However, usually online tarot acts as: User picks 3 -> these 3 are revealed.
        // Let's use the random approach as per the existing code's implication of "shuffling",
        // BUT to be more "authentic" to the "pick", let's map the user's *selection slots* to random values 
        // OR just assume the user "picked" them and that IS the result.
        // Most simple apps: The user clicked card X, Y, Z. But are those X, Y, Z specific images?
        // In the grid `dataset.index = i`. So card 0 is Fool, card 1 Magician etc?
        // If the grid is just "Card Backs" then we assign meaning NOW.
        // If the grid was "Face Up" (it wasn't), then it's fixed.
        // The grid is "tarot-card-select" which usually has a back image.
        // So we should GENERATE 3 random cards to assign to the 3 "slots" the user picked.

        const randomCards = generateRandomCards(3, totalCards);
        const cardElements = [];

        randomCards.forEach(cardIndex => {
            const flipCard = document.createElement('div');
            flipCard.className = 'flip-card';
            const inner = document.createElement('div');
            inner.className = 'flip-card-inner';
            const front = document.createElement('div');
            front.className = 'flip-card-front';
            const back = document.createElement('div');
            back.className = 'flip-card-back';
            back.style.backgroundImage = `url('/cards/${cardIndex}.jpg')`;
            inner.appendChild(front);
            inner.appendChild(back);
            flipCard.appendChild(inner);
            revealedCardsContainer.appendChild(flipCard);
            cardElements.push(flipCard);
        });

        cardElements.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flipped');
            }, (index + 1) * 800);
        });

        setTimeout(() => {
            showInterpretation(randomCards);
        }, (cardElements.length * 800) + 500);
    }

    function showInterpretation(cards) {
        interpretationContainer.classList.remove('hidden');
        void interpretationContainer.offsetWidth;
        interpretationContainer.classList.add('visible');

        // cards is [cardIndex1, cardIndex2, cardIndex3]
        const pastCard = cards[0];
        const presentCard = cards[1];
        const futureCard = cards[2];

        // Retrieve text
        const pastRaw = fortuneData.past[pastCard] || "내용을 불러올 수 없습니다.";
        const presentRaw = fortuneData.present[presentCard] || "내용을 불러올 수 없습니다.";
        const futureRaw = fortuneData.future[futureCard] || "내용을 불러올 수 없습니다.";

        let htmlContent = '';

        htmlContent += createFortuneSection("과거의 메시지", pastRaw);
        htmlContent += createFortuneSection("현재의 메시지", presentRaw);
        htmlContent += createFortuneSection("미래의 메시지", futureRaw);

        interpText.innerHTML = htmlContent;

        interpretationContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function createFortuneSection(title, rawText) {
        // Expected format: "Number. Name (English Name): Interpretation"
        // We want to split out Name and Interpretation.
        let name = "";
        let desc = rawText;

        const colonIndex = rawText.indexOf(':');
        if (colonIndex !== -1) {
            name = rawText.substring(0, colonIndex).trim();
            desc = rawText.substring(colonIndex + 1).trim();
        } else {
            // Fallback if no colon
            name = rawText;
            desc = "";
        }

        return `
            <div class="result-card">
                <div class="section-title">${title}</div>
                <div class="result-line name">${name}</div>
                <div class="result-line interpretation">${desc}</div>
            </div>
        `;
    }

    //Removed helper function getCardName as it is no longer used.


    function generateRandomCards(count, max) {
        const nums = new Set();
        while (nums.size < count) {
            nums.add(Math.floor(Math.random() * max));
        }
        return Array.from(nums);
    }

    async function loadFortuneData(url, key) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            parseFortuneText(text, key);
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    }

    function parseFortuneText(text, key) {
        const lines = text.split('\n');
        lines.forEach(line => {
            if (!line.trim()) return;
            // Assuming format "0. Name: Description" or similar where it starts with number
            const match = line.match(/^(\d+)\./);
            if (match) {
                const cardIndex = parseInt(match[1], 10);
                fortuneData[key][cardIndex] = line.trim();
            }
        });
    }
});
