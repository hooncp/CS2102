--TODO: figure out how to change query ratings/salary/from change in table

--find a query that displays the ratings
SELECT avg(D.rating)
FROM Delivery_Details D
WHERE D.userID = 5 AND D.rating IS NOT NULL;

--test if it affects delivery_details
BEGIN;
    DELETE FROM Part_time WHERE userId = 5;
    INSERT INTO Full_time(userId) VALUES (5);
COMMIT;

/*
For each rider and for each month, the total number of orders delivered by the rider for that
month, the total number of hours worked by the rider for that month, the total salary earned
by the rider for that month, the average delivery time by the rider for that month, the number
of ratings received by the rider for all the orders delivered for that month, and the average
rating received by the rider for all the orders delivered for that month.
*/

WITH RiderDetails AS (
    SELECT R.userId, D.rating, age(D.deliveryTimetoCustomer, D.departTimeForRestaurant) as timeTaken, D.deliveryId
    FROM Riders R left join Delivery_Details D ON R.userId = D.userId
)
SELECT R.userId, coalesce(count(R.deliveryId), 0) as totalOrders, 
                avg(R.timeTaken) as averageTime,
                coalesce(count(R.rating), 0) as totalNoOfRating, 
                coalesce(avg(R.rating), 0) as averageRating
FROM RiderDetails R
GROUP BY R.userId;


