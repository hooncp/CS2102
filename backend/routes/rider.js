var express = require('express');
var router = express.Router();

const pool = require('../database/db');


/* Useful guide:
https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
*/
/* Features:
1. on create rider, choose if monthly or weekly //done
2. create a schedule -> choose start date, plan schedule for one week
3. total number of orders delivered by rider
4. total number of hours worked by the rider for that month
5. total salary earned by the rider for that month
6. average delivery time by the rider for that month
7. number of ratings received by rider for all orders delivered for that month
8. averaged rating received by rider for orders delivered that month
9. Browsing summary info for delivery riders -> weekly/monthly info on
	(a) total num of orders delivered,
	(b) total num of hours worked
	(c) total salary earned
*/


/* SQL Query */
// var sql_query = 'SELECT * FROM student_info';
//
// router.get('/testGet', async (req, res) => {
// 	try {
// 		console.log(req);
// 		return res.json("test");
// 	} catch (err) {
// 		console.error(err.message);
// 	}
// });
//
// router.get('/getRiderInfo', async (req, res) => {
// 	try {
// 		console.log(req);
// 		await pool.query("SELECT * FROM pizzas");
// 		return res.json(test.rows);
// 	} catch (err) {
// 		console.error(err.message);
// 	}
// });

// router.post('/testPut', async (req,res) => {
// 	try {
// 		return res.json(req.body);
// 	} catch( err ){
// 		console.error(err.message);
// 	}
// })
/*test input json:
*
* */
// function insertRider(name, area) {
//     return new Promise((res, rej) => {
//         let currId;
//         try {
//             pool.query(`INSERT INTO users(name)
// 					VALUES ($1)
// 					returning userId`,
//                 [name],
//             ).then(result => {
//                     currId = result.rows[0].userid;
//                     pool.query(
//                             `INSERT INTO riders values($1, $2)`,
//                         [currId, area]
//                     )
//                 }
//             ).then(result => {
//                     res(currId);
//                 }
//             )
//         } catch (err) {
//             console.err(err);
//             pool.query('ROLLBACK');
//         }
//     })
// }

// 2. create a schedule -> choose start date, plan schedule for one week
/*Example: "intervals" :
    [
        {"startTime" :"2020-05-05 10:00:00 ","endTime":"2020-05-05 14:00:00"},
        {"startTime" :"2020-05-05 15:00:00 ","endTime":"2020-05-05 19:00:00"}
    ]
*/
//IMPORTANT: DO NOT USE POOL.QUERY() WITH TRANSACTIONS
//TODO: catch exceptions raised by db and return it back in res
// maybe useful: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
router.post('/createWeeklySchedule', async (req, res) => {
	const client = await pool.connect();
	try {
		const userId = req.body.userId;
		const startDate = req.body.startDate; //user input
		const endDate = req.body.endDate; //calculate and pass down from frontend
		const intervals = req.body.intervals;
		let scheduleId = 0;
		client.query('BEGIN').then(result => {
				client.query(`INSERT INTO Weekly_Work_Schedules(userId,startDate,endDate) VALUES ($1,$2,$3) RETURNING scheduleId`,
					[userId, startDate, endDate])
					.then(result => {
						scheduleId = result.rows[0].scheduleid;
						console.log('scheduleid:', result.rows[0].scheduleid);
						intervals.forEach(currInt => {
							var currScheduleId = scheduleId;
							var currentStartTime = currInt.startTime;
							var currentEndTime = currInt.endTime;
							client.query(`INSERT INTO Intervals(scheduleId, startTime, endTime) VALUES ($1,$2,$3)`,
								[currScheduleId, currentStartTime, currentEndTime]).then(result => {
							})
						})
						client.query('COMMIT');
						client.release()
					})
			}
		)
		res.json(`${userId}'s schedule added`);
	} catch (err) {
		client.query(`ROLLBACK`);
		client.release()
		console.error("error triggered: ", err.message);
	}
})

