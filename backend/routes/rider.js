var express = require('express');
var router = express.Router();

const pool = require('../database/db');

/* SQL Query */
var sql_query = 'SELECT * FROM student_info';

router.get('/getData', async (req, res) => {
	try {
		console.log(req);
		const test = await pool.query("SELECT * FROM student_info");
		res.json(test.rows);
	} catch (err) {
		console.error(err.message);
	}
});

router.put('/insertData', async (req, res) => {
	console.log("succeed");
	try {
		const {description} = req.body;
		//console.log(req.body);
		const test = await pool.query(`INSERT INTO student_info(matric) 
					VALUES ($1) returning *`
							, description);
		res.json(test.rows[0]);
	} catch (err) {
		console.error(err.message);
	}
});


module.exports = router;
