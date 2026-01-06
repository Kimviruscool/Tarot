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

function payBokchae(pgProvider) {
    if (!window.IMP) return;

    const IMP = window.IMP;
    // [본인의 가맹점 식별코드로 교체하세요]
    IMP.init("impXXXXXXXX");

    IMP.request_pay({
        pg: pgProvider,
        pay_method: "card",
        merchant_uid: "bokchae_" + new Date().getTime(),
        name: "미스틱 타로 복채",
        amount: 3000,
    }, function (rsp) {
        if (rsp.success) {
            // 서버 검증 요청
            fetch("/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imp_uid: rsp.imp_uid,
                    merchant_uid: rsp.merchant_uid
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    alert("따뜻한 복채 감사합니다. 운명의 길에 행운이 가득하시길.");
                }
            });
        } else {
            alert("결제 실패: " + rsp.error_msg);
        }
    });
}