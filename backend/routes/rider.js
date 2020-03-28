var express = require('express');
var router = express.Router();

const pool = require('../database/db');

/* Useful guide:
https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
*/

/* SQL Query */
var sql_query = 'SELECT * FROM student_info';

router.get('/testGet', async (req, res) => {
	try {
		console.log(req);
		return res.json("test");
	} catch (err) {
		console.error(err.message);
	}
});

router.get('/getData', async (req, res) => {
	try {
		console.log(req);
		const test = await pool.query("SELECT * FROM pizzas");
		return res.json(test.rows);
	} catch (err) {
		console.error(err.message);
	}
});

router.post('/testPut', async (req,res) => {
	try {
		return res.json(req.body);
	} catch( err ){
		console.error(err.message);
	}
})

router.post('/insertData', async (req, res) => {
	// console.log("succeed");
	try {
		const {pname} = req.body;
		console.log(pname);
		await pool.query(
			`INSERT INTO pizzas (pizza)
					VALUES ($1)`,
			[pname],
			(error,result) => {
				if (error) {
					throw error
				}
			}
		);
	return res.json(`${pname} added to Pizza`);
	} catch (err) {
		console.error(err.message);
	}
});

router.post('/deleteData', async (req, res) => {
	// console.log("succeed");
	try {
		const {pname} = req.body;
		await pool.query(
			`DELETE FROM pizzas 
					WHERE pizza = ($1)`,
			[pname],
			(error, results) => {
				if (error) {
					throw error
				}
			}
		);
		return res.json(`${pname} deleted.`);

	} catch (err) {
		console.error(err.message);
	}
});

router.post('/updateData', async (req, res) => {
	// console.log("succeed");
	try {
		const {oldPname, newPname} = req.body;
		await pool.query(
			`UPDATE pizzas 
			SET pizza = $2 
			WHERE pizza = $1`,
			[oldPname, newPname],
			(error, results) => {
				if (error) {
					throw error
				}
			}
		);
		return res.json(`${oldPname} updated to ${newPname}`);
	} catch (err) {
		console.error(err.message);
	}
});

/*
router.get('/test', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
    //console.log(data);
    if (err) throw err;
		res.send(data.rows);
	});
});
*/
module.exports = router;