async function insertMonthlySchedule(client, schedules) {
	var userId = schedules.userId;
	var startDate = schedules.startDate;
	var endDate = schedules.endDate;
	var intervals = schedules.intervals;
	console.log(schedules);
	return new Promise((res, rej) => {
		try {
			client.query('BEGIN').then(result => {
				return client.query(`INSERT INTO Weekly_Work_Schedules(userId,startDate,endDate) VALUES ($1,$2,$3) RETURNING scheduleId`,
					[userId, startDate, endDate])
					.then(async result => {
						scheduleId = result.rows[0].scheduleid;
						console.log('scheduleid:', result.rows[0].scheduleid);
						await intervals.forEach(currInt => {
							var currScheduleId = scheduleId;
							var currentStartTime = currInt.startTime;
							var currentEndTime = currInt.endTime;
							return client.query(`INSERT INTO Intervals(scheduleId, startTime, endTime) VALUES ($1,$2,$3)`,
								[currScheduleId, currentStartTime, currentEndTime])
						})
					})
					.then(result => {
						res(scheduleId);
					})
			})
			return 0;
		} catch
			(err) {
			console.error("error triggered: ", err.message);
			throw (err);
		}
	})
}
router.post('/createMonthlySchedule', async (req, res) => {
	const client = await pool.connect();
	const schedules = req.body.schedules;
	console.log(schedules);
	try {
		let scheduleId1 = 0;
		let scheduleId2 = 0;
		let scheduleId3 = 0;
		let scheduleId4 = 0;

		client.query('BEGIN').then(result => {
				insertMonthlySchedule(client, schedules[0])
					.then(result => {
						scheduleId1 = result;
						return insertMonthlySchedule(client, schedules[1])
							.then(result => {
								scheduleId2 = result;
								return insertMonthlySchedule(client, schedules[2])
									.then(result => {
										scheduleId3 = result;
										return insertMonthlySchedule(client, schedules[3])
											.then(result => {
												scheduleId4 = result;
												return client.query(`INSERT INTO Monthly_Work_Schedules VALUES ($1,$2,$3,$4)`,
													[scheduleId1, scheduleId2, scheduleId3, scheduleId4])
													.then(result => {
														client.query('COMMIT');
														// client.release();
													}).catch(err=> {
													console.error(err);
												})
											})
									})
							})
					})
			}
		)
		return res.json(`schedule added`);
	} catch (err) {
		client.query(`ROLLBACK`);
		client.release()
		console.error("error triggered: ", err.message);
	}
})

/*https://stackoverflow.com/questions/55764970/node-mysql-query-not-updating-variable-from-outside-the-query*/
/*async await guide: https://www.geeksforgeeks.org/using-async-await-in-node-js/ */
// create Part Time Rider
router.post('/insertPartTimeRider', async (req, res) => {
	// console.log("succeed");
	const client = await pool.connect();
	try {
		let currId = 0;
		const name = req.body.name;
		const area = req.body.area;
		client.query('BEGIN').then(res => {
			client.query(`INSERT INTO users(name) VALUES ($1) returning userId`, [name]).then(result => {
				currId = result.rows[0].userid;
				console.log('currId:', currId);
				client.query(
					`INSERT INTO riders VALUES ($1, $2)`, [currId, area]).then(result => {
					client.query(
						`INSERT INTO Part_Time VALUES  ($1)`, [currId]).then(result => {
						client.query('COMMIT');
						client.release()
					})
				})
			})
		})
		return res.json(`${name} added as a Rider`);
	} catch (err) {
		client.query(`ROLLBACK`);
		client.release()
		console.error("error triggered: ", err.message);
	}
});
router.post('/insertFullTimeRider', async (req, res) => {
	// console.log("succeed");
	const client = await pool.connect();
	try {
		let currId = 0;
		const name = req.body.name;
		const area = req.body.area;
		client.query('BEGIN').then(res => {
			client.query(`INSERT INTO users(name) VALUES ($1) returning userId`, [name]).then(result => {
				currId = result.rows[0].userid;
				console.log('currId:', currId);
				client.query(
					`INSERT INTO riders VALUES ($1, $2)`, [currId, area]).then(result => {
					client.query(
						`INSERT INTO Full_Time VALUES  ($1)`, [currId]).then(result => {
						client.query('COMMIT');
						client.release()
					})
				})
			})
		})
		return res.json(`${name} added as a Rider`);
	} catch (err) {
		client.query(`ROLLBACK`);
		client.release()
		console.error("error triggered: ", err.message);
	}
});


/*https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628*/

// router.post('/deleteData', async (req, res) => {
// 	// console.log("succeed");
// 	try {
// 		const {pname} = req.body;
// 		await pool.query(
// 			`DELETE FROM pizzas
// 					WHERE pizza = ($1)`,
// 			[pname],
// 			(error, results) => {
// 				if (error) {
// 					throw error
// 				}
// 			}
// 		);
// 		return res.json(`${pname} deleted.`);
//
// 	} catch (err) {
// 		console.error(err.message);
// 	}
// });
//
// router.post('/updateData', async (req, res) => {
// 	// console.log("succeed");
// 	try {
// 		const {oldPname, newPname} = req.body;
// 		await pool.query(
// 			`UPDATE pizzas
// 			SET pizza = $2
// 			WHERE pizza = $1`,
// 			[oldPname, newPname],
// 			(error, results) => {
// 				if (error) {
// 					throw error
// 				}
// 			}
// 		);
// 		return res.json(`${oldPname} updated to ${newPname}`);
// 	} catch (err) {
// 		console.error(err.message);
// 	}
// });

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
