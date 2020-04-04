DELETE FROM Users;
DELETE FROM Restaurants;
DELETE FROM Food;
DELETE FROM Sells;
DELETE FROM Restaurant_Staff;
DELETE FROM Customers;
DELETE FROM Riders;
DELETE FROM Part_Time;
DELETE FROM Full_Time;
DELETE FROM FDS_Managers;
DELETE FROM Monthly_Work_Schedules;
DELETE FROM Weekly_Work_Schedules;
DELETE FROM Intervals;
DELETE FROM Orders;
DELETE FROM Contains;
DELETE FROM Delivers;
DELETE FROM Promotions;
DELETE FROM MinSpendingPromotions;
DELETE FROM CustomerPromotions;


--\copy (SELECT * FROM Delivers) to 'C:\tmp\delivers.csv' with csv header;
--\copy (SELECT * FROM Promotions) to 'C:\tmp\Promotions.csv' with csv header;
--\copy (SELECT * FROM MinSpendingPromotions) to 'C:\tmp\MinSpendingpromotions.csv' with csv header;
--\copy (SELECT * FROM CustomerPromotions) to 'C:\tmp\CustomerPromotions.csv' with csv header;
--\copy (SELECT * FROM Delivers) to 'C:\tmp\smalldelivers.csv' with csv header;

-- 100 user 40 customer 20 part time rider 25 full time rider 5 fds manager 10 restaurants
\copy Users(name) from './CSVFILES/Users.csv' CSV HEADER; --100 user

\copy Customers from './CSVFILES/Customers.csv' CSV HEADER; --40 user
\copy Riders from './CSVFILES/Riders.csv' CSV HEADER;  --45 user

INSERT INTO Part_Time(userId)  -- 20 
SELECT U.userId
FROM Users U
OFFSET 40
LIMIT 20;

INSERT INTO Full_Time(userId) -- 25
SELECT U.userId
FROM Users U
OFFSET 60
LIMIT 25;

INSERT INTO FDS_Managers(userId) -- 5
SELECT U.userId
FROM Users U
OFFSET 95
LIMIT 5;

\copy Restaurants from './CSVFILES/Restaurants.csv' CSV HEADER;  --10 res
\copy Restaurant_Staff from './CSVFILES/RestaurantStaff.csv' CSV HEADER;  --10 res
\copy Food from './CSVFILES/Food.csv' CSV HEADER;
\copy Sells(fname, rname, price, availability) from './CSVFILES/Sells.csv' CSV HEADER;

\copy Promotions(promoCode, promoDesc, createdBy, applicableTo, discUnit, discRate, startDate, endDate) from './CSVFILES/Promotions.csv' CSV HEADER;
\copy MinSpendingPromotions(promoCode, applicableTo, minAmt) from './CSVFILES/MinSpendingpromotions.csv' CSV HEADER;
\copy CustomerPromotions(promoCode, applicableTo, minTimeFromLastOrder) from './CSVFILES/CustomerPromotions.csv' CSV HEADER;

------------------------------------------ LARGE DATA SET ------------------------------------------
/*
Things to note:
Might take up to a minute to load. It is working fine.
*/

/*
BEGIN;
--userId, startDate, endDate
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/weeklywork.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/intervals.csv' CSV HEADER;
COMMIT;

BEGIN;
--userId, startDate, endDate
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/weeklyworkFT.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/intervalsFT.csv' CSV HEADER;
\copy Monthly_Work_Schedules(scheduleId1, scheduleId2, scheduleId3, scheduleId4) from './CSVFILES/monthlyworkFT.csv' CSV HEADER;
COMMIT;
\copy Orders(userId, modeOfPayment, timeOfOrder, deliveryLocation, usedRewardPoints) from './CSVFILES/orders.csv' CSV HEADER;
\copy Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant, arrivalTimeAtRestaurant, deliveryTimetoCustomer, rating) from './CSVFILES/delivers.csv' CSV HEADER;
*/

------------------------------------------ END OF LARGE DATA SET ------------------------------------------


------------------------------------------ SMALL DATA SET ------------------------------------------
/*
Things to note: 
If new triggers are created for Orders to check if rider is working for this small dataset, it might not work.
Check using large dataset to confirm if data is wrong. 
I didn't check a lot of constrains for orders. USE with care. Data might be wrong. So far, it seems good. 
Might have to change if more triggers are added.
*/

BEGIN;
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/smallweeklywork.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/smallintervals.csv' CSV HEADER;
COMMIT;

BEGIN;
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/smallweeklyworkFT.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/smallintervalsFT.csv' CSV HEADER;
\copy Monthly_Work_Schedules(scheduleId1, scheduleId2, scheduleId3, scheduleId4) from './CSVFILES/smallmonthlyworkFT.csv' CSV HEADER;
COMMIT;

\copy Orders(userId, promoCode, applicableTo, modeOfPayment, timeOfOrder, deliveryLocation, usedRewardPoints) from './CSVFILES/Orders.csv' CSV HEADER;
\copy Contains(orderId, fname, rname, foodQty, reviewContent) from './CSVFILES/Contains.csv' CSV HEADER;
\copy Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant, arrivalTimeAtRestaurant, deliveryTimetoCustomer, rating) from './CSVFILES/delivers.csv' CSV HEADER;

------------------------------------------ END OF SMALL DATA SET ------------------------------------------
