
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
    });

    // Terms Popup Logic
    const viewTermsBtn = document.querySelector('.view-terms-btn');
    const termsCheck = document.getElementById('termsCheck');

    viewTermsBtn.addEventListener('click', () => {
        // Open popup window
        const width = 600;
        const height = 800;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        window.open('/terms', 'TermsWindow', `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    });

    // Listen for message from popup
    window.addEventListener('message', (event) => {
        if (event.data === 'termsAgreed') {
            termsCheck.disabled = false;
            termsCheck.checked = true;
        }
    });

    function validatePhone(phone) {
        // Simple regex
        const re = /^\d{2,3}-\d{3,4}-\d{4}$/;
        return re.test(phone);
    }
});
