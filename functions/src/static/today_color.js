document.addEventListener('DOMContentLoaded', () => {
    // Logic mostly identical, text updated
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
        titleObj.textContent = "컬러 확인";
        descObj.textContent = "행운의 색이 나타납니다...";
        revealedCardsContainer.classList.remove('hidden');
        revealedCardsContainer.innerHTML = '';

        const randomCards = generateRandomCards(1, totalCards);
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

        interpText.textContent = "오늘의 행운 컬러입니다.\n\n" +
            "선택하신 카드의 에너지는 당신에게 활력과 안정을 주는 색상과 연결되어 있습니다.\n" +
            "이 컬러를 옷이나 소품에 활용하면 긍정적인 기운을 얻을 수 있을 것입니다.\n" +
            "자신의 감각을 믿고 하루를 다채롭게 채워보세요.";

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
