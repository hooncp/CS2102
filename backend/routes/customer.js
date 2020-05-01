var express = require('express');
var router = express.Router();
const pool = require('../database/db');

router.post('/insertCustomer', async (req, res) => {
    //console.log("succeed");
    const client = await pool.connect();
    try {
        let currId = 0;
        const name = req.body.name;
        const creditcardinfo = req.body.creditcardinfo;
        //https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
        let dateCreated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
        console.log(dateCreated);
        client.query('BEGIN').then(result => {
            console.log('creditcard:', creditcardinfo);
            client.query(`INSERT INTO users(name,dateCreated) VALUES ($1,$2) returning userId`, [name,dateCreated])
                .then(result => {
                currId = result.rows[0].userid;
                console.log('currId:', currId);
                client.query(
                    `INSERT INTO Customers VALUES ($1, $2)`, [currId, creditcardinfo]).then(result => {
                    client.query('COMMIT');
                    client.release()
                }).then(result=> {
                   return res.json(currId);
                })
            })
        })
    console.log("userid:", currId);
    // return res.json(`${name} added as a Customer`);
    } catch (err) {
        client.query(`ROLLBACK`);
        client.release()
        console.error("error triggered: ", err.message);
    }
});

//Support data access for Customer : view past orders for certain month
router.get('/viewMonthOrders', (req, res) => {
    const userId = req.body.userId;
    const month = req.body.month;
    const year = req.body.year;
    const text = `SELECT * 
                    FROM OrderInfo  
                    WHERE userId = $1 
                    AND ((SELECT EXTRACT(MONTH FROM timeoforder::date))) = $2
                    AND ((SELECT EXTRACT(YEAR FROM timeoforder::date))) = $3;
                    `;

    const values = [userId, month, year];
    pool
        .query(text, values)
        .then(result => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch(e => console.error(e.stack))
})

//Support data access for Customer : view specific order in detail
router.get('/viewOrderDetail', (req, res) => {
    const orderId = req.body.orderId;
    // const month = req.body.month;
    // const year = req.body.year;
    const text = ` SELECT C.orderId, C.rname, C.fname, C.foodqty, 
                     (SELECT S.price FROM SELLS S WHERE S.fname = C.fname AND S.rname = C.rname) as price,
                     calculatePrice(C.rname, C.fname, C.foodqty) as totalfoodprice, 
                     C.reviewcontent
                     FROM Contains C
                     WHERE C.orderId = $1
                    `;

    const values = [orderId];
    pool
        .query(text, values)
        .then(result => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch(e => console.error(e.stack))
})

router.get('/viewPastReviews', (req,res) => {
    const fname = req.body.fname;
    const rname = req.body.rname;
    const text = `
        SELECT C.reviewContent 
        FROM Contains C
        WHERE C.rname = $1
        AND C.fname = $2
        ;
       `
    const values = [rname,fname];
    pool.query(text,values).then(result => {
        res.json(result.rows);
    })
    .catch(e => console.error(e.stack))

})
//gets restaurants that sell for food
router.get('/searchForFood', (req,res) => {
    const fname = req.body.fname;
    const text = `
        SELECT S.rname 
        FROM Sells S
        WHERE S.fname = $1
        ;
       `
    const values = [fname];
    pool.query(text,values).then(result => {
        res.json(result.rows);
    })
        .catch(e => console.error(e.stack))

})

router.get('/browseForFood', (req,res) => {
    const text = `
        SELECT DISTINCT S.fname 
        FROM Sells S
        ;
       `
    const values = [];
    pool.query(text,values).then(result => {
        res.json(result.rows);
    })
        .catch(e => console.error(e.stack))

})

router.get('/RestaurantSellingFood', (req,res) => {
    const fname = req.body.fname;
    const text = `
        SELECT DISTINCT S.rname 
        FROM Sells S
        WHERE S.fname = $1
        ;
       `
    const values = [fname];
    pool.query(text,values).then(result => {
        res.json(result.rows);
    })
        .catch(e => console.error(e.stack))

})
router.post("/createOrder", async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.body.userId;
        const promoCode = req.body.promoCode;
        const applicableTo = req.body.applicableTo;
        const modeOfPayment = req.body.modeOfPayment;
        const timeOfOrder = req.body.timeOfOrder;
        const deliveryLocation = req.body.deliveryLocation;
        const usedRewardPoints = req.body.usedRewardPoints;
        const contains = req.body.contains;
        let orderId = 0;
        client.query("BEGIN").then((result) => {
            client
                .query(
                    `INSERT INTO Orders(userId,promoCode,applicableTo,modeOfPayment,timeOfOrder,deliveryLocation,usedRewardPoints) 
                    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING orderId`,
                    [
                        userId,
                        promoCode,
                        applicableTo,
                        modeOfPayment,
                        timeOfOrder,
                        deliveryLocation,
                        usedRewardPoints,
                    ]
                )
                .then((result) => {
                    orderId = result.rows[0].orderid;
                    console.log("orderid:", result.rows[0].orderid);
                    contains.forEach((currInt) => {
                        var currOrderId = orderId;
                        var currentRname = currInt.rname;
                        var currentFname = currInt.fname;
                        var currentFoodQty = currInt.foodQty;
                        var currentReviewContent = currInt.reviewContent;
                        client
                            .query(
                                `INSERT INTO Contains(orderId, rname, fname, foodQty, reviewContent) VALUES ($1,$2,$3,$4,$5)`,
                                [
                                    currOrderId,
                                    currentRname,
                                    currentFname,
                                    currentFoodQty,
                                    currentReviewContent,
                                ]
                            )
                            .catch(e => console.error(e.stack));
                    });
                    client.query("COMMIT");
                    client.release();
                });
        });
        res.json(`${userId}'s order added`);
    } catch (err) {
        client.query(`ROLLBACK`);
        client.release();
        console.error("error triggered: ", err.message);
    }
});
module.exports = router;