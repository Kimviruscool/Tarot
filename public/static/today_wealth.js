document.addEventListener('DOMContentLoaded', () => {
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
    const MAX_SELECTION = 1;
    let cardData = [];

    // Load card data
    loadCardData();

    async function loadCardData() {
        try {
            const response = await fetch('/one/cash.txt');
            if (!response.ok) throw new Error('Network response was not ok');
            const text = await response.text();

            // Parse lines
            const lines = text.trim().split('\n');
            cardData = lines.map(line => {
                // Format: Name/Keyword/Interpretation/Tip
                const parts = line.split('/');
                if (parts.length >= 4) {
                    return {
                        name: parts[0].trim(),
                        keyword: parts[1].replace('키워드:', '').trim(),
                        interpretation: parts[2].replace('해석:', '').trim().replace(/^"|"$/g, ''),
                        tip: parts[3].replace('Tip:', '').trim().replace(/^"|"$/g, '')
                    };
                }
                return null;
            }).filter(item => item !== null);

        } catch (error) {
            console.error('Failed to load card data:', error);
        }
    }

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
                alert('1장까지만 선택할 수 있습니다.');
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
        titleObj.textContent = "재물의 확인";
        descObj.textContent = "카드 1장이 당신의 재물을 이야기합니다...";
        revealedCardsContainer.classList.remove('hidden');
        revealedCardsContainer.innerHTML = '';

        const randomCards = generateRandomCards(1, totalCards);
        const selectedCardIndex = randomCards[0];
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
            showInterpretation(selectedCardIndex);
        }, (cardElements.length * 800) + 500);
    }

    function showInterpretation(cardIndex) {
        interpretationContainer.classList.remove('hidden');
        void interpretationContainer.offsetWidth; // Trigger reflow
        interpretationContainer.classList.add('visible');

        const data = cardData[cardIndex];

        if (data) {
            interpText.innerHTML = `
                <div class="result-line name">${data.name}</div>
                <div class="result-line keyword"><span class="label">Key:</span> ${data.keyword}</div>
                <div class="result-line interpretation">${data.interpretation}</div>
                <div class="result-line tip"><span class="tip-icon">$</span> ${data.tip}</div>
            `;
        } else {
            interpText.textContent = "결과를 불러오는 중 오류가 발생했습니다.";
        }

        interpretationContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function generateRandomCards(count, max) {
        const nums = new Set();
        while (nums.size < count) {
            nums.add(Math.floor(Math.random() * max));
        }
        return Array.from(nums);
    }
});
