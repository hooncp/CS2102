DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Food CASCADE;
DROP TABLE IF EXISTS Sells CASCADE;
DROP TABLE IF EXISTS Restaurant_Staff CASCADE;
DROP TABLE IF EXISTS FDS_Managers CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS Riders CASCADE;
DROP TABLE IF EXISTS Part_Time CASCADE;
DROP TABLE IF EXISTS Full_Time CASCADE;
DROP TABLE IF EXISTS Monthly_Work_Schedules CASCADE;
DROP TABLE IF EXISTS Weekly_Work_Schedules CASCADE;
DROP TABLE IF EXISTS Intervals CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Contains CASCADE;
DROP TABLE IF EXISTS Delivers CASCADE;
DROP TABLE IF EXISTS Promotions CASCADE;
DROP TABLE IF EXISTS MinSpendingPromotions CASCADE;
DROP TABLE IF EXISTS CustomerPromotions CASCADE;

SET datestyle = "ISO, DMY";

CREATE TABLE Users
(
    userId      SERIAL,
    name        VARCHAR(100),
    dateCreated TIMESTAMP,
    PRIMARY KEY (userId)
);

CREATE TABLE Restaurants
(

    rname       VARCHAR(200),
    minOrderAmt NUMERIC(8, 2),
    area        VARCHAR(20),
    PRIMARY KEY (rname),
    CHECK (area = 'central' OR
           area = 'west' OR
           area = 'east' OR
           area = 'north' OR
           area = 'south')
);

CREATE TABLE Food
(

    fname    VARCHAR(200),
    category VARCHAR(20) NOT NULL,
    PRIMARY KEY (fname),
    CHECK (category = 'western' OR
           category = 'chinese' OR
           category = 'japanese' OR
           category = 'korean' OR
           category = 'fusion')
);

CREATE TABLE Sells
(
    rname        VARCHAR(200) REFERENCES Restaurants on DELETE CASCADE on UPDATE CASCADE,
    fname        VARCHAR(200) REFERENCES Food on DELETE CASCADE on UPDATE CASCADE,
    price        NUMERIC(8, 2) NOT NULL,
    availability INTEGER DEFAULT 10,
    PRIMARY KEY (rname, fname)
);

CREATE TABLE Restaurant_Staff
(
    userId INTEGER,
    rname  VARCHAR(200) REFERENCES Restaurants on DELETE CASCADE on UPDATE CASCADE,
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users
        on DELETE CASCADE
        on UPDATE CASCADE

);

CREATE TABLE FDS_Managers
(
    userId INTEGER,
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users
        on DELETE CASCADE
        on UPDATE CASCADE
);

CREATE TABLE Customers
(
    userId         INTEGER,
    creditCardInfo VARCHAR(100),
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users
        on DELETE CASCADE
        on UPDATE CASCADE
);

CREATE TABLE Riders
(
    userId INTEGER,
    area   VARCHAR(20) NOT NULL,
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users
        on DELETE CASCADE
        on UPDATE CASCADE,
    CHECK (area = 'central' OR
           area = 'west' OR
           area = 'east' OR
           area = 'north' OR
           area = 'south')
);

