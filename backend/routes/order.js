var express = require("express");
var router = express.Router();

const pool = require("../database/db");

// Create a Customer
router.post("/insertCustomers", async (req, res) => {
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

// Create a Restaurant
router.post("/insertRestaurant", async (req, res) => {
  const client = await pool.connect();
  try {
    const rname = req.body.rname;
    const minorderamt = req.body.minorderamt;
    const area = req.body.area;
    client.query("BEGIN").then((res) => {
      client
        .query(
          `INSERT INTO restaurants (rname, minorderamt, area) VALUES ($1, $2, $3)`,
          [rname, minorderamt, area]
        )
        .then((result) => {
          client.query("COMMIT");
          client.release();
        });
    });
    return res.json(`${rname} added as a Restaurant`);
  } catch (err) {
    client.query(`ROLLBACK`);
    client.release();
    console.error("error triggered: ", err.message);
  }
});

// Create a Food
router.post("/insertFood", async (req, res) => {
  const client = await pool.connect();
  try {
    const fname = req.body.fname;
    const category = req.body.category;
    client.query("BEGIN").then((res) => {
      client
        .query(`INSERT INTO restaurants (fname, category) VALUES ($1, $2)`, [
          fname,
          category,
        ])
        .then((result) => {
          client.query("COMMIT");
          client.release();
        });
    });
    return res.json(`${fname} added as a Food`);
  } catch (err) {
    client.query(`ROLLBACK`);
    client.release();
    console.error("error triggered: ", err.message);
  }
});

// Create a Customer
router.post("/insertFoods", async (req, res) => {
  const client = await pool.connect();
  try {
    const fname = req.body.fname;
    const category = req.body.category;
    client.query("BEGIN").then((res) => {
      client
        .query(`INSERT INTO food(fname, category) VALUES ($1, $2)`, [
          fname,
          category,
        ])
        .then((result) => {
          client.query("COMMIT");
          client.release();
        });
    });

    return res.json(`${fname} added as a Food`);
  } catch (err) {
    client.query(`ROLLBACK`);
    client.release();
    console.error("error triggered: ", err.message);
  }
});

module.exports = router;
