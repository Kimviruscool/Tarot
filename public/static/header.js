document.addEventListener('DOMContentLoaded', () => {
    // 로컬 스토리지에서 정보 가져오기
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    // 요소 선택
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const userNameDisplay = document.getElementById('user-name-display');
    const logoutBtn = document.getElementById('logout-btn');
    const headerElement = document.getElementById('mainHeader');

    // 홈 URL 가져오기 (HTML 데이터 속성에서)
    const homeUrl = headerElement ? headerElement.dataset.homeUrl : '/';

    // 로그인 상태에 따라 UI 전환
    if (userEmail) {
        // 로그인 상태
        if (guestMenu) guestMenu.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userNameDisplay && userName) userNameDisplay.textContent = userName + '님';
    } else {
        // 비로그인 상태
        if (guestMenu) guestMenu.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }

    // 로그아웃 처리
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // 정보 삭제
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');

            alert('로그아웃 되었습니다.');
            // 메인 페이지로 이동
            window.location.href = homeUrl;
        });
    }
});