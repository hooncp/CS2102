var express = require('express');
var router = express.Router();

const pool = require('../database/db');


router.get('/getMonthlyCompletedOrder', async (req, res) => {
    const month = req.body.month;
    const rname = req.body.rname;
    //console.log(month + " " + rname);
    
    const query1 = `SELECT COUNT(O.orderId) 
                    FROM OrderInfo O
                    WHERE O.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month};`
    //console.log(query1);
    pool.query(query1).then(result => {
        let rescount = result.rows[0];
        //console.log(result);
        res.json(rescount.count);
    }).catch(err => {
        if (err.constraint) {
			console.error(err.constraint);
		} else {
			console.log(err);
			res.json(err);
		}
    });
})

router.get('/getMonthlyCostofCompletedOrder', async (req, res) => {
    const month = req.body.month;
    const rname = req.body.rname;
    //console.log(month + " " + rname);
    const query2 = `SELECT sum(O.totalFoodPrice) as monthlyCost
                    FROM OrderInfo O
                    WHERE O.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month};`
    //console.log(query1);
    pool.query(query2).then(result => {
        let rescost = result.rows[0];
        res.json(rescost.monthlycost);
    }).catch(err => {
        if (err.constraint) {
			console.error(err.constraint);
		} else {
			console.log(err);
			res.json(err);
		}
    });
})

//returns an array of size starting from index 0 - 4 of top 5 food in pairs(fname, count)
router.get('/getMonthlyTop5Food', async (req, res) => {
    const month = req.body.month;
    const rname = req.body.rname;
    //console.log(month + " " + rname);
    const query2 = `SELECT C.fname, count(O.orderId)
                    FROM Orders O JOIN Contains C ON O.orderId = C.orderId
                    WHERE C.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month}
                    GROUP BY C.fname
                    ORDER BY count(O.orderId) desc
                    LIMIT 5;`
    //console.log(query1);
    pool.query(query2).then(result => {
        let sendResult = [];
        let resTop5 = result.rows;
        for (var i = 0; i < resTop5.length; i++) {
            sendResult[i] = [resTop5[i].fname, resTop5[i].count];
        }
        //console.log(resTop5);
        res.json(sendResult);
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