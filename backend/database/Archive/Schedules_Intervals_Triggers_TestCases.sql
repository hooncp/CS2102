/* START TEST SCHEDULES */
-- insert values
insert into users values (1);
insert into riders values (1, 'west', 2000.20, 5, 'monthly');
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
insert into riders values (2, 'west', 2000.20, 5, 'monthly');
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


-- Trigger on create rider to check that userid doesn't exists in other user roles (child)
--Trigger to check for predefined intervals
DROP FUNCTION IF EXISTS check_mws_intervals_constraint_deferred() CASCADE;
CREATE OR REPLACE FUNCTION check_mws_intervals_constraint_deferred() RETURNS TRIGGER AS $$
	DECLARE
		badInputSchedule 	INTEGER;
BEGIN
    WITH curr_Intervals AS (
        SELECT *
        FROM Intervals I
        WHERE I.scheduleId = NEW.scheduleId1
    ),
    Interval_Pairs (intervalId1, startTime1, endTime1, intervalId2, startTime2, endTime2) AS (
        select cI1.intervalId, cI1.startTime, cI1.endTime, cI2.intervalId, cI2.startTime, cI2.endTime
        from curr_Intervals cI1, curr_Intervals cI2
        where cI1.startTime::date = cI2.startTime::date -- 2 intervals of the same day
        and cI1.startTime::time < cI2.startTime::time -- cI1 is the earlier timing, cI2 the later
    )
    SELECT S.scheduleId INTO badInputSchedule
    FROM Schedules S
    WHERE S.scheduleId = NEW.scheduleId1
    AND (
        NOT EXISTS ( -- table is non-empty
        select 1 from Interval_Pairs IP2 limit 1
        )
        OR
        EXISTS ( --checks for any bad intervals
            SELECT 1
            FROM Interval_Pairs IP
            WHERE (select count(*) from Interval_Pairs) <> ((select count(*) from curr_Intervals) / 2) -- each interval has a pair
            OR NOT(
                IP.startTime1::time = '10:00' OR
                IP.startTime1::time = '11:00' OR
                IP.startTime1::time = '12:00' OR
                IP.startTime1::time = '13:00'
            )
            OR NOT (DATE_PART('hours', IP.endTime1) - DATE_PART('hours',IP.startTime1) = 4
                AND DATE_PART('hours', IP.endTime1) - DATE_PART('hours',IP.startTime1) = 4)

            OR NOT (DATE_PART('hours', IP.startTime2) - DATE_PART('hours',IP.endTime1) = 1)
        )
    )
;

    IF badInputSchedule IS NOT NULL THEN
    RAISE EXCEPTION '% violates some timing in Intervals', badInputSchedule;
    END IF;
    RETURN NULL;
	END;
$$ LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS mws_interval_trigger ON Monthly_Work_Schedules CASCADE;
CREATE CONSTRAINT TRIGGER mws_interval_trigger
	AFTER INSERT ON Monthly_Work_Schedules
	DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_mws_intervals_constraint_deferred();

