var express = require('express');
var router = express.Router();

const pool = require('../database/db');
/* DEPRECATED */
// //8. averaged rating received by rider for orders delivered that month
// router.get('/getMonthlyAvgRating', async (req,res)=> {
//     const month = req.body.month;
//     const query = `SELECT round(sum(rating)::numeric/count(rating),2) as avgRating ,userId
// 	FROM Delivers D
// 	WHERE DATE_PART('MONTHS',D.deliveryTimetoCustomer) = ${month}
// 	GROUP BY userId
// 	;`
//     pool.query(query).then(result => {
//         let avgRating = (result.rows);
//         console.log('num of ratings:', avgRating);
//         res.json(avgRating);
//     }).catch(err => {
//         if (err.constraint) {
//             console.error(err.constraint);
//         } else {
//             console.log(err);
//             res.json(err);
//         }
//     });
//
// })
//
// //7. number of ratings received by rider for all orders delivered for that month
// router.get('/getMonthlyNumRating', async (req,res)=> {
//     const month = req.body.month;
//     const query = `SELECT count(rating) as numRating, userId
// 	FROM Delivers D
// 	WHERE DATE_PART('MONTHS',D.deliveryTimetoCustomer) = ${month}
// 	GROUP BY userId
// 	;`
//     pool.query(query).then(result => {
//         let numRating =  result.rows
//         console.log('num of ratings:', numRating);
//         res.json(numRating);
//     }).catch(err => {
//         if (err.constraint) {
//             console.error(err.constraint);
//         } else {
//             console.log(err);
//             res.json(err);
//         }
//     });
//
// })
//
// // 6. average delivery time by the rider for that month
// //departTimeForRestaurant - deliveryTimetoCustomer = delivery time
// // average delivery time = total delivery time / total num of orders [monthly]
// router.get('/getMonthlyAverageDeliveryTime', async (req,res)=>{
//     const month = req.body.month;
//     const query = `select sum((extract(epoch from (deliveryTimetoCustomer - departTimeForRestaurant)))/60)
// 		/count(userId) as avgTime, userId
// 		FROM Delivers D
// 		WHERE DATE_PART('months',D.deliveryTimetoCustomer) = ${month}
// 		GROUP BY userId`
//     pool.query(query).then(result => {
//             let avgTime = result.rows
//             console.log('result:', avgTime);
//             res.json(avgTime);
//     }).catch(err => {
//         if (err.constraint) {
//             console.error(err.constraint);
//         } else {
//             console.log(err);
//             res.json(err);
//         }
//     });
//
// })
//
// module.exports = router;
//
// // View all riders monthly salary
//
// router.get('/viewMonthRidersSalary', (req, res) => {
//     const month = req.body.month;
//     const year = req.body.year;
//     const text = `with result as (
//     select userId, startTime, endTime, date_part('hours', endTime) - date_part('hours', startTime) as duration
// from Weekly_Work_Schedules S join intervals I
// on (S.scheduleId = I.scheduleId)
// and (SELECT EXTRACT(MONTH FROM S.startDate::date)) = $1
// and (SELECT EXTRACT(YEAR FROM S.startDate::date)) = $2
// ),
// result2 (userId, total_hours_worked) as (
//     select userId, sum(duration) from result group by userid
//
// union
//
// select userId, 0
// from riders R
// where R.userId not in (select distinct userId from result)
// ),
// result3 as (
//     SELECT D.userId, D.deliveryTimetoCustomer, case
// when ((deliveryTimetoCustomer::time >= '12:00' and deliveryTimetoCustomer::time <= '13:00')
// OR (deliveryTimetoCustomer::time >= '18:00' and deliveryTimetoCustomer::time <= '20:00'))
// then 4
// else 2
// end as delivery_fee
// FROM Delivers D
// WHERE (SELECT EXTRACT(MONTH FROM D.deliveryTimetoCustomer::date)) = $1
// AND (SELECT EXTRACT(YEAR FROM D.deliveryTimetoCustomer::date)) = $2
// ),
// result4 (userId, total_delivery_fee_earned) as (
//     select userId, sum(delivery_fee) from result3 group by userid
//
// union
//
// select userId, 0
// from riders R
// where R.userId not in (select distinct userId from result3)
// )
// select R2.userId, R2.total_hours_worked, R4.total_delivery_fee_earned, case
// when R2.userId not in (select PT.userId from Part_Time PT) then (R2.total_hours_worked * 5 + R4.total_delivery_fee_earned)
// else (R2.total_hours_worked * 2 + R4.total_delivery_fee_earned) --part_time
// end as Salary
// from result2 R2 join result4 R4 on (R2.userId = R4.userId)
// order by userId`;
//
//     const values = [month, year];
//     pool
//         .query(text, values)
//         .then(result => {
//             console.log(result.rows);
//             res.json(result.rows);
//         })
//         .catch(e => console.error(e.stack))
// })
//
//
// // View all rider hours worked
// router.get('/viewMonthRidersHoursWorked', (req, res) => {
//     const month = req.body.month;
//     const year = req.body.year;
//     const text = `with result as (
//         select userId, startTime, endTime, date_part('hours', endTime) - date_part('hours', startTime) as duration
//     from Weekly_Work_Schedules S join intervals I
//     on (S.scheduleId = I.scheduleId)
//     and (SELECT EXTRACT(MONTH FROM S.startDate::date)) = $1
//     and (SELECT EXTRACT(YEAR FROM S.startDate::date)) = $2
// ),
//     result2 (userId, total_hours_worked) as (
//         select userId, sum(duration) from result group by userid
//
//     union
//
//     select userId, 0
//     from riders R
//     where R.userId not in (select distinct userId from result)
// )
//
//     select * from result2 order by userId`;
//
//     const values = [month, year];
//     pool
//         .query(text, values)
//         .then(result => {
//             console.log(result.rows);
//             res.json(result.rows);
//         })
//         .catch(e => console.error(e.stack))
// })
//
// // view all rider # of orders delivered
// router.get('/viewMonthRidersPastOrder', (req, res) => {
//     const month = req.body.month;
//     const year = req.body.year;
//     const text = `with result as (
//     SELECT userId, count(*) as num_CompletedOrders from delivers D
//         WHERE (SELECT EXTRACT(MONTH FROM D.deliveryTimetoCustomer::date)) = $1
//         AND (SELECT EXTRACT(YEAR FROM D.deliveryTimetoCustomer::date)) = $2
//         group by userId
//
//         union
//
//         select userId, 0 from riders R
//         where R.userId not in (select distinct userId from delivers)
//     )
//     select * from result order by userId
//     `
//
//     const values = [month, year];
//     pool
//         .query(text, values)
//         .then(result => {
//             console.log(result.rows);
//             res.json(result.rows);
//         })
//         .catch(e => console.error(e.stack))
// })


