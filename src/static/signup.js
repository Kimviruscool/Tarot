document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        // Basic Validation
        if (!validatePhone(phone)) {
            alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
            return;
        }

        const termsCheck = document.getElementById('termsCheck');
        if (!termsCheck.checked) {
            alert('약관에 동의해야 합니다.');
            return;
        }

        // Send data to backend
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, gender, phone, email, termsAgreed: true }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('회원가입이 완료되었습니다!');
                    window.location.href = '/login';
                } else {
                    alert('가입 실패: ' + data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            });
    });

    const kakaoBtn = document.querySelector('.kakao-btn');
    kakaoBtn.addEventListener('click', () => {
        alert('카카오 회원가입 API 연동 준비 중입니다.');
    });

    // Terms Modal Logic
    const modal = document.getElementById('termsModal');
    const viewTermsBtn = document.querySelector('.view-terms-btn');
    const closeBtn = document.querySelector('.close-modal');
    const confirmBtn = document.querySelector('.modal-confirm-btn');

    viewTermsBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        // Reset scroll position and checkbox state handling
        const termsBody = document.querySelector('.terms-body');
        const termsCheck = document.getElementById('termsCheck');
        const confirmBtn = document.querySelector('.modal-confirm-btn');

        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';

        // Check if content fits without scrolling
        if (termsBody.scrollHeight <= termsBody.clientHeight) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
        }

        termsBody.addEventListener('scroll', () => {
            // Check if scrolled to bottom with some buffer
            if (termsBody.scrollTop + termsBody.clientHeight >= termsBody.scrollHeight - 10) {
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
            }
        });

        confirmBtn.onclick = () => {
            termsCheck.disabled = false;
            termsCheck.checked = true;
            modal.classList.add('hidden');
        };
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    confirmBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    function validatePhone(phone) {
        // Simple regex
        const re = /^\d{2,3}-\d{3,4}-\d{4}$/;
        return re.test(phone);
    }
});