--[fail] bad intervals (start time wrong)
begin;
insert into schedules values (1,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (2,1,'13 nov 2020', '19 nov 2020');
insert into schedules values (3,1,'19 nov 2020', '25 nov 2020');
insert into schedules values (4,1,'25 nov 2020', '1 dec 2020');
insert into Intervals values (1,1,'2020-11-05 14:00','2020-11-05 18:00');
insert into Intervals values (2,1,'2020-11-05 20:00','2020-11-05 22:00');
insert into monthly_work_schedules values (1,2,3,4);
commit;

--[fail] bad intervals (start time first right, second wrong)
begin;
insert into schedules values (1,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (2,1,'13 nov 2020', '19 nov 2020');
insert into schedules values (3,1,'19 nov 2020', '25 nov 2020');
insert into schedules values (4,1,'25 nov 2020', '1 dec 2020');
insert into Intervals values (1,1,'2020-11-05 10:00','2020-11-05 14:00');
insert into Intervals values (2,1,'2020-11-05 16:00','2020-11-05 20:00');
insert into monthly_work_schedules values (1,2,3,4);
commit;

--[fail] bad intervals (no pair)
begin;
insert into schedules values (1,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (2,1,'13 nov 2020', '19 nov 2020');
insert into schedules values (3,1,'19 nov 2020', '25 nov 2020');
insert into schedules values (4,1,'25 nov 2020', '1 dec 2020');
insert into Intervals values (1,1,'2020-11-05 10:00','2020-11-05 14:00');
insert into Intervals values (2,1,'2020-12-05 10:00','2020-12-05 14:00');
insert into monthly_work_schedules values (1,2,3,4);
commit;

--[pass] good interval
begin;
insert into schedules values (1,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (2,1,'13 nov 2020', '19 nov 2020');
insert into schedules values (3,1,'19 nov 2020', '25 nov 2020');
insert into schedules values (4,1,'25 nov 2020', '1 dec 2020');
insert into Intervals values (1,1,'2020-11-05 10:00','2020-11-05 14:00');
insert into Intervals values (2,1,'2020-11-05 15:00','2020-11-05 19:00');
insert into monthly_work_schedules values (1,2,3,4);
commit;


--Trigger to check for 28 days
DROP FUNCTION IF EXISTS check_mws_28days_constraint_deferred() CASCADE;
CREATE OR REPLACE FUNCTION check_mws_28days_constraint_deferred() RETURNS TRIGGER AS $$
	DECLARE
        newEndDate DATE;
        newStartDate DATE;
    BEGIN
            SELECT endDate into newEndDate
            FROM Schedules S
            WHERE S.scheduleId = NEW.scheduleId4;
            SELECT startDate into newStartDate
            FROM Schedules S2
            WHERE S2.scheduleId = NEW.scheduleId1
    ;
    IF (newEndDate - newStartDate) <> 27 THEN
    RAISE EXCEPTION 'MWS must be declared for 28 days only.';
    END IF;
    RETURN NULL;
	END;
$$ LANGUAGE PLPGSQL;


DROP TRIGGER IF EXISTS mws_trigger ON Monthly_Work_Schedules CASCADE;
CREATE CONSTRAINT TRIGGER mws_trigger
	AFTER INSERT ON Monthly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_mws_28days_constraint_deferred();

-- [fail] MWS is 29 days long
begin;
insert into schedules values (5,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (6,1,'13 nov 2020', '19 nov 2020');
insert into schedules values (7,1,'19 nov 2020', '25 nov 2020');
insert into schedules values (8,1,'25 nov 2020', '2 dec 2020');
insert into Intervals values (3,5,'2020-11-05 10:00','2020-11-05 14:00');
insert into Intervals values (4,5,'2020-11-05 15:00','2020-11-05 19:00');
insert into monthly_work_schedules values (5,6,7,8);
commit;

-- [pass] MWS is 28 days long
begin;
insert into schedules values (5,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (6,1,'14 nov 2020', '20 nov 2020');
insert into schedules values (7,1,'21 nov 2020', '27 nov 2020');
insert into schedules values (8,1,'28 nov 2020', '4 dec 2020');
insert into Intervals values (3,5,'2020-11-05 10:00','2020-11-05 14:00');
insert into Intervals values (4,5,'2020-11-05 15:00','2020-11-05 19:00');
insert into monthly_work_schedules values (5,6,7,8);
commit;

/* Deprecated
--[pass] test MWS is 28 days long
with schedule1 as (
    insert into schedules values (5,1,'1 dec 2020', '7 dec 2020')
    returning scheduleId
),
schedule2 as (
    insert into schedules values (6,1,'8 dec 2020', '14 dec 2020')
    returning scheduleId
),
schedule3 as (
    insert into schedules values (7,1,'15 dec 2020', '22 dec 2020')
    returning scheduleId
),
schedule4 as (
    insert into schedules values (8,1,'23 dec 2020', '29 dec 2020')
    returning scheduleId
)
insert into monthly_work_schedules (scheduleId1, scheduleId2, scheduleId3, scheduleId4)
    select schedule1.scheduleId,
    schedule2.scheduleId,
    schedule3.scheduleId,
    schedule4.scheduleId
    from schedule1, schedule2, schedule3, schedule4;
*/

--Trigger to check for 5 consec days of work
DROP FUNCTION IF EXISTS check_mws_5days_consecutive_constraint_deferred() CASCADE;
CREATE OR REPLACE FUNCTION check_mws_5days_consecutive_constraint_deferred() RETURNS TRIGGER AS $$
	DECLARE
        lastIntervalStartTime TIMESTAMP;
        firstIntervalStartTime TIMESTAMP;
        distinctDates INTEGER;
    BEGIN
            WITH curr_Intervals AS (
            SELECT *
            FROM Intervals I
            WHERE I.scheduleId = NEW.scheduleId1
            )
            SELECT startTime into lastIntervalStartTime
            FROM curr_Intervals I
            ORDER BY endTime DESC
            LIMIT 1;

            WITH curr_Intervals AS (
            SELECT *
            FROM Intervals I2
            WHERE I2.scheduleId = NEW.scheduleId1
            )
            SELECT startTime into firstIntervalStartTime
            FROM curr_Intervals I
            ORDER BY endTime ASC
            LIMIT 1;

            WITH curr_Intervals AS (
            SELECT *
            FROM Intervals I3
            WHERE I3.scheduleId = NEW.scheduleId1
            )
            SELECT COUNT(DISTINCT I.startTime::date) into distinctDates
            FROM curr_Intervals I
    ;
    IF ((lastIntervalStartTime::date - firstIntervalStartTime::date) <> 4 --all intervals within 5 days
    OR distinctDates <> 5) -- each day got interval
    THEN RAISE EXCEPTION 'MWS must have 5 consecutive work days';
    END IF;
    RETURN NULL;
	END;
$$ LANGUAGE PLPGSQL;


DROP TRIGGER IF EXISTS mws_trigger ON Monthly_Work_Schedules CASCADE;
CREATE CONSTRAINT TRIGGER mws_trigger
	AFTER INSERT ON Monthly_Work_Schedules
    DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_mws_5days_consecutive_constraint_deferred();

-- [fail] MWS has 6 days
begin;
insert into schedules values (9,1,'7 nov 2020', '13 nov 2020');
insert into schedules values (10,1,'13 nov 2020', '19 nov 2020');
insert into schedules values (11,1,'19 nov 2020', '25 nov 2020');
insert into schedules values (12,1,'25 nov 2020', '2 dec 2020');

insert into Intervals values (5,9,'2020-11-07 10:00','2020-11-07 14:00');
insert into Intervals values (6,9,'2020-11-07 15:00','2020-11-07 19:00');
insert into Intervals values (7,9,'2020-11-08 10:00','2020-11-08 14:00');
insert into Intervals values (8,9,'2020-11-08 15:00','2020-11-08 19:00');
insert into Intervals values (9,9,'2020-11-09 10:00','2020-11-09 14:00');
insert into Intervals values (10,9,'2020-11-09 15:00','2020-11-09 19:00');
insert into Intervals values (11,9,'2020-11-10 10:00','2020-11-10 14:00');
insert into Intervals values (12,9,'2020-11-10 15:00','2020-11-10 19:00');
insert into Intervals values (13,9,'2020-11-12 10:00','2020-11-12 14:00');
insert into Intervals values (14,9,'2020-11-12 15:00','2020-11-12 19:00');

insert into monthly_work_schedules values (9,10,11,12);
commit;

-- [fail] MWS has 5 days, but not all days got work

begin;
insert into Weekly_Work_Schedules(userId, startDate, endDate) values (43,'7 nov 2020', '13 nov 2020');
insert into Weekly_Work_Schedules(userId, startDate, endDate) values (43,'13 nov 2020', '19 nov 2020');
insert into Weekly_Work_Schedules(userId, startDate, endDate) values (43,'19 nov 2020', '25 nov 2020');
insert into Weekly_Work_Schedules(userId, startDate, endDate) values (43,'25 nov 2020', '1 dec 2020');

insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-07 10:00','2020-11-07 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-07 15:00','2020-11-07 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-08 10:00','2020-11-08 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-08 15:00','2020-11-08 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-09 10:00','2020-11-09 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-09 15:00','2020-11-09 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-10 10:00','2020-11-10 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-10 15:00','2020-11-10 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-11 10:00','2020-11-11 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (664,'2020-11-11 15:00','2020-11-11 19:00');

insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-13 10:00','2020-11-13 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-13 15:00','2020-11-13 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-14 10:00','2020-11-14 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-14 15:00','2020-11-14 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-15 10:00','2020-11-15 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-15 15:00','2020-11-15 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-16 10:00','2020-11-16 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-16 15:00','2020-11-16 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-17 10:00','2020-11-17 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (665,'2020-11-17 15:00','2020-11-17 19:00');

insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-19 10:00','2020-11-19 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-19 15:00','2020-11-19 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-20 10:00','2020-11-20 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-20 15:00','2020-11-20 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-21 10:00','2020-11-21 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-21 15:00','2020-11-21 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-22 10:00','2020-11-22 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-22 15:00','2020-11-22 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-23 10:00','2020-11-23 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (666,'2020-11-23 15:00','2020-11-23 19:00');

insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-25 10:00','2020-11-25 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-25 15:00','2020-11-25 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-26 10:00','2020-11-26 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-26 15:00','2020-11-26 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-27 10:00','2020-11-27 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-27 15:00','2020-11-27 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-28 10:00','2020-11-28 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-28 15:00','2020-11-28 19:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-29 10:00','2020-11-29 14:00');
insert into Intervals(scheduleId, startTime, endTime) values (667,'2020-11-29 15:00','2020-11-29 19:00');

insert into Monthly_Work_Schedules(scheduleId1, scheduleId2, scheduleId3, scheduleId4) values (664,665,666,667);
commit;

-- [pass] MWS has 5 consecutive days
begin;
insert into schedules values (43,'7 nov 2020', '13 nov 2020');
insert into schedules values (43,'14 nov 2020', '20 nov 2020');
insert into schedules values (43,'21 nov 2020', '27 nov 2020');
insert into schedules values (43,'28 nov 2020', '4 dec 2020');

insert into Intervals values (9,'2020-11-07 10:00','2020-11-07 14:00');
insert into Intervals values (9,'2020-11-07 15:00','2020-11-07 19:00');
insert into Intervals values (9,'2020-11-08 10:00','2020-11-08 14:00');
insert into Intervals values (9,'2020-11-08 15:00','2020-11-08 19:00');
insert into Intervals values (9,'2020-11-09 10:00','2020-11-09 14:00');
insert into Intervals values (9,'2020-11-09 15:00','2020-11-09 19:00');
insert into Intervals values (9,'2020-11-10 10:00','2020-11-10 14:00');
insert into Intervals values (9,'2020-11-10 15:00','2020-11-10 19:00');
insert into Intervals values (9,'2020-11-11 10:00','2020-11-11 14:00');
insert into Intervals values (9,'2020-11-11 15:00','2020-11-11 19:00');

insert into monthly_work_schedules values (9,10,11,12);
commit;

