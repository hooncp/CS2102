/* START TEST SCHEDULES */
-- insert values
insert into users values (1);
insert into riders values (1, 'West', 2000.20, 5, 'monthly');
--[fail] test endDate - startDate <> 7 days
insert into schedules values (5,1,'13 dec 2020', '19 dec 2020');
insert into schedules values (5,1,'13 dec 2020', '21 dec 2020');

--[pass] test newly added startdate must be > latest end date
insert into schedules values (1,1,'05 dec 2020', '12 dec 2020');
insert into schedules values (2,1,'13 dec 2020', '20 dec 2020');
--[fail] overlapping weeks user 1
insert into schedules values (3,1,'03 dec 2020', '10 dec 2020');
insert into schedules values (4,1,'13 dec 2020', '20 dec 2020');

--[pass]introduce user 2, should be able to have same start & end dates, diff scheduleId
insert into users values (2);
insert into riders values (2, 'West', 2000.20, 5, 'monthly');
insert into schedules values (6,2,'05 dec 2020', '12 dec 2020');
insert into schedules values (7,2,'13 dec 2020', '20 dec 2020');

--[fail]for user 2, overlapping weeks
insert into schedules values (8,2,'03 dec 2020', '10 dec 2020');
insert into schedules values (9,2,'13 dec 2020', '20 dec 2020');

/* END TEST SCHEDULES */

/* START TESTING INTERVALS */
-- [fail] test start before 10 / end after 22:00
insert into Intervals values (1,1,'2020-12-05 07:00','2020-12-05 08:00');
insert into Intervals values (1,1,'2020-12-05 20:00','2020-12-05 23:00');

--[fail] test end time > start time
insert into Intervals values (1,1,'2020-12-05 13:00:00','2020-12-05 11:00');

--[fail] test start/end on hour
insert into Intervals values (1,1,'2020-12-05 07:00:01','2020-12-05 12:00');
insert into Intervals values (1,1,'2020-12-05 07:01','2020-12-05 12:00');

--[fail]test same date
insert into Intervals values (1,1,'2020-12-05 07:00:00','2020-12-06 11:00');

--pass
insert into Intervals values (1,1,'2020-11-05 07:00:00','2020-12-05 11:00');

--[fail] test > 4 hrs
insert into Intervals values (1,1,'2020-12-05 07:00:00','2020-12-06 12:00');
--[pass] test <= 4 hrs
insert into Intervals values (1,1,'2020-12-05 07:00:00','2020-12-05 11:00');
delete from intervals where intervalid = 1;

insert into Intervals values (1,1,'2020-12-05 10:00','2020-12-05 13:00');

--[fail] test fails -> to see it fail, dont create trigger for check_intervals_duration_deferred yet
insert into Intervals values (2,1,'2020-12-05 10:00','2020-12-05 12:00');
insert into Intervals values (2,1,'2020-12-05 11:00','2020-12-05 2:00');
insert into Intervals values (2,1,'2020-12-05 10:00','2020-12-05 11:00');
insert into Intervals values (2,1,'2020-12-05 9:00','2020-12-05 13:00');
insert into Intervals values (2,1,'2020-12-05 13:00','2020-12-05 14:00');
-- end test fail

insert into Intervals values (2,1,'2020-12-05 13:00','2020-12-05 16:00');
insert into Intervals values (3,1,'2020-12-05 17:00','2020-12-05 19:00');
insert into Intervals values (4,1,'2020-12-05 20:00','2020-12-05 23:00');

--[pass] test >= 10 hours
begin;
insert into Intervals values (1,1,'2020-12-05 10:00','2020-12-05 14:00');
insert into Intervals values (2,1,'2020-12-05 15:00','2020-12-05 19:00');
insert into Intervals values (3,1,'2020-12-05 20:00','2020-12-05 22:00');
commit;

delete from intervals where scheduleid = 1;
--[pass] test <= 48 hours
begin;
insert into Intervals values (1,1,'2020-12-05 10:00','2020-12-05 14:00');
insert into Intervals values (2,1,'2020-12-05 15:00','2020-12-05 19:00');
insert into Intervals values (3,1,'2020-12-05 20:00','2020-12-05 22:00');
commit;
--10hrs
insert into Intervals values (4,1,'2020-12-06 10:00','2020-12-06 14:00');
insert into Intervals values (5,1,'2020-12-06 15:00','2020-12-06 19:00');
insert into Intervals values (6,1,'2020-12-06 20:00','2020-12-06 22:00');
--20hrs
insert into Intervals values (7,1,'2020-12-07 10:00','2020-12-07 14:00');
insert into Intervals values (8,1,'2020-12-07 15:00','2020-12-07 19:00');
insert into Intervals values (9,1,'2020-12-07 20:00','2020-12-07 22:00');
--30hrs
insert into Intervals values (10,1,'2020-12-08 10:00','2020-12-08 14:00');
insert into Intervals values (11,1,'2020-12-08 15:00','2020-12-08 19:00');
insert into Intervals values (12,1,'2020-12-08 20:00','2020-12-08 22:00');
--40hrs
insert into Intervals values (13,1,'2020-12-09 10:00','2020-12-09 14:00');
insert into Intervals values (14,1,'2020-12-09 15:00','2020-12-09 19:00');
--48hrs
commit;
--[fail] at 49th hour
insert into Intervals values (15,1,'2020-12-09 20:00','2020-12-09 21:00');
--49hrs
/* END TESTING INTERVALS */

