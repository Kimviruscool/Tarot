document.addEventListener('DOMContentLoaded', () => {
    const cardsGrid = document.getElementById('cardsGrid');
    const resultContainer = document.getElementById('resultContainer');
    const viewResultBtn = document.getElementById('viewResultBtn');
    const revealedCardsContainer = document.getElementById('revealedCards');
    const retryContainer = document.getElementById('retryContainer'); // Might be null now
    const retryBtn = document.getElementById('retryBtn'); // Might be null
    const interpretationContainer = document.getElementById('interpretationContainer');
    const interpText = document.getElementById('interpText');
    const titleObj = document.querySelector('.title');
    const descObj = document.querySelector('.description');

    // Total cards 0-21
    const totalCards = 22;
    const selectedCards = new Set();
    const MAX_SELECTION = 1;

    // Store fortune text data
    let fortuneData = {};
    let currentResultIndex = null;

    // Fetch and parse fortune data
    fetch('/one/today.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.trim().split('\n');
            lines.forEach(line => {
                if (!line.trim()) return;

                // Format: 0. Name/Keyword/Fortune
                // Use limit in split is not native in JS the way we want for "rest", so manual slice
                const parts = line.split('/');
                if (parts.length >= 3) {
                    // Part 0: Name (e.g., "0. The Fool")
                    const namePart = parts[0].trim();
                    const indexMatch = namePart.match(/^(\d+)\./);

                    if (indexMatch) {
                        const index = parseInt(indexMatch[1]);

                        // Part 1: Keywords
                        const keywordPart = parts[1].replace('키워드:', '').trim();

                        // Part 2+: Fortune (join back in case text contains '/')
                        let fortunePart = parts.slice(2).join('/').replace('오늘의 운세:', '').trim();
                        // Remove surrounding quotes if present
                        if (fortunePart.startsWith('"') && fortunePart.endsWith('"')) {
                            fortunePart = fortunePart.slice(1, -1);
                        }

                        fortuneData[index] = {
                            name: namePart,
                            keywords: keywordPart,
                            fortune: fortunePart
                        };
                    }
                }
            });
            console.log("Fortune data loaded:", Object.keys(fortuneData).length);
        })
        .catch(err => {
            console.error('Failed to load fortune data:', err);
            interpText.textContent = "운세 데이터를 불러오는 데 실패했습니다.";
        });

    // Generate Cards
    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.className = 'tarot-card-select';
        card.dataset.index = i;

        card.addEventListener('click', () => toggleCardSelection(card));

        cardsGrid.appendChild(card);
    }

    function toggleCardSelection(card) {
        // Prevent selection if already showed result
        if (revealedCardsContainer.style.display === 'flex') return;

        const index = card.dataset.index;

        if (selectedCards.has(index)) {
            // Deselect
            selectedCards.delete(index);
            card.classList.remove('selected');
        } else {
            // Select
            if (selectedCards.size >= MAX_SELECTION) {
                alert('1장까지만 선택할 수 있습니다.');
                return;
            }
            selectedCards.add(index);
            card.classList.add('selected');
        }

        updateUI();
    }

    function updateUI() {
        if (selectedCards.size === MAX_SELECTION) {
            resultContainer.classList.remove('hidden');
        } else {
            resultContainer.classList.add('hidden');
        }
    }

    viewResultBtn.addEventListener('click', showResults);

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    function showResults() {
        // Hide selection UI
        cardsGrid.style.display = 'none';
        resultContainer.classList.add('hidden');

        // Update text
        titleObj.textContent = "운명의 확인";
        descObj.textContent = "카드가 당신의 운명을 비추고 있습니다...";

        // Reveal container
        revealedCardsContainer.classList.remove('hidden');
        revealedCardsContainer.innerHTML = ''; // Clear previous

        // Generate 1 unique random number
        const randomCards = generateRandomCards(1, totalCards);
        const cardIndex = randomCards[0];
        currentResultIndex = cardIndex; // Store for interpretation

        const cardElements = [];

        randomCards.forEach(idx => {
            // Create Flip Card Item
            const flipCard = document.createElement('div');
            flipCard.className = 'flip-card';

            const inner = document.createElement('div');
            inner.className = 'flip-card-inner';

            const front = document.createElement('div');
            front.className = 'flip-card-front'; // Acts as card back initially

            const back = document.createElement('div');
            back.className = 'flip-card-back';
            back.style.backgroundImage = `url('/cards/${idx}.jpg')`;

            inner.appendChild(front);
            inner.appendChild(back);
            flipCard.appendChild(inner);

            revealedCardsContainer.appendChild(flipCard);
            cardElements.push(flipCard);
        });

        // Hide retry button (extra safety)
        if (retryContainer) retryContainer.classList.add('hidden');

        // Auto Flip Sequence
        cardElements.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('flipped');
            }, (index + 1) * 800); // Flip every 800ms
        });

        // Show Interpretation after all flipped (1 * 800 + wait)
        setTimeout(() => {
            showInterpretation();
        }, (cardElements.length * 800) + 500);
    }

    function showInterpretation() {
        interpretationContainer.classList.remove('hidden');
        // Trigger reflow for transition
        void interpretationContainer.offsetWidth;
        interpretationContainer.classList.add('visible');

        const data = fortuneData[currentResultIndex];

        if (data) {
            interpText.innerHTML = `
                <div style="text-align: center; word-break: keep-all;">
                    <h3 style="margin-bottom: 10px; color: #ffd700;">${data.name}</h3>
                    <p style="margin-bottom: 20px; font-size: 0.9em; color: #a0a0a0;">${data.keywords}</p>
                    <p style="line-height: 1.6;">${data.fortune}</p>
                </div>
            `;
        } else {
            // Fallback if data not loaded
            interpText.textContent = "선택하신 카드가 당신의 오늘을 비춥니다.\n\n" +
                "이 단 한 장의 카드는 현재 당신에게 가장 필요한 메시지를 담고 있습니다.\n" +
                "그림 속의 상징을 자세히 들여다보며 직관적인 영감을 얻으시기 바랍니다.\n" +
                "오늘 하루, 이 카드의 에너지가 당신과 함께할 것입니다.";
        }

        // Scroll to interpretation
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