//view entire summary statistics
router.get('/viewCustomerGeneralInfo', (req,res) => {
    const month = req.body.month;
    const year = req.body.year;
    const query = `
    SELECT newCustomers, numOrder ,totalCost, C.month, C.year
    FROM Customer_General_Info C
    WHERE month = $1
    AND year = $2;
    `
    const fields = [month,year];
    pool.query(query,fields)
        .then(result => {
        res.json(result.rows);
    })
})

router.get('/viewHourlyOrderInfo', (req,res) => {
    const hour = req.body.hour;
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    const query = `
    SELECT *
    FROM Order_Hourly_Summary C
    WHERE hours = $1 
    AND days = $2 
    AND months = $3
    AND years = $4;
    `
    const fields = [hour,day,month,year];
    pool.query(query,fields)
        .then(result => {
            res.json(result.rows);
        })
})

router.get('/viewMonthRidersSummary', (req, res) => {
    const month = req.body.month;
    const year = req.body.year;
    const text = `with r1 as (
    select * from Rider_Delivery_Summary_Info D where D.work_month = $1 and D.work_year = $2
    ), 
    r2 as (
    select * from Rider_Schedule_Summary_Info S where S.work_month = $1 and S.work_year = $2
    )
    select userId, 
    coalesce(r1.work_month, $1) as work_month,
    coalesce(r1.work_year, $2) as work_year,
    coalesce(NumDelivery, 0) as NumDelivery,
    coalesce(AvgTimeDelivery, 0) as AvgTimeDelivery,
    coalesce(numRating, 0) as numRating,
    coalesce(avgRating, NULL) as avgRating,
    coalesce(numHoursWorked, 0) as numHoursWorked,
    coalesce(Total_delivery_fee, 0) as Total_delivery_fee,
    coalesce(salary, 0) + coalesce(Total_delivery_fee, 0) as TotalSalary
    from (Riders left join r1 using (userId)) left join r2 using (userId)
    order by userId;
    `;

    const values = [month, year];
    pool
        .query(text, values)
        .then(result => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch(e => console.error(e.stack))
})
module.exports = router;

