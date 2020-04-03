DELETE FROM Users;
DELETE FROM Restaurants;
DELETE FROM Food;
DELETE FROM Sells;
DELETE FROM Restaurant_Staff;
DELETE FROM Customers;
DELETE FROM Riders;
DELETE FROM Part_Time;
DELETE FROM Full_Time;
DELETE FROM Monthly_Work_Schedules;
DELETE FROM Weekly_Work_Schedules;
DELETE FROM Intervals;
DELETE FROM Orders;
DELETE FROM Contains;
DELETE FROM Delivers;
DELETE FROM Promotions;
DELETE FROM MinSpendingPromotions;
DELETE FROM CustomerPromotions;

-- TESTING Order_details/delvery_details in depth.

INSERT INTO Users (name) VALUES
('a'),
('b'),
('c'),
('d'),
('e'),
('f'),
('g'), 
('h'), 
('i'),
('j'),
('k'),
('L');

INSERT INTO Customers (userId, creditCardInfo) VALUES
(1, 112321),
(2, 22141),
(3, 351422);

INSERT INTO Riders (userId, area) VALUES
(4, 'north'),
(5, 'south'),
(6, 'central'),
(7, 'east'),
(8, 'west');

INSERT INTO Part_Time (userId) VALUES
(4),
(5);

-- INSERT INTO Full_Time (userId) VALUES
-- (6),
-- (7),
-- (8);

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
('JIT YONG RESTAURANT1', 'DUCK', 11.0);

INSERT INTO Sells (rname, fname, price, availability) VALUES
('JIT YONG RESTAURANT', 'DUCK', 10.0, 5);

INSERT INTO Restaurant_Staff (userId, rname) VALUES
(9, 'JIT YONG RESTAURANT'),
(10, 'JIT YONG PTE LTD'),
(11, 'JIT YONG RESTAURANT1'),
(12, 'JIT YONG RESTAURANT2');

INSERT INTO Promotions(promoCode, promoDesc, createdBy, applicableTo, discUnit, discRate, startDate, endDate) VALUES
('A123', '10$ OFF if you order minimum 10 dollars', NULL, 'JIT YONG RESTAURANT', '$', 5, '2020-06-22 19:10:25', '2020-06-25 19:11:25'),
('A123', '10% OFF if you have not ordered in last 10 days', NULL, 'JIT YONG RESTAURANT1', '%', 15, '2022-06-22 19:10:25', '2027-06-25 19:11:25'),
('A122', 'FREE DELIVERY FOR ALL USERS', NULL, 'JIT YONG RESTAURANT', 'FD', NULL, '2022-06-22 19:10:25', '2027-06-25 19:11:25');

INSERT INTO MinSpendingPromotions(promoCode, applicableTo, minAmt) VALUES
('A123', 'JIT YONG RESTAURANT', 10),
('A122', 'JIT YONG RESTAURANT', 0);

INSERT INTO CustomerPromotions(promoCode, applicableTo, minTimeFromLastOrder) VALUES
('A123', 'JIT YONG RESTAURANT1', 10);

INSERT INTO Orders(orderId, userId, promoCode, applicableTo, 
                modeOfPayment, timeOfOrder, deliveryLocation, 
                usedRewardPoints) VALUES
(1, 1, 'A123', 'JIT YONG RESTAURANT', 'cash', '2020-06-22 19:05:25', 'blk singapore', 0),
(2, 1, NULL, NULL, 'cash', '2020-06-22 19:05:25', 'blk singapore', 0),
(3, 2, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', 10),
(4, 2, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', 0),
(5, 3, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', 0),
(6, 3, NULL, NULL, 'credit', '2020-06-22 19:10:25', 'blk 123', 0),
(7, 3, 'A123', 'JIT YONG RESTAURANT1', 'credit', '2020-06-22 19:15:25', 'blk 123', 0),
(8, 3, 'A122', 'JIT YONG RESTAURANT', 'credit', '2020-07-22 19:10:25', 'blk 123', 0);


INSERT INTO Contains(orderId, rname, fname, foodQty, reviewContent) VALUES
(1, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD'),
(2, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD2'),
(3, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD2'),
(4, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD2'),
(4, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD3'),
(5, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD51'),
(6, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD6'),
(7, 'JIT YONG RESTAURANT1', 'DUCK', 1, 'GOOD1'),
(8, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD6');


INSERT INTO Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant
                            ,deliveryTimetoCustomer, arrivalTimeAtRestaurant, rating) VALUES
(1, 4, '2020-06-22 19:10:25', '2020-06-22 19:11:25', '2020-06-22 21:12:25', '2020-06-22 19:20:25', 5),
(2, 5, '2020-06-23 19:10:25', '2020-06-23 19:11:25', '2020-06-23 19:32:25', '2020-06-23 19:43:22', NULL),
(3, 5, '2020-06-24 19:10:25', '2020-06-24 19:11:25', '2020-06-24 19:22:25', '2020-06-24 19:13:22', 2),
(4, 5, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:13:25', '2020-06-24 19:20:21', 3),
(7, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:13:25', '2020-06-24 19:25:25', 4),
(5, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:33:25', '2020-06-24 20:24:25', 2),
(6, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 20:13:25', '2020-06-24 20:34:25', 2);

SELECT (P.endDate::date -  P.startDate::date) as durationOfPromotion
FROM Promotions P
WHERE P.promoCode = 'A123' AND P.applicableTo = 'JIT YONG RESTAURANT';

SELECT count(distinct O.orderId) as ordersReceivedDuringPromotion
FROM Orders O
WHERE O.promoCode = 'A123' AND O.applicableTo = 'JIT YONG RESTAURANT'