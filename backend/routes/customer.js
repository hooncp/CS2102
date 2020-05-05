var express = require('express');
var router = express.Router();
const pool = require('../database/db');
var url = require('url');

router.post('/insertCustomer', async (req, res) => {
    //console.log("succeed");
    const client = await pool.connect();
    try {
        let currId = 0;
        const name = req.body.name;
        const creditcardinfo = req.body.creditcardinfo;
        //https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
        let dateCreated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log(dateCreated);
        client.query('BEGIN').then(result => {
            console.log('creditcard:', creditcardinfo);
            client.query(`INSERT INTO users(name,dateCreated) VALUES ($1,$2) returning userId`, [name, dateCreated])
                .then(result => {
                    currId = result.rows[0].userid;
                    console.log('currId:', currId);
                    client.query(
                            `INSERT INTO Customers VALUES ($1, $2)`, [currId, creditcardinfo]).then(result => {
                        client.query('COMMIT');
                        client.release()
                    }).then(result => {
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
router.get('/viewPastOrders', (req, res) => {
    var parts = url.parse(req.url, true);
    var userId = parts.query.userId;
    const text = `SELECT * 
                    FROM OrderInfo  
                    WHERE userId = $1
                    ORDER BY orderId DESC                
                    `;

    const values = [userId];
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

router.get('/viewAllContainsDetail', (req, res) => {
    const text = ` SELECT * FROM CONTAINS`;
    const values = [];
    pool
        .query(text, values)
        .then(result => {
            console.log(result.rows);
            res.json(result.rows);
        })
        .catch(e => console.error(e.stack))
})

router.get('/viewPastReviews', (req, res) => {
    const fname = req.body.fname;
    const rname = req.body.rname;
    const text = `
        SELECT C.reviewContent 
        FROM Contains C
        WHERE C.rname = $1
        AND C.fname = $2
        ;
       `
    const values = [rname, fname];
    pool.query(text, values).then(result => {
        res.json(result.rows);
    })
        .catch(e => console.error(e.stack))

})
//gets restaurants that sell for food
router.get('/searchForFood', (req, res) => {
    const fname = req.body.fname;
    const text = `
        SELECT S.rname 
        FROM Sells S
        WHERE S.fname = $1
        ;
       `
    const values = [fname];
    pool.query(text, values).then(result => {
        res.json(result.rows);
    })
        .catch(e => console.error(e.stack))

})

router.get('/browseForFood', (req, res) => {
    const text = `
        SELECT DISTINCT S.fname 
        FROM Sells S
        ;
       `
    const values = [];
    pool.query(text, values).then(result => {
        res.json(result.rows);
    })
        .catch(e => console.error(e.stack))

})

router.get('/RestaurantSellingFood', (req, res) => {
    const fname = req.body.fname;
    const text = `
        SELECT DISTINCT S.rname 
        FROM Sells S
        WHERE S.fname = $1
        ;
       `
    const values = [fname];
    pool.query(text, values).then(result => {
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
        const timeOfOrder = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const deliveryLocation = req.body.deliveryLocation;
        const usedRewardPoints = req.body.usedRewardPoints;
        const contains = req.body.contains;
        let orderId = 0;
        client.query("BEGIN").then(result => {
            return client.query(
                    `INSERT INTO Orders(userId,promoCode,applicableTo,modeOfPayment,timeOfOrder,deliveryLocation,usedRewardPoints) 
                    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING orderId `,
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
                .then(result => {
                    orderId = result.rows[0].orderid;
                    console.log("orderid:", result.rows);
                    contains.forEach((currInt) => {
                        var currentRname = currInt.rname;
                        var currentFname = currInt.fname;
                        console.log(currInt.fname);
                        console.log(currInt.rname);
                        var currentFoodQty = currInt.foodQty;
                        const reviewContent = null;
                        return client.query(
                                `INSERT INTO Contains(orderId, rname, fname, foodQty,reviewContent) VALUES ($1,$2,$3,$4,$5)`,
                            [
                                orderId,
                                currentRname,
                                currentFname,
                                currentFoodQty,
                                reviewContent,
                            ]
                        ).then(result => {
                        })
                            // .catch(e => console.error(e.stack));
                    });
                    client.query("COMMIT");
                    client.release();
                }).then(result => {
                    console.log('orderid', orderId);
                    res.json(orderId);
                }).catch(e => console.error(e.stack));
            ;
        })
            .catch(e => console.error(e.stack));
    } catch (err) {
        client.query(`ROLLBACK`);
        client.release();
        console.error("error triggered in create order: ", err.message);
    }
});

router.get('/getPrevDeliveryLoc', async (req, res) => {
    var parts = url.parse(req.url, true);
    var userId = parts.query.userId;
    const query = `select deliverylocation 
                    from PastFiveDeliveryLoc
                    where userid = $1 
                    order by orderId DESC
                    limit 5;`
    values = [userId];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
    ;
});

router.get('/getSameAreaFood', async (req, res) => {

    var parts = url.parse(req.url, true);
    var area = parts.query.area;
    const query = `SELECT distinct S.fname, F.category
                    FROM Sells S join Restaurants R using (rname) join Food F using (fname)
                    WHERE R.area = $1`;
    values = [area];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
});

router.get('/getSameAreaRestaurantAndFood', async (req, res) => {
    var parts = url.parse(req.url, true);
    var area = parts.query.area;
    const query = `SELECT distinct S.rname, S.fname, F.category, S.price
                    FROM Sells S join Restaurants R using (rname) join Food F using (fname)
                    WHERE R.area = $1`;
    values = [area];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))

});

router.get('/getSameAreaRestaurant', async (req, res) => {
    var parts = url.parse(req.url, true);
    var area = parts.query.area;
    const query = `SELECT distinct S.rname
                    FROM Sells S join Restaurants R using (rname) 
                    WHERE R.area = $1`;
    values = [area];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))

});
router.get('/getCreditCardInfo', async (req, res) => {
    var parts = url.parse(req.url, true);
    var userId = parts.query.userId;
    const query = `SELECT distinct creditCardInfo
                    FROM Customers C 
                    WHERE C.userId = $1`;
    values = [userId];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))

});

router.put('/updateCreditCardInfo', async (req, res) => {
    const userId = req.body.userId;
    const ccinfo = req.body.ccinfo;
    const query = `UPDATE Customers SET creditcardinfo = $2 WHERE userId = $1`;
    values = [userId, ccinfo];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
});

router.get('/customerRewardPoints', async (req, res) => {
    var parts = url.parse(req.url, true);
    var userId = parts.query.userId;
    const query = `SELECT DISTINCT SUM(OI.earnedRewardpts) - SUM(OI.usedRewardPoints) as availableRewardPts
                    FROM orderinfo OI 
                    WHERE OI.userId = $1`;
    values = [userId];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))

});


router.post('/submitReview', async (req, res) => {
    const client = await pool.connect();
    const reviews = req.body.reviews;
    reviews.forEach(result => {
        const orderId = result.orderId;
        const fname = result.fname;
        const rname = result.rname;
        const reviewContent = result.reviewContent;
        const query = `UPDATE Contains SET reviewContent = $4 WHERE orderId = $1 AND rname=$2 AND fname=$3`
        const values = [orderId, rname, fname, reviewContent];
        console.log(orderId);
        client.query(query, values)
            .catch(e => console.error(e.stack))
    })
    client.release();
    await res.json("successfully submitted review");

});

router.get('/getOrderInfo', async (req, res) => {
    var parts = url.parse(req.url, true);
    var orderId = parts.query.orderId;
    const query = `SELECT DISTINCT *
                    FROM orderinfo OI 
                    WHERE OI.orderId = $1`;
    values = [orderId];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))

});

router.get('/getDeliveryRider', async(req,res) => {
    var parts = url.parse(req.url, true);
    var orderId = parts.query.orderId;
    const query = `SELECT * 
                    FROM delivers 
                    WHERE orderId = $1`;
    values = [orderId];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
});

router.post('/submitRiderRatings', async (req, res) => {
    const orderId = req.body.orderId;
    const rating = req.body.rating;
    const query = `UPDATE Delivers SET rating = $2 WHERE orderId = $1`;
    values = [orderId, rating];
    pool.query(query, values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
});

// router.get('/getSameAreaRestaurantWithFood', async (req, res) => {
//     var parts = url.parse(req.url, true);
//     var area = parts.query.area;
//     var fname = parts.query.fname;
//     console.log(fname);
//     const query = `SELECT distinct rname
//                     FROM Sells S join Restaurants R using (rname)
//                     WHERE R.area = $1
//                     AND S.fname = $2
//                     `;
//     values = [area,fname];
//     pool.query(query,values)
//         .then(result => res.json(result.rows))
//         .catch(e => console.error(e.stack))
//
// });


module.exports = router;