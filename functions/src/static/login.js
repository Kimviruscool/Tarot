document.addEventListener('DOMContentLoaded', () => {
    // [중요] 카카오 개발자 사이트에서 발급받은 'JavaScript 키'를 아래에 넣으세요.
    if (!Kakao.isInitialized()) {
        Kakao.init('내 카카오 키');
    }

    const kakaoBtn = document.querySelector('.kakao-btn');
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => {
            Kakao.Auth.login({
                success: function(authObj) {
                    Kakao.API.request({
                        url: '/v2/user/me',
                        success: function(res) {
                            const kakaoAccount = res.kakao_account;
                            // 이메일 저장 (결제 식별용)
                            localStorage.setItem('userEmail', kakaoAccount.email);
                            localStorage.setItem('userName', kakaoAccount.profile.nickname);

                            alert(kakaoAccount.profile.nickname + '님 환영합니다!');
                            window.location.href = '/choice'; // 메인으로 이동
                        },
                        fail: function(error) {
                            console.log(error);
                            alert('사용자 정보 요청 실패');
                        }
                    });
                },
                fail: function(err) {
                    alert('로그인 실패: ' + JSON.stringify(err));
                },
            });
        });
    }

    // 기존 이메일 로그인 폼 처리 (필요 없다면 무시 가능)
    const loginForm = document.getElementById('loginForm');
    if(loginForm){
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('지금은 카카오 로그인을 이용해주세요.');
        });
    }
});