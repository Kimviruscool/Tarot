document.addEventListener('DOMContentLoaded', () => {
    // 3-Card Logic for Wealth
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
        titleObj.textContent = "재물의 확인";
        descObj.textContent = "카드 3장이 당신의 재물을 이야기합니다...";
        revealedCardsContainer.classList.remove('hidden');
        revealedCardsContainer.innerHTML = '';

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
            showInterpretation();
        }, (cardElements.length * 800) + 500);
    }

    function showInterpretation() {
        interpretationContainer.classList.remove('hidden');
        void interpretationContainer.offsetWidth;
        interpretationContainer.classList.add('visible');

        interpText.textContent = "금전운 흐름 (기반 / 과정 / 결과)\n\n" +
            "첫 번째 카드는 당신의 현재 재정적 기반을,\n" +
            "두 번째 카드는 돈을 버는 과정이나 기회를,\n" +
            "세 번째 카드는 그로 인한 결과나 미래의 풍요를 보여줍니다.\n" +
            "신중한 계획과 실행으로 운을 잡으세요.";

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
