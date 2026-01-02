document.addEventListener('DOMContentLoaded', () => {
    // 3-Card Logic for Month Love (Past / Present / Future)
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

    // Cache for fortune texts (stores {name, content})
    let pastTexts = {};
    let presentTexts = {};
    let futureTexts = {};

    // Load texts on startup
    loadFortuneTexts();

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
        titleObj.textContent = "사랑의 흐름";
        descObj.textContent = "카드 3장이 사랑의 전개를 보여줍니다...";
        revealedCardsContainer.classList.remove('hidden');
        revealedCardsContainer.innerHTML = '';

        // Generate 3 unique random cards for the positions
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

    function showInterpretation(cardIndices) {
        interpretationContainer.classList.remove('hidden');
        void interpretationContainer.offsetWidth; // Trigger reflow
        interpretationContainer.classList.add('visible');

        const card1 = cardIndices[0];
        const card2 = cardIndices[1];
        const card3 = cardIndices[2];

        const data1 = pastTexts[card1] || { name: 'Unknown', content: "해석을 불러오는 중 오류가 발생했습니다." };
        const data2 = presentTexts[card2] || { name: 'Unknown', content: "해석을 불러오는 중 오류가 발생했습니다." };
        const data3 = futureTexts[card3] || { name: 'Unknown', content: "해석을 불러오는 중 오류가 발생했습니다." };

        let html = '';

        html += `<div class="result-section">`;
        html += `<div class="result-line name" style="color: #ffb7c5; margin-top:20px;">[과거: 내면의 흐름] <br> ${data1.name}</div>`;
        html += `<div class="result-line fortune">${data1.content}</div>`;
        html += `</div>`;

        html += `<div class="result-section">`;
        html += `<div class="result-line name" style="color: #ffb7c5; margin-top:20px;">[현재: 관계의 상황] <br> ${data2.name}</div>`;
        html += `<div class="result-line fortune">${data2.content}</div>`;
        html += `</div>`;

        html += `<div class="result-section">`;
        html += `<div class="result-line name" style="color: #ffb7c5; margin-top:20px;">[미래: 전망과 조언] <br> ${data3.name}</div>`;
        html += `<div class="result-line fortune">${data3.content}</div>`;
        html += `</div>`;

        interpText.innerHTML = html;

        interpretationContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function generateRandomCards(count, max) {
        const nums = new Set();
        while (nums.size < count) {
            nums.add(Math.floor(Math.random() * max));
        }
        return Array.from(nums);
    }

    async function loadFortuneTexts() {
        try {
            const [pastRes, presentRes, futureRes] = await Promise.all([
                fetch('/month/monthlove/past.txt'),
                fetch('/month/monthlove/present.txt'),
                fetch('/month/monthlove/future.txt')
            ]);

            if (pastRes.ok) pastTexts = parseTextFile(await pastRes.text());
            if (presentRes.ok) presentTexts = parseTextFile(await presentRes.text());
            if (futureRes.ok) futureTexts = parseTextFile(await futureRes.text());

        } catch (error) {
            console.error("Fortune text loading failed:", error);
        }
    }

    function parseTextFile(text) {
        const map = {};
        const lines = text.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            // Format: "0. CardName / Key: \"Content\""

            const dotIndex = line.indexOf('.');
            if (dotIndex === -1) continue;

            const indexStr = line.substring(0, dotIndex);
            const index = parseInt(indexStr, 10);
            if (isNaN(index)) continue;

            // Extract Name
            // e.g. "0. 바보 (The Fool)/과거 해석:"
            const slashIndex = line.indexOf('/');
            let name = "";
            if (slashIndex !== -1 && slashIndex > dotIndex) {
                name = line.substring(dotIndex + 1, slashIndex).trim();
            } else {
                // Fallback: take until colon
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) name = line.substring(dotIndex + 1, colonIndex).trim();
            }

            // Extract Content
            let content = "";
            const quoteStart = line.indexOf('"');
            const quoteEnd = line.lastIndexOf('"');

            if (quoteStart !== -1 && quoteEnd !== -1 && quoteEnd > quoteStart) {
                content = line.substring(quoteStart + 1, quoteEnd);
            } else {
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    content = line.substring(colonIndex + 1).trim();
                }
            }

            map[index] = { name, content };
        }
        return map;
    }
});
