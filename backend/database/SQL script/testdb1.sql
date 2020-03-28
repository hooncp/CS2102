--delete cascade means that you delete userid of 4 from user, 
--those that references userid will be affected. parent affect child. The other way not affected
DELETE FROM Users WHERE userId = 4;

-- updates all the riderID.
UPDATE Users SET userId = 11 WHERE userId = 6;


--How to update from full-time to part-time rider;
BEGIN;
    DELETE FROM Part_time WHERE userId = 5;
    INSERT INTO Full_time(userId) VALUES (5);
COMMIT;

--insert new user data into database.
BEGIN;
    INSERT INTO Users(userId) VALUES (11);
    INSERT INTO Riders(userId, area) VALUES (11, 'central');
    INSERT INTO Part_time(userId) VALUES(11);
COMMIT;


BEGIN;
    
/*
1) creation/deletion/update of data for the different users (customers, restaurant staff,
delivery riders, and FDS managers).
*/