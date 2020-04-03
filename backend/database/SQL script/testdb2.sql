DELETE FROM Users WHERE userId = 4;
UPDATE Users SET userId = 11 WHERE userId = 3;

DELETE FROM Restaurants WHERE rname = 'JIT YONG PTE LTD';
DELETE FROM FOOD  WHERE fname = 'CHICKEN';

INSERT INTO Sells (rname, fname, price, availability) VALUES
('JIT YONG RESTAURANT', 'DUCK', 10.0, 5);

--Support the browsing/searching of food items by customers. or fname
--find all fname, rname that are western. 
SELECT S.fname, S.rname
FROM Sells S JOIN Food F on S.fname = F.fname
WHERE F.category = 'western';

