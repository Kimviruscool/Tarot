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


async function payBokchae(pgProvider) {
    console.log("결제 시작:", pgProvider);
    if (!window.IMP) return;
    const response = await fetch('/api/config');
    console.log(response)
    try {
        //서버에서 식별 코드 호출
        const response = await fetch('/api/config');
        const config = await response.json();

        const IMP = window.IMP;
        // 서버에서 받아온 식별코드 초기화
        IMP.init(config.portone_mid);

        let pgCode = "";

        if (pgProvider === 'kakaopay') {
            pgCode = "kakaopay.TC0ONETIME";
        } else if (pgProvider === 'tosspay') {
            pgCode = "tosspayments.iamporttest_3";
        }

        IMP.request_pay({
            pg: pgCode,
            pay_method: "card",
            merchant_uid: "bokchae_" + new Date().getTime(),
            name: "미스틱 타로 복채",
            amount: 1000,
        }, function (rsp) {
            if (rsp.success) {
                // 결제 성공 시 서버 검증 로직 실행
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
    } catch (error) {
        console.error("설정 로드 중 오류 발생:", error);
    }
}