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
/*
SELECT count(R.userId)
FROM Riders R
WHERE checkWorkingStatusHelperOfRider(R.userId, '2020-11-12 11:10:00') = 1;

*/
// not tested yet
router.get('/checkStatus', async (req, res) => {
    const timeArr = ["10:00:00", '11:10:00', "12:00:00", "13:00:00", "14:00:00"
    , "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00",
    "21:00:00", "22:00:00"]
    const day = req.body.day; //example 2020-11-12
    let querytime = "";

    //console.log(querytime);
    //console.log('2020-11-12 11:10:00');

    let resArr = [];
/*
    pool.query(query).then(result => {
        console.log('result:', result.rows[0].count);
        res.json(result.rows[0].count);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });
    */

    for(let i = 0; i < timeArr.length; i++) {


        querytime = day + " " + timeArr[i];
        let query = `SELECT count(R.userId)
        FROM Riders R
        WHERE checkWorkingStatusHelperOfRider(R.userId, '${querytime}') = 1;`;

        await pool.query(query).then(async result => {

            // let noOfriders = result.rows;
            // console.log(result.rows);

            console.log(resArr);
            await resArr.push(result.rows[0].count);
            }).catch(err => {
                if (err.constraint) {
                    console.error(err.constraint);
                } else {
                    console.log(err);
                    res.json(err);
                }
        });

    }
    console.log("test" + resArr);
    res.json({"data": resArr});
})

