drop database if exists tarotWEb;
create database tarotWeb;
use tarotWeb;

create table tarotcard(
cardnumber int,
cardimg varchar(150),
cardnameko varchar(50),
cardnameen varchar(50),
cardtime varchar(300),
cardhuman varchar(300),
cardheart varchar(300)
);

create table users(
userNum int auto_increment,
userName varchar(10) unique not null,
userPhone varchar(11) unique not null,
userEmail varchar(100) unique not null,
primary key(userNum)
);

insert into tarotcard values(0,"C:\Users\0000\Desktop\Tarot\card\0.jpg","바보","TheFool","계획 없는 시작. 갑작스러운 외출이나 이동이 생깁니다. 무모하지만 즐거운 일이 생기거나, 0부터 다시 시작하는 상황이 발생합니다.","자유로운 영혼순수하고 낙천적이며 모험심이 강한 사람입니다. 현실 감각이 조금 부족하고 철없어 보일 수 있지만, 얽매이지 않는 자유로움이 매력입니다. 충동적이고 계획성이 부족한 면이 있습니다.","어떻게든 되겠지 낙천주의복잡한 생각은 딱 질색입니다. 마음이 깃털처럼 가볍고 자유롭습니다. 현실적인 걱정보다는 막연한 기대감과 호기심이 가득 찬 상태입니다. 철없어 보일 만큼 순수한 마음입니다");

select * from tarotcard;