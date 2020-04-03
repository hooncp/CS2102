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

