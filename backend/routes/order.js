var express = require("express");
var router = express.Router();

const pool = require("../database/db");

router.post("/insertCustomers", async (req, res) => {
  // console.log("succeed");
  const client = await pool.connect();
  try {
    let currId = 0;
    const name = req.body.name;
    const creditcardinfo = req.body.creditcardinfo;
    client.query("BEGIN").then((res) => {
      client
        .query(`INSERT INTO users(name) VALUES ($1) returning userId`, [name])
        .then((result) => {
          currId = result.rows[0].userid;
          console.log("currId:", currId);
          client
            .query(`INSERT INTO customers VALUES ($1, $2)`, [
              currId,
              creditcardinfo,
            ])
            .then((result) => {
              client.query("COMMIT");
              client.release();
            });
        });
    });
    return res.json(`${name} added as a Customer`);
  } catch (err) {
    client.query(`ROLLBACK`);
    client.release();
    console.error("error triggered: ", err.message);
  }
});

module.exports = router;
