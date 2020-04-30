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


--DB to test User, Customers, Riders, Part-time Riders, Full-time Riders

INSERT INTO Users (userId) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7), 
(8), 
(9),
(10);

INSERT INTO Customers (userId) VALUES
(1),
(2),
(3);

INSERT INTO Riders (userId, area) VALUES
(4, 'north'),
(5, 'south'),
(6, 'central'),
(7, 'east'),
(8, 'west');

INSERT INTO Part_Time (userId) VALUES
(4),
(5);

INSERT INTO Full_Time (userId) VALUES
(6),
(7),
(8);