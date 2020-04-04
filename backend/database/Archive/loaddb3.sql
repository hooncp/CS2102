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

BEGIN;
insert into Weekly_Work_Schedules values (10,4,'8 nov 2020', '14 nov 2020');

insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-12 10:00','2020-11-12 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-12 15:00','2020-11-12 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-08 10:00','2020-11-08 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-08 15:00','2020-11-08 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-09 10:00','2020-11-09 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-09 15:00','2020-11-09 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-10 10:00','2020-11-10 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-10 15:00','2020-11-10 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-11 10:00','2020-11-11 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (10,'2020-11-11 15:00','2020-11-11 19:00');
COMMIT;

BEGIN;
insert into Weekly_Work_Schedules values (11,5,'8 nov 2020', '14 nov 2020');

insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-12 10:00','2020-11-12 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-12 15:00','2020-11-12 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-08 10:00','2020-11-08 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-08 15:00','2020-11-08 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-09 10:00','2020-11-09 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-09 15:00','2020-11-09 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-10 10:00','2020-11-10 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-10 15:00','2020-11-10 19:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-11 10:00','2020-11-11 14:00');
insert into Intervals (scheduleId, startTime,endTime) values (11,'2020-11-11 15:00','2020-11-11 19:00');
COMMIT;

/*
INSERT INTO Orders(orderId, userId, promoCode, applicableTo, 
                modeOfPayment, timeOfOrder, deliveryLocation, 
                usedRewardPoints) VALUES
--(1, 1, 'A123', 'JIT YONG RESTAURANT', 'cash', '2020-06-22 19:05:25', 'blk singapore', 0),
--(2, 1, NULL, NULL, 'cash', '2020-06-22 19:05:25', 'blk singapore', 0),
--(3, 2, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', 10),
--(4, 2, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', 0),
(5, 3, NULL, NULL, 'credit', '2020-11-12 11:00:00', 'blk 123', 0),
(6, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0);
--(7, 3, 'A123', 'JIT YONG RESTAURANT1', 'credit', '2020-06-22 19:15:25', 'blk 123', 0),
--(8, 3, 'A122', 'JIT YONG RESTAURANT', 'credit', '2020-07-22 19:10:25', 'blk 123', 0);

*/
/*

BEGIN;
INSERT INTO Orders(orderId, userId, promoCode, applicableTo, 
                modeOfPayment, timeOfOrder, deliveryLocation, 
                usedRewardPoints) VALUES
(7, 3, NULL, NULL, 'credit', '2020-11-12 11:00:00', 'blk 123', 0);

INSERT INTO Contains(orderId, rname, fname, foodQty, reviewContent) VALUES
(7, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD51');
COMMIT;
    SELECT R.userId
    FROM Riders R
    WHERE findStatusOfRider(R.userId, '2020-11-12 10:10:00') = 1
    LIMIT 1;

    SELECT (findStatusOfRider(4, '2020-11-12 10:10:00'));
    SELECT (findStatusOfRider(5, '2020-11-12 10:10:00'));
    SELECT (checkWorkingStatusHelperOfRider(5, '2020-11-12 10:00')); --gives 1
    SELECT (checkWorkingStatusHelperOfRider(6, '2020-11-12 10:00'));
INSERT INTO Orders(orderId, userId, promoCode, applicableTo, 
                modeOfPayment, timeOfOrder, deliveryLocation, 
                usedRewardPoints) VALUES
(7, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0),
(8, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0),
(9, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0),
(10, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0),
(11, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0),
(12, 3, NULL, NULL, 'credit', '2020-11-12 10:10:00', 'blk 123', 0);
*/
/*
INSERT INTO Contains(orderId, rname, fname, foodQty, reviewContent) VALUES
--(1, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD'),
--(2, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD2'),
--(3, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD2'),
--(4, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD2'),
--(4, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD3'),
(5, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD51'),
(6, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD6');
--(7, 'JIT YONG RESTAURANT1', 'DUCK', 1, 'GOOD1'),
--(8, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD6');
*/
/*
INSERT INTO Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant
                            ,deliveryTimetoCustomer, arrivalTimeAtRestaurant, rating) VALUES
--(1, 4, '2020-06-22 19:10:25', '2020-06-22 19:11:25', '2020-06-22 21:12:25', '2020-06-22 19:20:25', 5),
---(2, 5, '2020-06-23 19:10:25', '2020-06-23 19:11:25', '2020-06-23 19:32:25', '2020-06-23 19:43:22', NULL),
--(3, 5, '2020-06-24 19:10:25', '2020-06-24 19:11:25', '2020-06-24 19:22:25', '2020-06-24 19:13:22', 2),
--(4, 5, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:13:25', '2020-06-24 19:20:21', 3),
--(7, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:13:25', '2020-06-24 19:25:25', 4),
(5, 4, '2020-11-12 11:00:00', '2020-11-12 11:10:00', '2020-11-12 11:20:00', '2020-11-12 11:30:00', 2),
(6, 5, '2020-11-12 10:00:00', '2020-11-12 10:00:00', '2020-11-12 10:00:00', '2020-11-12 10:00:00', 2);
*/
/*
INSERT INTO Promotions(promoCode, promoDesc, createdBy, applicableTo, discUnit, discRate, startDate, endDate) VALUES
('A121', '$5 OFF if you order for a minimum of 10 dollars', NULL, 'Lacus Inc.', '$', 5, '2019-01-01 10:00:00', '2019-01-08 23:59:59'),
('A122', '15% OFF if first order', NULL, 'Curabitur LLP', '%', 15, '2019-01-01 10:00:00', '2019-01-08 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Lacus Inc.', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Curabitur LLP', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Ornare Ltd', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Egestas Urna Ltd', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Convallis In Limited', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Dignissim Company', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Libero Dui PC', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Ligula PC', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Amet Consectetuer Corp.', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59'),
('A123', 'Free Delivery for all users', 'FDS', 'Nulla Semper Industries', 'FD', NULL, '2019-01-10 10:00:00', '2019-01-10 23:59:59');

INSERT INTO MinSpendingPromotions(promoCode, applicableTo, minAmt) VALUES
('A121', 'Lacus Inc.', 10),
('A123', 'Lacus Inc.', 0),
('A123', 'Curabitur LLP', 0),
('A123', 'Ornare Ltd', 0),
('A123', 'Egestas Urna Ltd', 0),
('A123', 'Convallis In Limited', 0),
('A123', 'Dignissim Company', 0),
('A123', 'Libero Dui PC', 0),
('A123', 'Amet Consectetuer Corp.', 0),
('A123', 'Nulla Semper Industries', 0),
('A123', 'Ligula PC', 0);

--might be an issue here cause i put -1, depends on implementation of trigger
INSERT INTO CustomerPromotions(promoCode, applicableTo, minTimeFromLastOrder) VALUES
('A122', 'Curabitur LLP', -1);
*/