document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Mock Login
        console.log('Login attempt:', email);
        alert('로그인 기능은 아직 서버와 연결되지 않았습니다.');
        // window.location.href = '/'; 
    });

    const kakaoBtn = document.querySelector('.kakao-btn');
    kakaoBtn.addEventListener('click', () => {
        alert('카카오 로그인 API 연동 준비 중입니다.');
    });
});
