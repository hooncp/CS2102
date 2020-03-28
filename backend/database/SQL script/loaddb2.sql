DELETE FROM Users;
DELETE FROM Restaurants;
DELETE FROM Food;
DELETE FROM Sells;
DELETE FROM Restaurant_Staff;
DELETE FROM Customers;
DELETE FROM Riders;
DELETE FROM Part_Time;
DELETE FROM Full_Time;
DELETE FROM Schedules;
DELETE FROM Monthly_Work_Schedules;
DELETE FROM Weekly_Work_Schedules;
DELETE FROM Intervals;
DELETE FROM Order_Details;
DELETE FROM Schedules;
DELETE FROM Delivery_Details;
DELETE FROM Promotions;
DELETE FROM MinSpendingPromotions;
DELETE FROM CustomerPromotions;

--DB to test User, Restaurant, Food, Sells, Restaurant Staff

INSERT INTO Users (userId) VALUES
(1),
(2),
(3),
(4),
(5);

INSERT INTO Restaurants (rname, minOrderAmt, area) VALUES
('JIT YONG RESTAURANT', 100.00, 'central'),
('JIT YONG PTE LTD', 10, 'central'),
('JIT YONG RESTAURANT1', 10.1, 'east'),
('JIT YONG RESTAURANT2', 100.00, 'west');

INSERT INTO Food (fname, category) VALUES
('CHICKEN', 'western'),
('CHICKEN SOUP', 'western'),
('CHICKEN BROTH', 'western'),
('DUCK', 'western'),
('CHAR SIEW', 'chinese');

INSERT INTO Sells (rname, fname, price) VALUES
('JIT YONG RESTAURANT', 'CHICKEN', 10.0),
('JIT YONG PTE LTD', 'DUCK', 5.0),
('JIT YONG RESTAURANT1', 'CHICKEN', 11.0);

INSERT INTO Sells (rname, fname, price, availability) VALUES
('JIT YONG RESTAURANT', 'DUCK', 10.0, 5);

INSERT INTO Restaurant_Staff (userId, rname) VALUES
(1, 'JIT YONG RESTAURANT'),
(2, 'JIT YONG PTE LTD'),
(3, 'JIT YONG RESTAURANT1'),
(4, 'JIT YONG RESTAURANT2');