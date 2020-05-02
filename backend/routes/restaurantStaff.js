var express = require('express');
var router = express.Router();

const pool = require('../database/db');

async function selectRname(data, table, condition, userId) {
    try {
        const res = await pool.query(
            `SELECT ${data} FROM ${table} ${condition}`, [userId]
        );
        return res.rows[0][data];
    } catch (err) {
        return err.stack;
    }
}

router.post('/createMinSpendingPromotion', async (req, res) => {
    const client = await pool.connect();
    try {
        console.log(req.body);
        const userId = req.body.userId;
        const promoCode = req.body.promoCode;
        const promoType = req.body.promoType;
        const startDate = req.body.startDate; //user input
        const endDate = req.body.endDate;
        const minSpendingAmt = req.body.minSpendingAmt;
        const discAmt = req.body.discAmt;
        const discUnit = req.body.discUnit;
        const description = req.body.description;
        var rname = '';
        await client.query('BEGIN').then(async (result) => {
            rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
            console.log(rname);
            client.query(`INSERT INTO Promotions(promoCode, promoDesc, createdBy, applicableTo, 
            discUnit, discRate, startDate, endDate) VALUES ($1,$2,$3,$3,$4,$5,$6,$7)`,
                [promoCode, description, rname, discUnit, discAmt, startDate, endDate])
                .then(result => {
                    client.query(`INSERT INTO MinSpendingPromotions(promoCode, applicableTo, minAmt) VALUES ($1,$2,$3)`,
                        [promoCode, rname, minSpendingAmt]).then(result => {
                        })

                    client.query('COMMIT');
                    client.release()
                })
        }
        )
        console.log('Added');
        res.json(`Promo Code: ${promoCode} added to ${rname} successfully! `);
    } catch (err) {
        client.query(`ROLLBACK`);
        client.release()
        console.error("error triggered: ", err.message);
    }
})



router.get('/getMonthlyCompletedOrder', async (req, res) => {
    console.log("trying...");
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    const month = req.query.month;
    const rname = req.query.rname;
    console.log(userId + "\n" + month + "\n" + year);
    /*
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
        */
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

//returns an array of size starting from index 0 - 4 of top 5 food in pairs(fname, number of orders for the fname)
router.get('/getMonthlyTop5Food', async (req, res) => {
    const month = req.body.month;
    const rname = req.body.rname;
    //console.log(month + " " + rname);
    const query1 = `SELECT C.fname, count(O.orderId)
                    FROM Orders O JOIN Contains C ON O.orderId = C.orderId
                    WHERE C.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month}
                    GROUP BY C.fname
                    ORDER BY count(O.orderId) desc
                    LIMIT 5;`
    //console.log(query1);
    pool.query(query1).then(result => {
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

router.get('/getPromotionDuration', async (req, res) => {
    const promoCode = req.body.promoCode;
    const applicableTo = req.body.applicableTo;
    //console.log(promoCode + " " + applicableTo);
    const query1 = `SELECT coalesce((P.endDate::date -  P.startDate::date), 0) as durationOfPromotion
                    FROM Promotions P
                    WHERE P.promoCode = '${promoCode}' AND P.applicableTo = '${applicableTo}';`
    //console.log(query1);
    pool.query(query1).then(result => {
        let resDuration = result.rows;
        console.log(resDuration[0]);
        res.json(resDuration[0].durationofpromotion);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });
})

router.get('/getOrdersReceivedDuringPromotion', async (req, res) => {
    const promoCode = req.body.promoCode;
    const applicableTo = req.body.applicableTo;
    //console.log(promoCode + " " + applicableTo);
    const query1 = `SELECT coalesce(count(distinct O.orderId),0) as ordersReceivedDuringPromotion
                    FROM Orders O
                    WHERE O.promoCode = '${promoCode}' AND O.applicableTo = '${applicableTo}'`
    //console.log(query1);
    pool.query(query1).then(result => {
        let resOrders = result.rows;
        console.log(resOrders[0]);
        res.json(resOrders[0].ordersreceivedduringpromotion);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });
})

// Create a Sells r/s
router.post("/insertSells", async (req, res) => {
    const client = await pool.connect();
    try {
        const rname = req.body.rname;
        const fname = req.body.fname;
        const price = req.body.price;
        const availability = req.body.availability;
        client
            .query(`INSERT INTO sells (rname, fname, price, availability) VALUES ($1, $2, $3, $4)`, [
                rname,
                fname,
                price,
                availability,
            ])
            .catch((err) => console.log(err));
        return res.json(`${rname} and ${fname} added`);
    } catch (err) {
        console.error("error triggered: ", err.message);
    }
});




module.exports = router;