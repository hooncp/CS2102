CREATE OR REPLACE FUNCTION check_totalPrice_minOrderAmt () RETURNS
TRIGGER AS $$
	DECLARE
		checkTotalAmt		NUMERIC(8,2);
		minRestaurantAmount	NUMERIC(8, 2);
	BEGIN
		With totalPriceEachOrder AS (
			SELECT orderId, c.rname, sum(price*foodQty) as totalPrice
			FROM Contains c, Sells s
			WHERE c.fname = s.fname
			and c.rname = s.rname
			and c.fname = s.fname
			GROUP BY c.orderId, c.rname, c.fname
		)
		
		SELECT r.minOrderAmt, sum(t.totalPrice) INTO minRestaurantAmount, checkTotalAmt 
		FROM totalPriceEachOrder t, Restaurants r
		WHERE t.rname = r.rname
		GROUP BY t.orderId, r.rname;

		IF minRestaurantAmount > checkTotalAmt THEN
				RAISE EXCEPTION 'Did not hit the total amount of food to be bought at the restaurant';
		END IF;
		RETURN NULL;
	END;

$$ LANGUAGE PLPGSQL;


DROP TRIGGER IF EXISTS orders_trigger ON Orders CASCADE;
CREATE CONSTRAINT TRIGGER order_trigger
	AFTER INSERT ON Orders 
	DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION check_totalPrice_minOrderAmt();
	
