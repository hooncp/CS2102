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

//For each for each month and for each customer who has placed some order for that month,
// the total number of orders placed by the customer for that month and the total cost of all these orders.
router.get('/viewMonthlyCustomerSummary', (req, res) => {
    const month = req.body.month;
    const year = req.body.year;
    const text = `SELECT userId, count(*) AS NumOrder, sum(finalprice) AS TotalOrderCost
                    FROM OrderInfo O
                    WHERE ((SELECT EXTRACT(MONTH FROM timeoforder::date))) = $1 
                    AND ((SELECT EXTRACT(YEAR FROM timeoforder::date))) = $2
                    GROUP BY userId`;

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

// For each for each month and for each customer who has placed some order for that month,
// the total number of orders placed by the customer for that month and the total cost of all
// these orders.