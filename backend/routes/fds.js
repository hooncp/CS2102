var express = require('express');
var router = express.Router();

const pool = require('../database/db');

//8. averaged rating received by rider for orders delivered that month
router.get('/getMonthlyAvgRating', async (req,res)=> {
    const month = req.body.month;
    const query = `SELECT round(sum(rating)::numeric/count(rating),2) as avgRating ,userId
	FROM Delivers D
	WHERE DATE_PART('MONTHS',D.deliveryTimetoCustomer) = ${month}
	GROUP BY userId
	;`
    pool.query(query).then(result => {
        let avgRating = (result.rows);
        console.log('num of ratings:', avgRating);
        res.json(avgRating);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });

})

//7. number of ratings received by rider for all orders delivered for that month
router.get('/getMonthlyNumRating', async (req,res)=> {
    const month = req.body.month;
    const query = `SELECT count(rating) as numRating, userId
	FROM Delivers D
	WHERE DATE_PART('MONTHS',D.deliveryTimetoCustomer) = ${month}
	GROUP BY userId
	;`
    pool.query(query).then(result => {
        let numRating =  result.rows
        console.log('num of ratings:', numRating);
        res.json(numRating);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });

})

// 6. average delivery time by the rider for that month
//departTimeForRestaurant - deliveryTimetoCustomer = delivery time
// average delivery time = total delivery time / total num of orders [monthly]
router.get('/getMonthlyAverageDeliveryTime', async (req,res)=>{
    const month = req.body.month;
    const query = `select sum((extract(epoch from (deliveryTimetoCustomer - departTimeForRestaurant)))/60)
		/count(userId) as avgTime, userId
		FROM Delivers D
		WHERE DATE_PART('months',D.deliveryTimetoCustomer) = ${month}
		GROUP BY userId`
    pool.query(query).then(result => {
            let avgTime = result.rows
            console.log('result:', avgTime);
            res.json(avgTime);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });

})

module.exports = router;

// View all riders monthly salary


// View all rider hours worked
router.get('/viewMonthRidersHoursWorked', (req, res) => {
    const month = req.body.month;
    const year = req.body.year;
    const text = `with result as (
        select userId, startTime, endTime, date_part('hours', endTime) - date_part('hours', startTime) as duration
    from Weekly_Work_Schedules S join intervals I
    on (S.scheduleId = I.scheduleId)
    and (SELECT EXTRACT(MONTH FROM S.startDate::date)) = $1
    and (SELECT EXTRACT(YEAR FROM S.startDate::date)) = $2
),
    result2 (userId, total_hours_worked) as (
        select userId, sum(duration) from result group by userid

    union

    select userId, 0
    from riders R
    where R.userId not in (select distinct userId from result)
)

    select * from users`;

    const values = [month, year];
    pool
        .query(text, values)
        .then(result => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch(e => console.error(e.stack))
})

// view all rider # of orders delivered
router.get('/viewMonthRidersPastOrder', (req, res) => {
    const month = req.body.month;
    const year = req.body.year;
    const text = `with result as (
    SELECT userId, count(*) as num_CompletedOrders from delivers D
        WHERE (SELECT EXTRACT(MONTH FROM D.deliveryTimetoCustomer::date)) = $1
        AND (SELECT EXTRACT(YEAR FROM D.deliveryTimetoCustomer::date)) = $2
        group by userId

        union 

        select userId, 0 from riders R
        where R.userId not in (select distinct userId from delivers)
    )
    select * from result order by userId
    `

    const values = [month, year];
    pool
        .query(text, values)
        .then(result => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch(e => console.error(e.stack))
})
