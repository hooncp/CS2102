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
DELETE FROM Orders;
<<<<<<< HEAD
DELETE FROM Order_Details;
DELETE FROM Schedules;
DELETE FROM Delivery_Details;
=======
DELETE FROM Contains;
DELETE FROM Schedules;
DELETE FROM Delivers;
>>>>>>> 1147ae8bad9baa9f6d48dcc7014a96e7e78fcfa5
DELETE FROM Promotions;
DELETE FROM MinSpendingPromotions;
DELETE FROM CustomerPromotions;

-- TESTING Order_details/delvery_details in depth.

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
(10),
(11),
(12);

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
(9, 'JIT YONG RESTAURANT'),
(10, 'JIT YONG PTE LTD'),
(11, 'JIT YONG RESTAURANT1'),
(12, 'JIT YONG RESTAURANT2');

INSERT INTO Orders(orderId, userId, promoCode, applicableTo, 
<<<<<<< HEAD
                modeOfPayment, totalFoodPrice, deliveryFee, timeOfOrder, deliveryLocation, 
                usedRewardPoints, givenRewardPoints, reviewContent) VALUES
(1, 1, NULL, NULL, 'cash', 30.00, 10.00, '2020-06-22 19:05:25', 'blk singapore', NULL, 3, 'SOO GOOD'),
(2, 1, NULL, NULL, 'cash', 40.00, 10.00, '2020-06-22 19:05:25', 'blk singapore', NULL, 3, 'NOT GOOD'),
(3, 2, NULL, NULL, 'credit', 20.00, 7.50, '2020-06-22 19:15:25', 'blk 123', NULL, 3, 'NOT GOOD1'),
(4, 2, NULL, NULL, 'credit', 20.00, 7.50, '2020-06-22 19:15:25', 'blk 123', NULL, 3, 'CHICKEN GOOD DUCK BAD1'),
(5, 3, NULL, NULL, 'credit', 20.00, 7.50, '2020-06-22 19:15:25', 'blk 123', NULL, 3, 'CHICKEN GOOD DUCK BAD2'),
(6, 3, NULL, NULL, 'credit', 20.00, 7.50, '2020-06-22 19:15:25', 'blk 123', NULL, 3, 'CHICKEN GOOD DUCK BAD3'),
(7, 3, NULL, NULL, 'credit', 20.00, 7.50, '2020-06-22 19:15:25', 'blk 123', NULL, 3, 'CHICKEN GOOD DUCK BAD4');

INSERT INTO Delivery_Details(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant
=======
                modeOfPayment, timeOfOrder, deliveryLocation, 
                usedRewardPoints, givenRewardPoints) VALUES
(1, 1, NULL, NULL, 'cash', '2020-06-22 19:05:25', 'blk singapore', NULL, 3),
(2, 1, NULL, NULL, 'cash', '2020-06-22 19:05:25', 'blk singapore', NULL, 3),
(3, 2, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', NULL, 3),
(4, 2, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', NULL, 3),
(5, 3, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', NULL, 3),
(6, 3, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', NULL, 3),
(7, 3, NULL, NULL, 'credit', '2020-06-22 19:15:25', 'blk 123', NULL, 3);

INSERT INTO Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant
>>>>>>> 1147ae8bad9baa9f6d48dcc7014a96e7e78fcfa5
                            ,deliveryTimetoCustomer, arrivalTimeAtRestaurant, rating) VALUES
(1, 4, '2020-06-22 19:10:25', '2020-06-22 19:11:25', '2020-06-22 21:12:25', '2020-06-22 19:20:25', 5),
(2, 5, '2020-06-23 19:10:25', '2020-06-23 19:11:25', '2020-06-23 19:32:25', '2020-06-23 19:43:22', NULL),
(3, 5, '2020-06-24 19:10:25', '2020-06-24 19:11:25', '2020-06-24 19:22:25', '2020-06-24 19:13:22', 2),
(4, 5, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:13:25', '2020-06-24 19:20:21', 3),
(7, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:13:25', '2020-06-24 19:25:25', 4),
(5, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 19:33:25', '2020-06-24 20:24:25', 2),
(6, 4, '2020-06-24 19:11:25', '2020-06-24 19:12:25', '2020-06-24 20:13:25', '2020-06-24 20:34:25', 2);


<<<<<<< HEAD
INSERT INTO Order_Details(orderId, rname, fname, foodQty) VALUES
(1, 'JIT YONG RESTAURANT', 'CHICKEN', 2),
(1, 'JIT YONG RESTAURANT', 'DUCK', 1),
(2, 'JIT YONG RESTAURANT1', 'CHICKEN', 3),
(3, 'JIT YONG RESTAURANT', 'DUCK', 1),
(4, 'JIT YONG RESTAURANT', 'DUCK', 1),
(5, 'JIT YONG RESTAURANT', 'DUCK', 1),
(6, 'JIT YONG RESTAURANT', 'DUCK', 1),
(7, 'JIT YONG RESTAURANT', 'DUCK', 1);
=======
INSERT INTO Contains(orderId, rname, fname, foodQty, reviewContent) VALUES
(1, 'JIT YONG RESTAURANT', 'CHICKEN', 2, 'GOOD'),
(1, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD1'),
(2, 'JIT YONG RESTAURANT1', 'CHICKEN', 3, 'GOOD2'),
(3, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD3'),
(4, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD4'),
(5, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD51'),
(6, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD6'),
(7, 'JIT YONG RESTAURANT', 'DUCK', 1, 'GOOD1');
>>>>>>> 1147ae8bad9baa9f6d48dcc7014a96e7e78fcfa5

INSERT INTO Promotions(promoCode, promoDesc, createdBy, applicableTo, discUnit, discRate, startDate, endDate) VALUES
('A123', '10% OFF', NULL, 'JIT YONG RESTAURANT', 10, 10, '2020-06-22 19:10:25', '2020-06-25 19:11:25'),
('A123', '10% OFF', NULL, 'JIT YONG RESTAURANT1', 15, 15, '2022-06-22 19:10:25', '2027-06-25 19:11:25');

INSERT INTO MinSpendingPromotions(promoCode, applicableTo, minAmt) VALUES
('A123', 'JIT YONG RESTAURANT', 10);

INSERT INTO CustomerPromotions(promoCode, applicableTo, minTimeFromLastOrder) VALUES
('A123', 'JIT YONG RESTAURANT1', 10);