import { db } from './firebase_config.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const termsAgreed = document.getElementById('terms').checked;

            if (!termsAgreed) {
                alert('약관에 동의해주세요.');
                return;
            }

            try {
                // Check if email already exists
                const q = query(collection(db, "users"), where("userEmail", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    alert('이미 등록된 이메일입니다.');
                    return;
                }

                // Add User
                await addDoc(collection(db, "users"), {
                    userName: name,
                    userGender: gender,
                    userPhone: phone,
                    userEmail: email,
                    termsAgreed: termsAgreed,
                    stars: 1000, // Signup Bonus
                    created_at: serverTimestamp()
                });

                alert('회원가입이 완료되었습니다! 1000 Stars가 지급되었습니다.');
                window.location.href = 'login.html';

            } catch (error) {
                console.error("Error adding document: ", error);
                alert("회원가입 중 오류가 발생했습니다: " + error.message);
            }
        });
    }

    // Kakao Button (Redirect to Login as per previous logic, or implement signup flow)
    const kakaoBtn = document.querySelector('.kakao-btn');
    if (kakaoBtn) {
        kakaoBtn.addEventListener('click', () => {
            alert('카카오 회원은 로그인 페이지에서 바로 로그인하시면 됩니다.');
            window.location.href = "login.html";
        });
    }
});


// ... 기존 코드 아래에 추가 ...

// [수정됨] 약관 팝업창 띄우기
const termsBtn = document.querySelector('.view-terms-btn');
if (termsBtn) {
    termsBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // 팝업창 크기와 위치 계산 (화면 정중앙)
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        // window.open으로 팝업 띄우기
        window.open(
            '/terms',
            'TermsWindow',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
    });
}