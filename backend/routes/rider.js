var express = require('express');
var router = express.Router();

const pool = require('../database/db');
var url = require('url');



/* Useful guide:
https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/
*/
/* Features:
1. on create rider, choose if monthly or weekly
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


//8. averaged rating received by rider for orders delivered that month
router.get('/getMonthlyAvgRating', async (req, res) => {
	const month = req.body.month;
	const userId = req.body.userId;
	const query = `SELECT round(sum(rating)::numeric/count(rating),2) as avgRating
	FROM Delivers D
	WHERE DATE_PART('MONTHS',D.deliveryTimetoCustomer) = ${month}
	GROUP BY userId
	HAVING userId = ${userId}
	;`
	pool.query(query).then(result => {
		let avgRating = (result.rows[0]);
		console.log('num of ratings:', avgRating);
		res.json(avgRating);
	}).catch(err => {
		if (err.constraint) {
			console.error(err.constraint);
		} else {
			console.log(err);
			res.json(err);
		}
	});

})

//7. number of ratings received by rider for all orders delivered for that month
router.get('/getMonthlyNumRating', async (req, res) => {
	const month = req.body.month;
	const userId = req.body.userId;
	const query = `SELECT count(rating) as numRating
	FROM Delivers D
	WHERE DATE_PART('MONTHS',D.deliveryTimetoCustomer) = ${month}
	GROUP BY userId
	HAVING userId = ${userId}
	;`
	pool.query(query).then(result => {
		let numRating = result.rows[0]
		console.log('num of ratings:', numRating);
		res.json(numRating);
	}).catch(err => {
		if (err.constraint) {
			console.error(err.constraint);
		} else {
			console.log(err);
			res.json(err);
		}
	});

})

// 6. average delivery time by the rider for that month
//departTimeForRestaurant - deliveryTimetoCustomer = delivery time
// average delivery time = total delivery time / total num of orders [monthly]
router.get('/getMonthlyAverageDeliveryTime', async (req, res) => {
	const month = req.body.month;
	const userId = req.body.userId;
	const query = `select sum((extract(epoch from (deliveryTimetoCustomer - departTimeForRestaurant)))/60)
		/count(userId) as avgTime
		FROM Delivers D
		WHERE DATE_PART('months',D.deliveryTimetoCustomer) = ${month}
		GROUP BY userId
		HAVING userId = ${userId};`
	pool.query(query).then(result => {
		if (typeof result.rows[0] == 'undefined') {
			throw `rider ${userId} does not have any deliveries`;
		} else {
			let avgTime = result.rows[0]
			console.log('result:', avgTime);
			res.json(avgTime);
		}
	}).catch(err => {
		if (err.constraint) {
			console.error(err.constraint);
		} else {
			console.log(err);
			res.json(err);
		}
	});

})
// 2. create a schedule -> choose start date, plan schedule for one week
//IMPORTANT: DO NOT USE POOL.QUERY() WITH TRANSACTIONS
//TODO: catch exceptions raised by db and return it back in res
// maybe useful: https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
router.post('/createWeeklySchedule', async (req, res) => {
	const client = await pool.connect();
	try {
		console.log(req.body);
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
		console.log("error triggered: ", err.message);
	}
})

async function insertWeeklySchedule(client, schedules) {
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
						console.log("finish adding");
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
			insertWeeklySchedule(client, schedules[0])
				.then(result => {
					scheduleId1 = result;
					return insertWeeklySchedule(client, schedules[1])
						.then(result => {
							scheduleId2 = result;
							return insertWeeklySchedule(client, schedules[2])
								.then(result => {
									scheduleId3 = result;
									return insertWeeklySchedule(client, schedules[3])
										.then(result => {
											scheduleId4 = result;
											return client.query(`INSERT INTO Monthly_Work_Schedules VALUES ($1,$2,$3,$4)`,
												[scheduleId1, scheduleId2, scheduleId3, scheduleId4])
												.then(result => {
													client.query('COMMIT');
													// client.release();
												}).catch(err => {
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
		let dateCreated = new Date().toLocaleString('en-US');
		client.query('BEGIN').then(res => {
			client.query(`INSERT INTO users(name,datecreated) VALUES ($1,$2) returning userId`, [name, dateCreated]).then(result => {
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
		}).catch(err => {
			console.error(err);
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
		let dateCreated = new Date().toLocaleString('en-US');
		client.query('BEGIN').then(res => {
			client.query(`INSERT INTO users(name,dateCreated) VALUES ($1,$2) returning userId`, [name, dateCreated]).then(result => {
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
		}).catch(err => {
			console.error(err);
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
// 3. total number of orders delivered by rider for the month
router.get('/viewMonthPastOrder', (req, res) => {
	const userId = req.body.userId;
	const month = req.body.month;
	const year = req.body.year;
	const text = `SELECT * FROM Delivers D      
                    WHERE userId = $1
                    AND (SELECT EXTRACT(MONTH FROM D.deliveryTimetoCustomer::date)) = $2
                    AND (SELECT EXTRACT(YEAR FROM D.deliveryTimetoCustomer::date)) = $3`

	const values = [userId, month, year];
	pool
		.query(text, values)
		.then(result => {
			console.log(result.rows);
			res.json(result.rows);
		})
		.catch(e => console.error(e.stack))
})

// 4. total number of hours worked by rider for that month
router.get('/viewMonthHoursWorked', (req, res) => {
	const userId = req.body.userId;
	const month = req.body.month;
	const year = req.body.year;
	const text = `with result as ( 
    select startTime, endTime, date_part('hours', endTime) - date_part('hours', startTime) as duration 
    from Weekly_Work_Schedules S join intervals I 
        on (S.scheduleId = I.scheduleId) 
        and (S.userid = $1) and (SELECT EXTRACT(MONTH FROM S.startDate::date)) = $2 
        and (SELECT EXTRACT(YEAR FROM S.startDate::date)) = $3)   
    select * from result`;
	//select sum(duration) form result;

	const values = [userId, month, year];
	pool
		.query(text, values)
		.then(result => {
			console.log(result.rows);
			res.json(result.rows);
		})
		.catch(e => console.error(e.stack))
})

// 5. total salary earned by the rider for that month
router.get('/viewMonthSalary', (req, res) => {
	const userId = req.body.userId;
	const month = req.body.month;
	const year = req.body.year;
	const text = `
    with result as (                                                                                                                      
        select startTime, endTime, date_part('hours', endTime) - date_part('hours', startTime) as duration                                
        from Weekly_Work_Schedules S join intervals I                                                                                                     
        on (S.scheduleId = I.scheduleId)                                                                                                  
        and (S.userid = $1) and (SELECT EXTRACT(MONTH FROM S.startDate::date)) = $2                                                       
        and (SELECT EXTRACT(YEAR FROM S.startDate::date)) = $3), 
    result2 as (
        SELECT D.deliveryTimetoCustomer, case 
                                        when ((deliveryTimetoCustomer::time >= '12:00' and deliveryTimetoCustomer::time <= '13:00')
                                                OR (deliveryTimetoCustomer::time >= '18:00' and deliveryTimetoCustomer::time <= '20:00'))
                                        then 4
                                        else 2
                                        end as delivery_fee
        FROM Delivers D      
        WHERE userId = $1
        AND (SELECT EXTRACT(MONTH FROM D.deliveryTimetoCustomer::date)) = $2
        AND (SELECT EXTRACT(YEAR FROM D.deliveryTimetoCustomer::date)) = $3),
    result3 as (
        select coalesce((select sum(duration) from result R),0) as totalHoursWorked , coalesce(sum(delivery_fee),0) as totalFees
        from result2 R2)
    select R3.totalHoursWorked, R3.totalFees, case
        when $1 not in (select PT.userId from Part_Time PT) then (R3.totalHoursWorked * 5 + totalFees)
        else (R3.totalHoursWorked * 2 + totalFees) --part_time
        end as pay
    from result3 R3
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


// view summary of Rider information
router.get('/viewMonthSummary', (req, res) => {
	var parts = url.parse(req.url, true);
	const userId = req.query.userId;
	const month = req.query.month;
	const year = req.query.year;
	const text = `with r1 as (
    select * from Rider_Delivery_Summary_Info D where D.work_month = $2 and D.work_year = $3
    ), 
    r2 as (
    select * from Rider_Schedule_Summary_Info S where S.work_month = $2 and S.work_year = $3
    )
    select userId, 
    coalesce(r1.work_month, $2) as work_month,
    coalesce(r1.work_year, $3) as work_year,
    coalesce(NumDelivery, 0) as NumDelivery,
    coalesce(AvgTimeDelivery, 0) as AvgTimeDelivery,
    coalesce(numRating, 0) as numRating,
    coalesce(avgRating, NULL) as avgRating,
    coalesce(numHoursWorked, 0) as numHoursWorked,
    coalesce(Total_delivery_fee, 0) as Total_delivery_fee,
    coalesce(salary, 0) + coalesce(Total_delivery_fee, 0) as TotalSalary
    from (Riders left join r1 using (userId)) left join r2 using (userId)
    where userId = $1
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

router.get('/getPastMonthSchedule', (req, res) => {
	var parts = url.parse(req.url, true);
	const userId = req.query.userId;
	const month = req.query.month;
	const year = req.query.year;
	const text = `select starttime, endtime, intervalduration 
	from Rider_Schedule_Info S 
	where S.userId = $1 and S.work_month = $2 and S.work_year = $3`;
	const values = [userId, month, year];
	pool
		.query(text, values)
		.then(result => {
			console.log(result.rows);
			res.json(result.rows);
		})
		.catch(e => console.error(e.stack))
})

router.get('/getPastOrder', (req, res) => {
	var parts = url.parse(req.url, true);
	const userId = req.query.userId;
	const month = req.query.month;
	const year = req.query.year;
	const text = `select orderid, departtimeforrestaurant, deliverytimetocustomer, rating, delivery_fee 
	from Rider_Delivery_Info R 
	where R.userId = $1 and R.work_month = $2 and R.work_year = $3`;
	const values = [userId, month, year];
	pool
		.query(text, values)
		.then(result => {
			console.log(result.rows);
			res.json(result.rows);
		})
		.catch(e => console.error(e.stack))
})

module.exports = router;
