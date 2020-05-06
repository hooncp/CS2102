var express = require('express');
var router = express.Router();

const pool = require('../database/db');
var url = require('url');

router.get('/getUserType', async (req, res) => {
    var parts = url.parse(req.url, true);
    console.log(parts);
    var userId = parts.query.userId;
    console.log(userId);
    const queryCustomer = `SELECT userId FROM Customers C WHERE $1 = C.userId`
    const queryRider = `SELECT userId FROM Riders R WHERE $1 = R.userId`
    const queryRS = `SELECT userId FROM Restaurant_Staff RS WHERE $1 = RS.userId`
    const queryFM = `SELECT userId FROM FDS_Managers FM WHERE $1 = FM.userId`
    const values = [userId];

    pool.query(queryCustomer, values).then(result => {
        result.rows.length != 0
            ? res.json("customer")
            : pool.query(queryRider, values).then(result => {
                result.rows.length != 0
                    ? res.json("rider")
                    : pool.query(queryRS, values).then(result => {
                        result.rows.length != 0
                            ? res.json("RS")
                            : pool.query(queryFM, values).then(result => {
                                result.rows.length != 0
                                    ? res.json("FM")
                                    : res.json("invalid")
                            }).catch(e => console.error(e.stack))
                    }).catch(e => console.error(e.stack))
            }).catch(e => console.error(e.stack))
    })
})

router.get('/getPromoCode', async (req, res) => {
    var parts = url.parse(req.url, true);
    var rname = parts.query.rname;
    const query = `SELECT DISTINCT promoCode, promoDesc FROM Promotions P WHERE P.applicableTo = $1`
    const values = [rname];
    pool.query(query,values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
});

router.get('/getAllRname', async (req, res) => {
    const query = `SELECT DISTINCT rname FROM Restaurants`
    const values = [];
    pool.query(query,values)
        .then(result => res.json(result.rows))
        .catch(e => console.error(e.stack))
});
module.exports = router;


