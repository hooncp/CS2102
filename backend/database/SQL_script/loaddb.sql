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
\copy Users(name, dateCreated) from './CSVFILES/Users.csv' CSV HEADER; --100 user

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


------------------------------------------ END OF LARGE DATA SET ------------------------------------------
/* Trigger functions */

DROP FUNCTION IF EXISTS check_mws_5days_consecutive_constraint_deferred() CASCADE;
CREATE OR REPLACE FUNCTION check_mws_5days_consecutive_constraint_deferred() RETURNS TRIGGER AS
$$
DECLARE
    lastIntervalStartTime  TIMESTAMP;
    firstIntervalStartTime TIMESTAMP;
    distinctDates          INTEGER;
BEGIN
    WITH curr_Intervals AS (
        SELECT *
        FROM Intervals I
        WHERE I.scheduleId = NEW.scheduleId1
    )
    SELECT startTime
    into lastIntervalStartTime
    FROM curr_Intervals I
    ORDER BY endTime DESC
    LIMIT 1;

    WITH curr_Intervals AS (
        SELECT *
        FROM Intervals I2
        WHERE I2.scheduleId = NEW.scheduleId1
    )
    SELECT startTime
    into firstIntervalStartTime
    FROM curr_Intervals I
    ORDER BY endTime ASC
    LIMIT 1;

    WITH curr_Intervals AS (
        SELECT *
        FROM Intervals I3
        WHERE I3.scheduleId = NEW.scheduleId1
    )
    SELECT COUNT(DISTINCT I.startTime::date)
    into distinctDates
    FROM curr_Intervals I;
    IF ((lastIntervalStartTime::date - firstIntervalStartTime::date) <> 4 --all intervals within 5 days
        OR distinctDates <> 5) -- each day got interval
    THEN
        RAISE EXCEPTION 'MWS must have 5 consecutive work days';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;



CREATE CONSTRAINT TRIGGER mws_5days_trigger
    AFTER INSERT
    ON Monthly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_mws_5days_consecutive_constraint_deferred();

DROP FUNCTION IF EXISTS check_mws_28days_constraint_deferred() CASCADE;
CREATE OR REPLACE FUNCTION check_mws_28days_constraint_deferred() RETURNS TRIGGER AS
$$
DECLARE
    newEndDate   DATE;
    newStartDate DATE;
BEGIN
    SELECT endDate
    into newEndDate
    FROM Weekly_Work_Schedules S
    WHERE S.scheduleId = NEW.scheduleId4;
    SELECT startDate
    into newStartDate
    FROM Weekly_Work_Schedules S2
    WHERE S2.scheduleId = NEW.scheduleId1;
    IF (newEndDate - newStartDate) <> 27 THEN
        RAISE EXCEPTION 'MWS must be declared for 28 days only.';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;



CREATE CONSTRAINT TRIGGER mws_28days_trigger
    AFTER INSERT
    ON Monthly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_mws_28days_constraint_deferred();

-- if conform to predefined timings
DROP FUNCTION IF EXISTS check_mws_intervals_constraint_deferred() CASCADE;
CREATE OR REPLACE FUNCTION check_mws_intervals_constraint_deferred() RETURNS TRIGGER AS
$$
DECLARE
    badInputSchedule INTEGER;
BEGIN
    WITH curr_Intervals AS (
        SELECT *
        FROM Intervals I
        WHERE I.scheduleId = NEW.scheduleId1
    ),
         Interval_Pairs (intervalId1, startTime1, endTime1, intervalId2, startTime2, endTime2) AS (
             select cI1.intervalId, cI1.startTime, cI1.endTime, cI2.intervalId, cI2.startTime, cI2.endTime
             from curr_Intervals cI1,
                  curr_Intervals cI2
             where cI1.startTime::date = cI2.startTime::date -- 2 intervals of the same day
               and cI1.startTime::time < cI2.startTime::time -- cI1 is the earlier timing, cI2 the later
         )
    SELECT S.scheduleId
    INTO badInputSchedule
    FROM Weekly_Work_Schedules S
    WHERE S.scheduleId = NEW.scheduleId1
      AND (
            NOT EXISTS( -- table is non-empty
                    select 1 from Interval_Pairs IP2 limit 1
                )
            OR
            EXISTS( --checks for any bad intervals
                    SELECT 1
                    FROM Interval_Pairs IP
                    WHERE (select count(*) from Interval_Pairs) <>
                          ((select count(*) from curr_Intervals) / 2) -- each interval has a pair
                       OR NOT (
                            IP.startTime1::time = '10:00' OR
                            IP.startTime1::time = '11:00' OR
                            IP.startTime1::time = '12:00' OR
                            IP.startTime1::time = '13:00'
                        )
                       OR NOT (DATE_PART('hours', IP.endTime1) - DATE_PART('hours', IP.startTime1) = 4
                        AND DATE_PART('hours', IP.endTime2) - DATE_PART('hours', IP.startTime2) = 4)

                       OR NOT (DATE_PART('hours', IP.startTime2) - DATE_PART('hours', IP.endTime1) = 1)
                )
        );

    IF badInputSchedule IS NOT NULL THEN
        RAISE EXCEPTION '% violates some timing in Intervals', badInputSchedule;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;


CREATE CONSTRAINT TRIGGER mws_predefined_interval_trigger
    AFTER INSERT
    ON Monthly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_mws_intervals_constraint_deferred();


