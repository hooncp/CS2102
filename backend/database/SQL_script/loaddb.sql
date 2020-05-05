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
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/Weeklywork.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/Intervals.csv' CSV HEADER;
COMMIT;

BEGIN;
--userId, startDate, endDate
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/WeeklyworkFT.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/IntervalsFT.csv' CSV HEADER;
\copy Monthly_Work_Schedules(scheduleId1, scheduleId2, scheduleId3, scheduleId4) from './CSVFILES/MonthlyworkFT.csv' CSV HEADER;
COMMIT;

\copy Orders(userId, promoCode, applicableTo, modeOfPayment, timeOfOrder, deliveryLocation, usedRewardPoints) from './CSVFILES/Orders.csv' CSV HEADER;
\copy Contains(orderId, fname, rname, foodQty, reviewContent) from './CSVFILES/Contains.csv' CSV HEADER;
\copy Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant, arrivalTimeAtRestaurant, deliveryTimetoCustomer, rating) from './CSVFILES/Delivers.csv' CSV HEADER;

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
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/Smallintervals.csv' CSV HEADER;
COMMIT;

BEGIN;
\copy Weekly_Work_Schedules(userId, startDate, endDate) from './CSVFILES/smallweeklyworkFT.csv' CSV HEADER;
\copy Intervals(scheduleId, startTime, endTime) from './CSVFILES/SmallintervalsFT.csv' CSV HEADER;
\copy Monthly_Work_Schedules(scheduleId1, scheduleId2, scheduleId3, scheduleId4) from './CSVFILES/SmallmonthlyworkFT.csv' CSV HEADER;
COMMIT;

\copy Orders(userId, promoCode, applicableTo, modeOfPayment, timeOfOrder, deliveryLocation, usedRewardPoints) from './CSVFILES/Orders.csv' CSV HEADER;
\copy Contains(orderId, fname, rname, foodQty, reviewContent) from './CSVFILES/Contains.csv' CSV HEADER;
\copy Delivers(orderId, userId, departTimeForRestaurant, departTimeFromRestaurant, arrivalTimeAtRestaurant, deliveryTimetoCustomer, rating) from './CSVFILES/Delivers.csv' CSV HEADER;

------------------------------------------ END OF SMALL DATA SET ------------------------------------------

DROP FUNCTION IF EXISTS findRiderToDeliverOrder CASCADE;
DROP FUNCTION IF EXISTS insertDelivers CASCADE;
DROP TRIGGER IF EXISTS orders_insert_trigger ON Orders CASCADE;

CREATE OR REPLACE FUNCTION findRiderToDeliverOrder(current TIMESTAMP)
RETURNS INTEGER AS
$$
    SELECT R.userId
    FROM Riders R
    WHERE findStatusOfRider(R.userId, current) = 1
    LIMIT 1;
$$ LANGUAGE SQL;



CREATE OR REPLACE FUNCTION insertDelivers()
RETURNS TRIGGER AS
$$
    DECLARE
        assigneduserId      INTEGER; --integer
        randomTime1 INTERVAL; -- departTimeForrestaurant 1
        randomTime2 INTERVAL; -- arrivalTimeAtRestaurant 2
        randomTime3 INTERVAL; -- departTimeFromRestaurant 3
        randomTime4 INTERVAL; -- deliveryTimetoCustomer; 4
        randomRating INTEGER;

    BEGIN
        randomRating = floor(random() * 3 + 3)::INT;
        randomTime1 = floor(random() * (5) + 1) * '1 minute'::INTERVAL; -- 1- 5 minutes?
        randomTime2 = floor(random() * (15) + 5) * '1 minute'::INTERVAL + randomTime1;-- 11- 15 minutes?
        randomTime3 = floor(random() * (15) + 5) * '1 minute'::INTERVAL + randomTime2;-- 11- 15 minutes?
        randomTime4 = floor(random() * (15) + 5) * '1 minute'::INTERVAL + randomTime3;-- 11- 15 minutes?

        SELECT R.userId INTO assigneduserId
        FROM Riders R
        WHERE findStatusOfRider(R.userId, new.timeOfOrder) = 1
        ORDER BY random()
        LIMIT 1;

        IF assigneduserId IS NULL THEN
            RAISE EXCEPTION 'Unable to find rider for Order. ALl riders are not free';
        END IF;

        INSERT INTO Delivers(orderId, userId, departTimeForRestaurant,
        departTimeFromRestaurant, arrivalTimeAtRestaurant, deliveryTimetoCustomer,
        rating)
        VALUES(new.orderId, assigneduserId, new.timeOfOrder + randomTime1, new.timeOfOrder + randomTime2,
        new.timeOfOrder + randomTime3, new.timeOfOrder + randomTime4, randomRating);
        RETURN new;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER orders_insert_trigger
    AFTER INSERT ON Orders
    FOR EACH ROW
    EXECUTE PROCEDURE insertDelivers();
