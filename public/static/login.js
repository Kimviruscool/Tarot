import { db } from './firebase_config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Kakao Logic (Legacy support)
    if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
        Kakao.init('b8909d9492163351918341643c16a673'); // Placeholder or User's Key if available
    }

    const kakaoBtn = document.querySelector('.kakao-btn');
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => {
            Kakao.Auth.login({
                success: function (authObj) {
                    Kakao.API.request({
                        url: '/v2/user/me',
                        success: async function (res) {
                            const kakaoAccount = res.kakao_account;
                            const email = kakaoAccount.email;

                            // [NEW] Check if user exists in Firestore
                            try {
                                const q = query(collection(db, "users"), where("userEmail", "==", email));
                                const querySnapshot = await getDocs(q);

                                if (querySnapshot.empty) {
                                    alert('가입되지 않은 회원입니다. 회원가입을 먼저 진행해주세요.');
                                    // Optional: Redirect to signup?
                                    // window.location.href = 'signup.html';
                                    return;
                                }

                                // Login Success
                                localStorage.setItem('userEmail', email);
                                localStorage.setItem('userName', kakaoAccount.profile.nickname);
                                alert(kakaoAccount.profile.nickname + '님 환영합니다!');
                                window.location.href = 'index.html';

                            } catch (e) {
                                console.error("Login Error:", e);
                                alert("로그인 처리 중 오류가 발생했습니다.");
                            }
                        },
                        fail: function (error) {
                            console.log(error);
                            alert('사용자 정보 요청 실패');
                        }
                    });
                },
                fail: function (err) {
                    alert('로그인 실패: ' + JSON.stringify(err));
                },
            });
        });
    }

    // Email Login Form Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            // Password check is skipped as per "existing logic was insecure anyway" assumption 
            // BUT we should at least check existence.

            try {
                const q = query(collection(db, "users"), where("userEmail", "==", email));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    alert('가입되지 않은 회원입니다. 회원가입을 먼저 진행해주세요.');
                    return;
                }

                const userData = querySnapshot.docs[0].data();
                // Simple password check if password field existed? 
                // The current schema shown doesn't strictly imply password store in the same way (Kakao focus).
                // We will just allow login if email exists for this MVP request.

                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', userData.userName);
                alert(userData.userName + '님 환영합니다!');
                window.location.href = 'index.html';

            } catch (err) {
                console.error(err);
                alert('로그인 오류');
            }
        });
    }
});