SELECT IntervalId, scheduleId, startTime, endTime,
date_part('hours', endTime) - date_part('hours',startTime) as duration
FROM Intervals  
;
select endDate - startDate is distinct from 7 as diff
from schedules;

select endTime - startTime 
from intervals;


CREATE OR REPLACE FUNCTION check_intervals_overlap_deferred () RETURNS TRIGGER AS $$
	DECLARE 
		badInputSchedule 	INTEGER;
BEGIN
    SELECT DISTINCT I1.scheduleId INTO badInputSchedule
    FROM Intervals I1
    WHERE EXISTS (
    SELECT 1
    FROM Intervals I2
    WHERE I2.scheduleId = I1.scheduleId
    AND I2.intervalId <> I1.intervalId    
    AND(   
        (I2.startTime::time <= I1.startTime::time
        AND I2.endTime::time >= I1.startTime::time)
        --IE: first input shift 2-5pm , current input shift 3 - 4pm / 3 - 6pm etc
        OR 
        (I2.startTime::time <= I1.endTime::time
        AND I2.endTime::time >= I1.endTime::time) 
        --IE: first input shift 2-5pm, current input shift 12pm - 3pm / 12pm - 6pm
        OR ( 
            DATE_PART('hours', I1.startTime) - DATE_PART('hours',I2.endTime) < 1
            AND DATE_PART('hours', I1.startTime) >= DATE_PART('hours',I2.endTime) 
        -- if current inputted shift start time is less than 1hr from other shifts end time, violated (of the same day).
        -- this constraint should also be covered without this last statement when the intervals start and end on the hour
        -- constraint is enforced 
        )
    )
    )
    ;
    IF badInputSchedule IS NOT NULL THEN
    RAISE EXCEPTION '% violates some timing in Intervals', badInputSchedule;
    END IF;
    RETURN NULL; 
	END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS interval_trigger ON Intervals CASCADE;
CREATE CONSTRAINT TRIGGER interval_trigger
	AFTER INSERT ON Intervals
	DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_intervals_overlap_deferred();


CREATE OR REPLACE FUNCTION check_intervals_duration_deferred () RETURNS TRIGGER AS $$
	DECLARE 
		badInputSchedule 	INTEGER;
BEGIN
    WITH IntervalDuration AS (
    SELECT IntervalId, scheduleId, startTime, endTime,
    date_part('hours', endTime) - date_part('hours',startTime) as duration
    FROM Intervals  
    )
    SELECT DISTINCT scheduleId INTO badInputSchedule
    FROM IntervalDuration
    GROUP BY scheduleId
    HAVING sum(duration) < 10 or sum(duration) > 48
    ;
    IF badInputSchedule IS NOT NULL THEN
    RAISE EXCEPTION '% : Total duration of weekly schedule cannot be < 10 or > 48', badInputSchedule;
    END IF;
    RETURN NULL; 
	END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS interval_trigger ON Intervals CASCADE;
CREATE CONSTRAINT TRIGGER interval_trigger
	AFTER INSERT ON Intervals
	DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_intervals_duration_deferred ();



CREATE OR REPLACE FUNCTION check_schedule_constraint_deferred () RETURNS TRIGGER AS $$
	DECLARE 
        latestEndDate TIMESTAMP;	
    BEGIN

            SELECT endDate into latestEndDate
            FROM Schedules S 
            WHERE UserId = NEW.UserId
            AND S.scheduleId <> NEW.scheduleId
            ORDER BY endDate DESC
            LIMIT 1
    ;
    IF NEW.startDate <= latestEndDate THEN
    RAISE EXCEPTION 'Newly added schedule must start after the latest schedule';
    END IF;
    RETURN NULL; 
	END;
$$ LANGUAGE PLPGSQL;


DROP TRIGGER IF EXISTS schedule_trigger ON Schedules CASCADE;
CREATE CONSTRAINT TRIGGER schedule_trigger
	AFTER INSERT ON Schedules
    DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_schedule_constraint_deferred ();



