var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: 'password',
  port: 5432,
})

//console.log("CONNECTION TO PSQL SUCCESSS");
/* SQL Query */
var sql_query = 'SELECT * FROM student_info';

router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
    //console.log(data);
    if (err) throw err;
		res.send(data.rows);
	});
});

module.exports = router;
