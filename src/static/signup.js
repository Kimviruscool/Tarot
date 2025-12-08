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

        console.log('Signup:', { name, gender, phone, email });
        alert('회원가입이 완료되었습니다! (Demo)');
        window.location.href = '/login';
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