CREATE TABLE Part_Time
(
    userId INTEGER,
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Riders
        on DELETE CASCADE
        on UPDATE CASCADE
--        DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE Full_Time
(
    userId INTEGER,
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Riders
        on DELETE CASCADE
        on UPDATE CASCADE
--        DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE Weekly_Work_Schedules
(
    scheduleId SERIAL,
    userId     INTEGER,
    startDate  TIMESTAMP,
    endDate    TIMESTAMP,
    PRIMARY KEY (scheduleId),
    FOREIGN KEY (userId) REFERENCES Riders (userId) ON DELETE CASCADE,
    check ((endDate::date - startDate::date) = 6)
);


CREATE TABLE Monthly_Work_Schedules
(
    scheduleId1 INTEGER REFERENCES Weekly_Work_Schedules ON DELETE CASCADE,
    scheduleId2 INTEGER REFERENCES Weekly_Work_Schedules ON DELETE CASCADE,
    scheduleId3 INTEGER REFERENCES Weekly_Work_Schedules ON DELETE CASCADE,
    scheduleId4 INTEGER REFERENCES Weekly_Work_Schedules ON DELETE CASCADE,
    PRIMARY KEY (scheduleId1, scheduleId2, scheduleId3, scheduleId4)
    --DEFERRED TRIGGER TO CHECK FOR CONSTRAINTS (FOR BOTH INTERVAL & SCHEDULE)
);

CREATE TABLE Intervals
(
    intervalId SERIAL,
    scheduleId INTEGER,
    startTime  TIMESTAMP,
    endTime    TIMESTAMP,
    PRIMARY KEY (intervalId),
    FOREIGN KEY (scheduleId) REFERENCES Weekly_Work_Schedules (scheduleId)
        ON DELETE CASCADE,
    check (DATE_PART('minutes', startTime) = 0
        AND
           DATE_PART('seconds', startTime) = 0
        AND
           DATE_PART('minutes', endTime) = 0
        AND
           DATE_PART('seconds', startTime) = 0
        AND
           DATE_PART('hours', endTime) - DATE_PART('hours', startTime) <= 4
        AND
           startTime::date = endTime::date
        AND
           DATE_PART('hours', endTime) > DATE_PART('hours', startTime)
        AND
           startTime::time >= '10:00'
        AND
           endTime::time <= '22:00'
        )
);


--able to share the same promoCode. FD = free delivery
CREATE TABLE Promotions
(

    promoCode    VARCHAR(20),
    promoDesc    VARCHAR(200),
    createdBy    VARCHAR(50), --?
    applicableTo VARCHAR(200) REFERENCES Restaurants (rname) ON DELETE CASCADE,
    discUnit     VARCHAR(20) NOT NULL,
    discRate     INTEGER DEFAULT 0,
    startDate    TIMESTAMP   NOT NULL,
    endDate      TIMESTAMP   NOT NULL,
    PRIMARY KEY (promoCode, applicableTo),
    CHECK (discUnit = '$' OR discUnit = '%' OR discUnit = 'FD')

);

--TODO: TRIGGER FOR used reward Points make sure used reward points lesser than actual
CREATE TABLE Orders
(
    orderId          SERIAL,
    userId           INTEGER      NOT NULL REFERENCES Customers ON DELETE CASCADE ON UPDATE CASCADE,
    promoCode        VARCHAR(20),
    applicableTo     VARCHAR(200),
    modeOfPayment    VARCHAR(10)  NOT NULL,
    timeOfOrder      TIMESTAMP    NOT NULL,
    deliveryLocation VARCHAR(100) NOT NULL,
    usedRewardPoints INTEGER      NOT NULL DEFAULT 0,

    PRIMARY KEY (orderId),
    FOREIGN KEY (promoCode, applicableTo) REFERENCES Promotions,
    CHECK (modeOfPayment = 'cash' OR
           modeOfPayment = 'credit'),
    CHECK (usedRewardPoints = 5 OR usedRewardPoints = 10 OR usedRewardPoints = 15 OR usedRewardPoints = 0)

);

CREATE TABLE Contains
(
    orderId       INTEGER REFERENCES Orders ON DELETE CASCADE ON UPDATE CASCADE,
    rname         VARCHAR(100),
    fname         VARCHAR(100),
    foodQty       INTEGER NOT NULL,
    reviewContent VARCHAR(300),

    PRIMARY KEY (orderId, rname, fname),
    FOREIGN KEY (rname, fname) REFERENCES Sells (rname, fname),
    CHECK (foodQty >= 1)
);

CREATE TABLE Delivers
(
    orderId                  INTEGER REFERENCES Orders ON DELETE CASCADE ON UPDATE CASCADE,
    userId                   INTEGER NOT NULL,
    departTimeForRestaurant  TIMESTAMP,
    departTimeFromRestaurant TIMESTAMP,
    arrivalTimeAtRestaurant  TIMESTAMP,
    deliveryTimetoCustomer   TIMESTAMP,
    rating                   INTEGER,
    PRIMARY KEY (orderId),
    FOREIGN KEY (userId) REFERENCES Riders ON DELETE CASCADE,
    CHECK (rating <= 5)
);

CREATE TABLE MinSpendingPromotions
(
    promoCode    VARCHAR(20),
    applicableTo VARCHAR(200),
    minAmt       NUMERIC(8, 2) DEFAULT 0,
    PRIMARY KEY (promoCode, applicableTo),
    FOREIGN KEY (promoCode, applicableTo) REFERENCES Promotions ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CustomerPromotions
(
    promoCode            VARCHAR(20),
    applicableTo         VARCHAR(200),
    minTimeFromLastOrder INTEGER, -- # of days
    PRIMARY KEY (promoCode, applicableTo),
    FOREIGN KEY (promoCode, applicableTo) REFERENCES Promotions ON DELETE CASCADE ON UPDATE CASCADE
);


DROP VIEW IF EXISTS Rider_Schedule_Summary_Info;
DROP VIEW IF EXISTS Rider_Schedule_Info;
DROP VIEW IF EXISTS Rider_Delivery_Summary_Info;
DROP VIEW IF EXISTS Rider_Delivery_Info;

CREATE VIEW Rider_Delivery_Info AS (
    SELECT D.userId,
           ((SELECT EXTRACT(MONTH FROM O.timeoforder::date))) AS work_month,
           ((SELECT EXTRACT(YEAR FROM O.timeoforder::date))) AS work_year,
           O.orderId,
           O.timeoforder,
           D.deliveryTimetoCustomer,
           D.departTimeForRestaurant,
           D.rating,
           case --  determine delivery fee based on peak hours
               when ((O.timeoforder::time >= '12:00' and O.timeoforder::time <= '13:00')
                   OR (O.timeoforder::time >= '18:00' and O.timeoforder::time <= '20:00'))
                   then 10
               else 5 --delivery fee based on peak hour
               end as delivery_fee

    FROM delivers D join Orders O on (D.orderId = O.OrderId)
);

/* VIEWS FOR RIDER INFORMATION */
CREATE VIEW Rider_Delivery_Summary_Info AS
(
--userId, month, year, #ofDeliveries, AvgTimeDelivery, #rating, avgRating, total_del_fee
SELECT userId,
       work_month,
       work_year,
       count(*)                                       as NumDelivery,
       round(sum((extract(epoch from (deliveryTimetoCustomer - departTimeForRestaurant))) / 60)::numeric
           / count(userId)::numeric,2)                            as avgTimeDelivery,
       count(rating)                                  as numRating,
       round(sum(rating)::numeric / count(rating), 2) as avgRating,
       sum(delivery_fee)                              as Total_delivery_fee
FROM Rider_Delivery_Info R1
GROUP BY userId, work_month, work_year

    );

---FOR ORDERS CALCULATION---
DROP FUNCTION IF EXISTS calculatePrice CASCADE;
CREATE OR REPLACE FUNCTION calculatePrice(rname1 VARCHAR(20), fname1 VARCHAR(20), foodQty INTEGER)
    RETURNS NUMERIC(6, 2) AS
$$
DECLARE
    price NUMERIC(6, 2);

BEGIN
    SELECT S.price
    into price
    FROM SELLS S
    WHERE S.fname = fname1
      AND S.rname = rname1;
    RETURN price * foodQty;
END;

$$ LANGUAGE PLPGSQL
;

--nonpeak vs peak hour deliveryfee
DROP FUNCTION IF EXISTS getDeliveryFee CASCADE;
CREATE OR REPLACE FUNCTION getDeliveryFee(orderTime TIMESTAMP, orderId1 INTEGER)
    RETURNS NUMERIC(6, 2) AS
$$
DECLARE
    test   time;
    amount NUMERIC(6, 2);

BEGIN
    test = orderTime::time;
    CASE
        WHEN EXISTS(
                SELECT 1
                FROM Orders O
                         JOIN Promotions P ON O.promoCode = P.promoCode AND O.applicableTo = P.applicableTo
                WHERE O.orderId = orderId1
                  AND P.discUnit = 'FD'
            ) then amount = 0.00;
        WHEN test < '19:10:00' AND test > '17:00:00' then amount = 10.00;
        else amount = 5.00;
        END CASE;
    RETURN amount;
END;
$$ LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS getearnedRewardPts CASCADE;
CREATE OR REPLACE FUNCTION getearnedRewardPts(foodprice NUMERIC(6, 2))
    RETURNS NUMERIC(6, 0) AS
$$
SELECT FLOOR(foodprice / 10.0)
$$ LANGUAGE SQL;

DROP FUNCTION IF EXISTS getTotalPriceAdjustedForRewards CASCADE;
CREATE OR REPLACE FUNCTION getTotalPriceAdjustedForRewards(foodprice NUMERIC(6, 2), rewardPt INTEGER)
    RETURNS NUMERIC(6, 0) AS
$$
SELECT foodprice - (rewardPt / 5)
$$ LANGUAGE SQL;

DROP FUNCTION IF EXISTS calculateTotalPriceAfterPromotionAndRewards CASCADE;
CREATE OR REPLACE FUNCTION calculateTotalPriceAfterPromotionAndRewards(foodprice NUMERIC(6, 2),
                                                                       deliveryfee NUMERIC(6, 2),
                                                                       promoCode1 VARCHAR(20),
                                                                       applicableTo1 VARCHAR(200),
                                                                       usedRewardPoints INTEGER)
    RETURNS NUMERIC(6, 2) AS
$$
DECLARE
    amount   NUMERIC(6, 2);
    discRate INTEGER;

BEGIN
    SELECT P.discRate
    INTO discRate
    FROM PROMOTIONS P
    WHERE P.promoCode = promoCode1
      AND P.applicableTo = applicableTo1;
    CASE
        -- NO PROMOTION
        WHEN ((promoCode1 IS NULL))
            THEN amount =
                    (getTotalPriceAdjustedForRewards(foodprice, usedRewardPoints) + deliveryfee);
        -- $ PROMOTION
        WHEN EXISTS(
                SELECT 1
                FROM PROMOTIONS P
                WHERE P.promoCode = promoCode1
                  AND P.applicableTo = applicableTo1
                  AND P.discUnit = '$')
            THEN amount = (getTotalPriceAdjustedForRewards(foodprice, usedRewardPoints) - discRate
                + deliveryfee);
        -- Free Delivery PROMOTION
        WHEN EXISTS(
                SELECT 1
                FROM PROMOTIONS P
                WHERE P.promoCode = promoCode1
                  AND P.applicableTo = applicableTo1
                  AND P.discUnit = 'FD')
            THEN amount = (
                getTotalPriceAdjustedForRewards(foodprice, usedRewardPoints)
                );
        -- % PROMOTION
        WHEN EXISTS(
                SELECT 1
                FROM PROMOTIONS P
                WHERE P.promoCode = promoCode1
                  AND P.applicableTo = applicableTo1
                  AND P.discUnit = '%'
            ) THEN amount = getTotalPriceAdjustedForRewards(foodprice, usedRewardPoints) * (100 - discRate) / 100
            + deliveryfee;
        --throw error.
        ELSE amount = -1.00;
        END CASE;

    IF amount < 0 THEN
        RAISE EXCEPTION 'final price should be more than or equal to 0';
    END IF;

    RETURN amount;
END;
$$ LANGUAGE PLPGSQL;


DROP VIEW IF EXISTS OrderInfo CASCADE;
CREATE VIEW OrderInfo AS

SELECT O.orderId,
       O.userId,
       O.deliveryLocation,
       C.rname,
       sum(calculatePrice(C.rname, C.fname, C.foodQty))                                as totalFoodPrice,
       getDeliveryFee(O.timeOfOrder, O.orderId)                                        as deliveryfee,
       O.timeOfOrder,
       getearnedRewardPts(sum(calculatePrice(C.rname, C.fname, C.foodQty)))            as earnedRewardPts,
       O.usedRewardPoints,
       calculateTotalPriceAfterPromotionAndRewards(sum(calculatePrice(C.rname, C.fname, C.foodQty)),
                                                   getDeliveryFee(O.timeOfOrder, O.orderId), O.promoCode,
                                                   O.applicableTo, O.usedRewardPoints) as finalPrice

FROM ORDERS O
         JOIN CONTAINS C ON O.orderId = C.orderId
GROUP BY O.orderId, C.rname, O.timeOfOrder
ORDER BY O.orderId ASC;
---END OF ORDERS CALCULATION---


-- returns 1 if Rider is working and 0 if Rider is not working
DROP FUNCTION IF EXISTS checkWorkingStatusHelperOfRider CASCADE;
CREATE OR REPLACE FUNCTION checkWorkingStatusHelperOfRider(riderId INTEGER, current TIMESTAMP)
    RETURNS INTEGER AS
$$
DECLARE
    currentDate DATE;
    currentTime TIME;
    result      INTEGER;

BEGIN
    currentTime = current::time;
    currentDate = current::date;

    CASE
        WHEN EXISTS(
                SELECT 1
                FROM Intervals I
                WHERE I.startTime::time <= currentTime
                  AND I.endTime::time > currentTime
                  AND I.startTime::date = currentDate
                  AND I.scheduleId = (SELECT W.scheduleId
                                      FROM Weekly_Work_Schedules W
                                      WHERE W.startDate::date <= currentDate
                                        AND W.endDate::date >= currentDate
                                        AND W.userId = riderId)
            ) THEN result = 1;
        ELSE result = 0;
        END CASE;
    RETURN result;
END;
$$ LANGUAGE PLPGSQL;

--returns 1 if rider is available and 0 if not working and 2 if currently on delivery
DROP FUNCTION IF EXISTS findStatusOfRider CASCADE;
CREATE OR REPLACE FUNCTION findStatusOfRider(riderId INTEGER, current TIMESTAMP)
    RETURNS INTEGER AS
$$
DECLARE
    latestDelivery TIMESTAMP;
    result         INTEGER;

BEGIN
    SELECT D.deliveryTimetoCustomer
    INTO latestDelivery
    FROM Delivers D
    WHERE D.userId = riderId
    ORDER BY D.deliveryTimetoCustomer desc
    LIMIT 1;

    IF latestDelivery IS NULL THEN
        latestDelivery = '1970-01-01 00:00:00';
    END IF;

    CASE
        WHEN checkWorkingStatusHelperOfRider(riderId, current) = 0 then result = 0;
        WHEN latestDelivery < current THEN result = 1;
        WHEN current <= latestDelivery THEN result = 2;
        ELSE result = -1;
        END CASE;
    RETURN result;
END;
$$ LANGUAGE PLPGSQL;


CREATE VIEW Rider_Schedule_Info AS
(
SELECT userId,
       ((SELECT EXTRACT(MONTH FROM S.startDate::date)))                AS work_month,
       ((SELECT EXTRACT(YEAR FROM S.endDate::date)))                   AS work_year,
       I.startTime,
       I.endTime,
       date_part('hours', I.endTime) - date_part('hours', I.startTime) as intervalDuration
FROM Weekly_Work_Schedules S
         join intervals I on (S.scheduleId = I.scheduleId)
    );


CREATE VIEW Rider_Schedule_Summary_Info AS
(
--userId, #ofDeliveries, AvgTimeDelivery, #rating
SELECT userId,
       work_month,
       work_year,
       sum(intervalDuration) as numHoursWorked,
       case --  determine salary based on FT/PT status
           when userId not in (select distinct PT.userId from Part_Time PT)
               then (sum(intervalDuration)) * 5 --FT rate
           else (sum(intervalDuration)) * 2 --PT rate
           end               as Salary
FROM Rider_Schedule_Info
GROUP BY userId, work_month, work_year
    );



CREATE VIEW Customer_General_Info AS
(
WITH Monthly_New_Customer AS (
    SELECT COUNT(C.userId)                    as numNewCustomers,
           DATE_PART('Months', U.dateCreated) as month,
           DATE_PART('Years', U.dateCreated)  as year
    FROM Customers C
             join Users U using (userId)
    GROUP BY DATE_PART('Months', U.dateCreated), DATE_PART('Years', U.dateCreated)
),
     Monthly_Orders_Info AS (
         SELECT COUNT(O.orderId)                                 as numOrder,
                sum(calculatePrice(C.rname, C.fname, C.foodQty)) as totalCost,
                DATE_PART('Months', O.timeOfOrder)               as month,
                DATE_PART('Years', O.timeOfOrder)                as year
         FROM Orders O
                  join Contains C using (orderId)
         GROUP BY DATE_PART('Months', O.timeOfOrder), DATE_PART('Years', O.timeOfOrder)
     )
SELECT COALESCE(MNC.numNewCustomers, 0) as newCustomers,
       COALESCE(MOI.numOrder, 0)        as numOrder,
       COALESCE(MOI.totalCost, 0)       as totalCost,
       COALESCE(MNC.month, MOI.month)   as month,
       COALESCE(MNC.year, MOI.year)     as year
FROM Monthly_New_Customer MNC
         full join Monthly_Orders_Info MOI
                   on (MNC.month = MOI.month) and (MNC.year = MOI.year)
    );

CREATE VIEW Order_Hourly_Summary AS
(

SELECT EXTRACT(hour from O.timeOfOrder)   as hours,
       DATE_PART('days', O.timeOfOrder)   as days,
       DATE_PART('Months', O.timeOfOrder) as months,
       DATE_PART('Years', O.timeOfOrder)  as years,
       O.deliveryLocation,
       COUNT(O.orderId)                   as numOrder
FROM Orders O
GROUP BY (O.deliveryLocation, EXTRACT(hour from O.timeOfOrder),
          DATE_PART('days', O.timeOfOrder),
          DATE_PART('Months', O.timeOfOrder),
          DATE_PART('Years', O.timeOfOrder))
    );
CREATE OR REPLACE FUNCTION check_Restaurant_MinOrderAmt()
    RETURNS
        TRIGGER
AS
$$
DECLARE
    checkTotalAmt       NUMERIC(8, 2);
    minRestaurantAmount NUMERIC(8, 2);
BEGIN
    SELECT DISTINCT minorderamt
    INTO minRestaurantAmount
    FROM Restaurants R
    WHERE R.rname = (SELECT DISTINCT C.rname FROM Contains C WHERE C.orderId = NEW.orderId limit 1)
    limit 1;

    SELECT sum(calculatePrice(C.rname, C.fname, C.foodQty))
    INTO checkTotalAmt
    FROM Contains C
    WHERE C.orderId = NEW.orderId;

    IF minRestaurantAmount > checkTotalAmt THEN
        RAISE EXCEPTION 'Did not hit the total amount of food to be bought at the restaurant';
    END IF;
    RETURN NULL;
END;

$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS orders_trigger ON Orders CASCADE;
CREATE CONSTRAINT TRIGGER order_trigger
    AFTER INSERT
    ON Orders
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_Restaurant_MinOrderAmt();


-- check promo trigger
CREATE OR REPLACE FUNCTION check_Promo_minAmt()
    RETURNS
        TRIGGER
AS
$$
DECLARE
    checkTotalAmt  NUMERIC(8, 2);
    minPromoAmount NUMERIC(8, 2);
BEGIN
    SELECT DISTINCT minAmt
    INTO minPromoAmount
    FROM MinSpendingPromotions M
    WHERE M.promocode = NEW.promocode
    LIMIT 1;

    SELECT sum(calculatePrice(C.rname, C.fname, C.foodQty))
    INTO checkTotalAmt
    FROM Contains C
    WHERE C.orderId = NEW.orderId;

    IF (minPromoAmount is not null) and minPromoAmount > checkTotalAmt THEN
        RAISE EXCEPTION 'Did not hit the total amount spent to use this promo';
    END IF;
    RETURN NULL;
END;

$$ LANGUAGE PLPGSQL;


DROP TRIGGER IF EXISTS orders_minAmt_trigger ON Orders CASCADE;
CREATE CONSTRAINT TRIGGER order_minAmt_trigger
    AFTER INSERT
    ON Orders
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW
EXECUTE FUNCTION check_Promo_minAmt();

-- need to create this view because select attributes in orderby needs to be in select distinct as well,
--which doesn't work here
DROP VIEW IF EXISTS PastFiveDeliveryLoc;
CREATE VIEW PastFiveDeliveryLoc AS
(
WITH CustomerLatestOIDDeliveryLoc AS (
    SELECT O.userid, O.deliveryLocation, MAX(O.orderId) as orderId
    FROM Orders O
    GROUP BY (O.userid, O.deliveryLocation)
)
SELECT C.userId, C.deliveryLocation, C.orderId
FROM CustomerLatestOIDDeliveryLoc C
ORDER BY C.orderId DESC
    )
;

DROP VIEW IF EXISTS RiderSummary;
CREATE VIEW RiderSummary AS
(
select userId,
       coalesce(r1.work_month, r2.work_month) as work_month,
       coalesce(r1.work_year, r2.work_month) as work_year,
       coalesce(NumDelivery, 0) as NumDelivery,
       coalesce(AvgTimeDelivery, 0) as AvgTimeDelivery,
       coalesce(numRating, 0) as numRating,
       coalesce(avgRating, NULL) as avgRating,
       coalesce(numHoursWorked, 0) as numHoursWorked,
       coalesce(Total_delivery_fee, 0) as Total_delivery_fee,
       coalesce(salary, 0) + coalesce(Total_delivery_fee, 0) as TotalSalary
from (Riders left join Rider_Delivery_Summary_Info r1 using (userId)) left join Rider_Schedule_Summary_Info r2 using (userId, work_month, work_year)
order by userId
)
;

DROP TRIGGER IF EXISTS mws_5days_trigger ON Monthly_Work_Schedules CASCADE;
DROP TRIGGER IF EXISTS mws_28days_trigger ON Monthly_Work_Schedules CASCADE;
DROP TRIGGER IF EXISTS mws_predefined_interval_trigger ON Monthly_Work_Schedules CASCADE;
DROP TRIGGER IF EXISTS interval_overlap_trigger ON Intervals CASCADE;
DROP TRIGGER IF EXISTS wws_duration_trigger ON Weekly_Work_Schedules CASCADE;
DROP TRIGGER IF EXISTS wws_seven_days_trigger ON Weekly_Work_Schedules CASCADE;
DROP TRIGGER IF EXISTS wws_overlap_trigger ON Weekly_Work_Schedules CASCADE;
DROP TRIGGER IF EXISTS orders_insert_trigger ON Orders CASCADE;
DROP TRIGGER IF EXISTS check_availability_sells_update_trigger ON Sells CASCADE;


DROP FUNCTION IF EXISTS findRiderToDeliverOrder CASCADE;
DROP FUNCTION IF EXISTS insertDelivers CASCADE;
