var express = require('express');
var router = express.Router();
var url = require('url');

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
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    const month = req.query.month;
    const year = req.query.year;
    var rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
    //console.log(userId + "\n" + month + "\n" + year + "\n" + rname);
    const query1 = `SELECT COUNT(O.orderId) 
                        FROM OrderInfo O
                        WHERE O.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month}
                        AND EXTRACT(YEAR from O.timeOfOrder) = ${year};`
    //console.log(query1);
    pool.query(query1).then(result => {
        let rescount = result.rows[0];
        //console.log(rescount);
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
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    const month = req.query.month;
    const year = req.query.year;
    var rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
    const query2 = `SELECT sum(O.totalFoodPrice) as monthlyCost
                    FROM OrderInfo O
                    WHERE O.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month} AND EXTRACT(YEAR from O.timeOfOrder) = ${year};`
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
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    const month = req.query.month;
    const year = req.query.year;
    var rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
    //console.log(month + " " + rname);
    const query1 = `SELECT C.fname, count(O.orderId)
                    FROM Orders O JOIN Contains C ON O.orderId = C.orderId
                    WHERE C.rname = '${rname}' AND EXTRACT(month from O.timeOfOrder) = ${month} AND EXTRACT(YEAR from O.timeOfOrder) = ${year}
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
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    const promoCode = req.query.promoCode;
    var applicableTo = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
    //console.log(promoCode + " " + applicableTo);
    const query1 = `SELECT P.startDate, P.endDate, coalesce((P.endDate::date -  P.startDate::date), 0) as durationOfPromotion
                    FROM Promotions P
                    WHERE P.promoCode = '${promoCode}' AND P.applicableTo = '${applicableTo}';`
    //console.log(query1);
    pool.query(query1).then(result => {
        //let resDuration = result.rows;
        //console.log(resDuration[0]);
        res.json(result.rows);
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
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    const promoCode = req.query.promoCode;
    var applicableTo = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
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
        const userId = req.body.userId;
        const category = req.body.category;
        var rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
        console.log("rname is :" + rname);
        const fname = req.body.fname;
        const price = req.body.price;
        const availability = req.body.availability;
        console.log(userId + " " + rname + " " + category + " " + fname + " " + price + " " + availability + " ");
        await client.query('BEGIN').then(async (result) => {
            console.log('trying');
            client.query(`INSERT INTO Food (fname, category) SELECT '${fname}', '${category}'
            WHERE NOT EXISTS (SELECT fname FROM Food WHERE fname = '${fname}')`)
                .then(result => {
                    console.log('trying2');
                    client.query(`INSERT INTO sells(rname, fname, price, availability) VALUES($1, $2, $3, $4)`,
                        [rname, fname, price, availability])
                        .then(result => {
                        })
                    client.query('COMMIT');
                    client.release()
                })
        }
        )
        console.log('Added');
        res.json('Success');
    } catch (err) {
        client.query(`ROLLBACK`);
        client.release()
        console.error("error triggered: ", err.message);
    }
});




router.get("/getMenu", async (req, res) => {
    var parts = url.parse(req.url, true);
    const userId = req.query.userId;
    var rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
    const query = `SELECT S.fname, S.price, S.availability FROM Sells S WHERE S.rname = '${rname}'`;
    pool.query(query).then(result => {
        let menu = result.rows;
        console.log(menu);
        res.json(menu);
    }).catch(err => {
        if (err.constraint) {
            console.error(err.constraint);
        } else {
            console.log(err);
            res.json(err);
        }
    });
});

router.post('/deleteSells', async (req, res) => {
    const userId = req.body.userId;
    var rname = await selectRname('rname', 'restaurant_staff', `WHERE userId = $1`, userId);
    const fname = req.body.fname;
    const text = `DELETE FROM SELLS WHERE rname = '${rname}' and fname = '${fname}'`
    pool
        .query(text)
        .then(result => {
            console.log("Deleted");
            res.json("deleted");
        })
        .catch(e => console.error(e.stack))
})

module.exports = router;