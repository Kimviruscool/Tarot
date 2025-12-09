DROP DATABASE IF EXISTS tarotWeb;
CREATE DATABASE tarotWeb;
USE tarotWeb;

-- Tarot Card Table
CREATE TABLE tarotcard (
    cardnumber INT PRIMARY KEY,
    cardimg VARCHAR(150),
    cardnameko VARCHAR(50),
    cardnameen VARCHAR(50),
    cardtime VARCHAR(300),
    cardhuman VARCHAR(300),
    cardheart VARCHAR(300)
);

-- Users Table
CREATE TABLE users (
    userNum INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL,
    userGender VARCHAR(10) NOT NULL,
    userPhone VARCHAR(20) UNIQUE NOT NULL,
    userEmail VARCHAR(100) UNIQUE NOT NULL,
    termsAgreed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Fortune Table (One entry per user per day)
CREATE TABLE user_fortune_daily (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userNum INT NOT NULL,
    cardNum INT NOT NULL,
    fortuneDate DATE NOT NULL,
    content TEXT,
    FOREIGN KEY (userNum) REFERENCES users(userNum) ON DELETE CASCADE,
    FOREIGN KEY (cardNum) REFERENCES tarotcard(cardnumber)
);

-- Monthly Fortune Table (One entry per user per month)
CREATE TABLE user_fortune_monthly (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userNum INT NOT NULL,
    cardNum INT NOT NULL,
    fortuneMonth VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    FOREIGN KEY (userNum) REFERENCES users(userNum) ON DELETE CASCADE,
    FOREIGN KEY (cardNum) REFERENCES tarotcard(cardnumber)
);

-- Sample Data for Tarot Card (Preserving original data)
INSERT INTO tarotcard VALUES (0, "C:\\Users\\0000\\Desktop\\Tarot\\card\\0.jpg", "바보", "TheFool", "계획 없는 시작. 갑작스러운 외출이나 이동이 생깁니다. 무모하지만 즐거운 일이 생기거나, 0부터 다시 시작하는 상황이 발생합니다.", "자유로운 영혼순수하고 낙천적이며 모험심이 강한 사람입니다. 현실 감각이 조금 부족하고 철없어 보일 수 있지만, 얽매이지 않는 자유로움이 매력입니다. 충동적이고 계획성이 부족한 면이 있습니다.", "어떻게든 되겠지 낙천주의복잡한 생각은 딱 질색입니다. 마음이 깃털처럼 가볍고 자유롭습니다. 현실적인 걱정보다는 막연한 기대감과 호기심이 가득 찬 상태입니다. 철없어 보일 만큼 순수한 마음입니다");

-- Trigger to automatically add today's fortune when a user is created
DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE randomCard INT;
    
    -- Pick a random card number from existing tarot cards
    SELECT cardnumber INTO randomCard FROM tarotcard ORDER BY RAND() LIMIT 1;
    
    -- Insert into daily fortune
    INSERT INTO user_fortune_daily (userNum, cardNum, fortuneDate, content)
    VALUES (NEW.userNum, randomCard, CURDATE(), '가입 축하 오늘의 운세');
END //
DELIMITER ;

-- Test Users
INSERT INTO users (userName, userGender, userPhone, userEmail, termsAgreed) VALUES
('김철수', 'male', '010-1111-1111', 'kim@test.com', TRUE),
('이영희', 'female', '010-2222-2222', 'lee@test.com', TRUE),
('박민수', 'male', '010-3333-3333', 'park@test.com', TRUE),
('최지우', 'female', '010-4444-4444', 'choi@test.com', TRUE),
('정우성', 'male', '010-5555-5555', 'jung@test.com', TRUE);