-- Tarot Card Table
CREATE TABLE IF NOT EXISTS tarotcard (
    cardnumber INTEGER PRIMARY KEY,
    cardimg TEXT,
    cardnameko TEXT,
    cardnameen TEXT,
    cardtime TEXT,
    cardhuman TEXT,
    cardheart TEXT
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    userNum INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT NOT NULL,
    userGender TEXT NOT NULL,
    userPhone TEXT UNIQUE NOT NULL,
    userEmail TEXT UNIQUE NOT NULL,
    termsAgreed INTEGER DEFAULT 0, -- BOOLEAN is INTEGER in SQLite (0/1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Fortune Table
CREATE TABLE IF NOT EXISTS user_fortune_daily (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userNum INTEGER NOT NULL,
    cardNum INTEGER NOT NULL,
    fortuneDate DATE NOT NULL,
    content TEXT,
    FOREIGN KEY (userNum) REFERENCES users(userNum) ON DELETE CASCADE,
    FOREIGN KEY (cardNum) REFERENCES tarotcard(cardnumber)
);

-- Monthly Fortune Table
CREATE TABLE IF NOT EXISTS user_fortune_monthly (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userNum INTEGER NOT NULL,
    cardNum INTEGER NOT NULL,
    fortuneMonth TEXT NOT NULL, -- Format: YYYY-MM
    FOREIGN KEY (userNum) REFERENCES users(userNum) ON DELETE CASCADE,
    FOREIGN KEY (cardNum) REFERENCES tarotcard(cardnumber)
);

-- Sample Data for Tarot Card (Example)
INSERT OR IGNORE INTO tarotcard VALUES (0, "C:\\Users\\0000\\Desktop\\Tarot\\card\\0.jpg", "바보", "TheFool", "계획 없는 시작. 갑작스러운 외출이나 이동이 생깁니다. 무모하지만 즐거운 일이 생기거나, 0부터 다시 시작하는 상황이 발생합니다.", "자유로운 영혼순수하고 낙천적이며 모험심이 강한 사람입니다. 현실 감각이 조금 부족하고 철없어 보일 수 있지만, 얽매이지 않는 자유로움이 매력입니다. 충동적이고 계획성이 부족한 면이 있습니다.", "어떻게든 되겠지 낙천주의복잡한 생각은 딱 질색입니다. 마음이 깃털처럼 가볍고 자유롭습니다. 현실적인 걱정보다는 막연한 기대감과 호기심이 가득 찬 상태입니다. 철없어 보일 만큼 순수한 마음입니다");

-- SQLite Trigger for Automatic Daily Fortune
CREATE TRIGGER IF NOT EXISTS after_user_insert
AFTER INSERT ON users
BEGIN
    INSERT INTO user_fortune_daily (userNum, cardNum, fortuneDate, content)
    VALUES (
        NEW.userNum, 
        (SELECT cardnumber FROM tarotcard ORDER BY RANDOM() LIMIT 1), 
        DATE('now', 'localtime'), 
        '가입 축하 오늘의 운세'
    );
END;