CREATE OR REPLACE FUNCTION check_intervals_overlap_deferred() RETURNS TRIGGER AS
$$
DECLARE
    badInputSchedule INTEGER;
BEGIN
    SELECT DISTINCT I1.scheduleId
    INTO badInputSchedule
    FROM Intervals I1
    WHERE EXISTS(
                  SELECT 1
                  FROM Intervals I2
                  WHERE I2.scheduleId = I1.scheduleId
                    AND I2.intervalId <> I1.intervalId
                    AND I2.startTime::date = I1.startTime::date
                    AND (
                          (I2.startTime::time <= I1.startTime::time
                              AND I2.endTime::time >= I1.startTime::time)
                          --IE: first input shift 2-5pm , current input shift 3 - 4pm / 3 - 6pm etc
                          OR
                          (I2.startTime::time <= I1.endTime::time
                              AND I2.endTime::time >= I1.endTime::time)
                          --IE: first input shift 2-5pm, current input shift 12pm - 3pm / 12pm - 6pm
                          OR (
                                      DATE_PART('hours', I1.startTime) - DATE_PART('hours', I2.endTime) < 1
                                  AND DATE_PART('hours', I1.startTime) >= DATE_PART('hours', I2.endTime)
                              -- if current inputted shift start time is less than 1hr from other shifts end time, violated (of the same day).
                              -- this constraint should also be covered without this last statement when the intervals start and end on the hour
                              -- constraint is enforced
                              )
                      )
              );
    IF badInputSchedule IS NOT NULL THEN
        RAISE EXCEPTION 'scheduleId % has some overlapping intervals', badInputSchedule;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;


CREATE CONSTRAINT TRIGGER interval_overlap_trigger
    AFTER INSERT
    ON Intervals
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_intervals_overlap_deferred();


CREATE OR REPLACE FUNCTION check_wws_duration_deferred() RETURNS TRIGGER AS
$$
DECLARE
    badInputSchedule INTEGER;
BEGIN
    WITH IntervalDuration AS
             (
                 SELECT IntervalId,
                        scheduleId,
                        startTime,
                        endTime,
                        date_part('hours', endTime) - date_part('hours', startTime) as duration
                 FROM Intervals
             )
    SELECT DISTINCT scheduleId
    INTO badInputSchedule
    FROM IntervalDuration
    WHERE scheduleId = NEW.scheduleId
    GROUP BY scheduleId
    HAVING sum(duration) >= 10
       and sum(duration) <= 48;

    IF badInputSchedule IS NULL THEN
        RAISE EXCEPTION '% : Total duration of weekly schedule cannot be < 10 or > 48', badInputSchedule;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;


CREATE CONSTRAINT TRIGGER wws_duration_trigger
    AFTER INSERT
    ON Weekly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_wws_duration_deferred();


CREATE OR REPLACE FUNCTION check_wws_within_seven_days_deferred() RETURNS TRIGGER AS
$$
DECLARE
    badInputInterval INTEGER;
BEGIN
    SELECT intervalId
    into badInputInterval
    FROM Intervals I
    WHERE I.scheduleId = NEW.scheduleId
      AND EXISTS(
            SELECT 1
            FROM Weekly_Work_Schedules WWS
            WHERE WWS.scheduleId = NEW.scheduleId
              AND (
                    I.startTime::date < WWS.startDate::date
                    OR
                    I.startTime::date > WWs.endDate::date
                )
        );
    IF badInputInterval IS NOT NULL THEN
        RAISE EXCEPTION 'Intervals in newly added schedule must not exceed 7 days';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;

CREATE CONSTRAINT TRIGGER wws_seven_days_trigger
    AFTER INSERT
    ON Weekly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_wws_within_seven_days_deferred();


CREATE OR REPLACE FUNCTION check_wws_overlap_deferred() RETURNS TRIGGER AS
$$
DECLARE
    badInputSchedule INTEGER;
BEGIN
    SELECT S1.scheduleId
    INTO badInputSchedule
    FROM Weekly_Work_Schedules S1
    WHERE EXISTS(
                  SELECT 1
                  FROM Weekly_Work_Schedules S2
                  WHERE S2.scheduleId <> S1.scheduleId
                    AND S2.userId = S1.userId
                    AND (
                          (S2.startDate::date <= S1.startDate::date
                              AND S2.endDate::date >= S1.startDate::date)
                          OR
                          (S2.startDate::date <= S1.endDate::date
                              AND S2.endDate::date >= S1.endDate::date)
                      )
              );
    IF badInputSchedule IS NOT NULL THEN
        RAISE EXCEPTION 'Newly added schedule must start after the latest schedule';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE PLPGSQL;


CREATE CONSTRAINT TRIGGER wws_overlap_trigger
    AFTER INSERT
    ON Weekly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_wws_overlap_deferred();


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

        SELECT R.userId INTO assigneduserId
        FROM Riders R
        WHERE findStatusOfRider(R.userId, new.timeOfOrder) = 1
        ORDER BY random()
        LIMIT 1;

        IF assigneduserId IS NULL THEN
            RAISE EXCEPTION 'Unable to find rider for Order. ALl riders are not free';
        END IF;

        INSERT INTO Delivers(orderId, userId)
        VALUES(new.orderId, assigneduserId);
        RETURN new;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER orders_insert_trigger
    AFTER INSERT ON Orders
    FOR EACH ROW
    EXECUTE PROCEDURE insertDelivers();