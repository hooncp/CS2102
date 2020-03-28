DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Food CASCADE;
DROP TABLE IF EXISTS Sells CASCADE;
DROP TABLE IF EXISTS Restaurant_Staff CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS Riders CASCADE;
DROP TABLE IF EXISTS Part_Time CASCADE;
DROP TABLE IF EXISTS Full_Time CASCADE;
DROP TABLE IF EXISTS Schedules CASCADE;
DROP TABLE IF EXISTS Monthly_Work_Schedules CASCADE;
DROP TABLE IF EXISTS Weekly_Work_Schedules CASCADE;
DROP TABLE IF EXISTS Intervals CASCADE;
DROP TABLE IF EXISTS Order_Details CASCADE;
DROP TABLE IF EXISTS Schedules CASCADE;
DROP TABLE IF EXISTS Delivery_Details CASCADE;
DROP TABLE IF EXISTS Promotions CASCADE;
DROP TABLE IF EXISTS MinSpendingPromotions CASCADE;
DROP TABLE IF EXISTS CustomerPromotions CASCADE;

CREATE TABLE Users (
	userId 		INTEGER,
    PRIMARY KEY (userId)
);

CREATE TABLE Restaurants (
	rname 		VARCHAR(200),
	minOrderAmt	NUMERIC(8, 2),
	area 		VARCHAR(200),
    PRIMARY KEY (rname),
	CHECK(area = 'Central' OR
		 area = 'West' OR
		 area = 'East' OR
		 area = 'North' OR
		 area = 'South')
);

CREATE TABLE Food (
	fname 		VARCHAR(20),
	category 	VARCHAR(20),
    PRIMARY KEY (fname)
);

CREATE TABLE Sells (
	rname 		VARCHAR(20) REFERENCES Restaurants on DELETE CASCADE,
    fname 		VARCHAR(20) REFERENCES Food on DELETE CASCADE,
    price 		NUMERIC(8, 2) NOT NULL,
    availability 	INTEGER,
    PRIMARY KEY (rname, fname) 
);

CREATE TABLE Restaurant_Staff (
	userId 		INTEGER,
	rname		VARCHAR(20) REFERENCES Restaurants,
	PRIMARY KEY (userId),
	FOREIGN KEY (userId) REFERENCES Users
			on DELETE CASCADE
);
-- Delete cascade can only work on foreign key 

CREATE TABLE Customers (
	userId 		INTEGER,
    PRIMARY KEY (userId),
	FOREIGN KEY (userId) REFERENCES Users
		on DELETE CASCADE
);

CREATE TABLE Riders (
	userId 		INTEGER,
	area 		VARCHAR(20) NOT NULL,
	salary		NUMERIC(8,2),	
	ratings		INTEGER,
	type  		VARCHAR(20) NOT NULL,
    PRIMARY KEY (userId),
	FOREIGN KEY (userId) REFERENCES Users
			on DELETE CASCADE,
	CHECK(area = 'Central' OR
		 area = 'West' OR
		 area = 'East' OR
		 area = 'North' OR
		 area = 'South'),
	CHECK (ratings <= 5)
);

CREATE TABLE Part_Time (
    userId 		INTEGER,
    PRIMARY KEY (userId), 
	FOREIGN KEY (userId) REFERENCES Riders
			on DELETE CASCADE
);

CREATE TABLE Full_Time (
    userId 		INTEGER,
    PRIMARY KEY (userId),
	FOREIGN KEY (userId) REFERENCES Riders 
			on DELETE CASCADE
);

CREATE TABLE Schedules (
	scheduleId INTEGER,
	userId INTEGER,
	startDate date,
	endDate date,
	PRIMARY KEY (scheduleId),
	FOREIGN KEY (userId) REFERENCES Riders(userId),
	check ((endDate - startDate) = 7)
);

CREATE TABLE Monthly_Work_Schedules (
	scheduleId	INTEGER REFERENCES Schedules,
	PRIMARY KEY (scheduleId)
	--DEFERRED TRIGGER TO CHECK FOR CONSTRAINTS (FOR BOTH INTERVAL & SCHEDULE)
);

CREATE TABLE Weekly_Work_Schedules (
	scheduleId	INTEGER  REFERENCES Schedules,
	PRIMARY KEY (scheduleId)
	--DEFERRED TRIGGER TO CHECK FOR CONSTRAINTS (FOR BOTH INTERVAL & SCHEDULE)
);



CREATE TABLE Intervals (
	intervalId INTEGER,
	scheduleId INTEGER,
	startTime TIMESTAMP,
	endTime TIMESTAMP,
	PRIMARY KEY (intervalId),
	FOREIGN KEY (scheduleId) REFERENCES Schedules(scheduleId),
	check (DATE_PART('minutes', startTime) = 0
	AND
	DATE_PART('seconds', startTime) = 0
	AND
	DATE_PART('minutes', endTime) = 0
	AND
	DATE_PART('seconds', startTime) = 0
	AND
	DATE_PART('hours', endTime) - DATE_PART('hours', startTime) <= 4
	AND
	startTime::date = endTime::date
	AND
	DATE_PART('hours', endTime) > DATE_PART('hours', startTime)
	AND
	startTime::time >= '10:00'
	AND
	endTime::time <='22:00'
	)
);

CREATE TABLE Delivery_Details (
	deliveryId			        INTEGER,
	userId				        INTEGER NOT NULL, 
	departTimeForRestaurant	    TIMESTAMP,
	departTimeFromRestaurant    TIMESTAMP,
	deliveryTimetoCustomer	    TIMESTAMP,
	arrivalTimeAtRestaurant	    TIMESTAMP,  
	ratingId			        INTEGER, 
	ratingContent			    INTEGER,
    PRIMARY KEY (deliveryId)	
);

CREATE TABLE Promotions (
	promoCode	    VARCHAR(20),	
	promoDesc 		VARCHAR(200),
	createdBy	    VARCHAR(50),
	applicableTo	VARCHAR(200),
	discUnit	    VARCHAR(20),
	discRate	    VARCHAR(20),
	startDate	    DATE,
	endDate	        DATE,
	type		    VARCHAR(50),
	PRIMARY KEY (promoCode, applicableTo)
);

CREATE TABLE Order_Details (
	orderId 		INTEGER,
	userId 			INTEGER NOT NULL REFERENCES Customers,
	deliveryId		INTEGER NOT NULL REFERENCES Delivery_Details,
	promoCode		VARCHAR(20),
    applicableTo	VARCHAR(200),
	rname			VARCHAR(100),
	fname 			VARCHAR(100),
	modeOfPayment 	VARCHAR(10) NOT NULL,
	totalFoodPrice 	NUMERIC(8,2) NOT NULL,
	deliveryFee		NUMERIC(8,2) NOT NULL,
	timeOfOrder		TIMESTAMP NOT NULL,
	foodQty		    INTEGER NOT NULL,
	deliveryLocation	VARCHAR(100) NOT NULL,
	usedRewardPoints	INTEGER NOT NULL,
	givenRewardPoints	INTEGER NOT NULL,
	rvId			INTEGER NOT NULL,
	content		    VARCHAR(100),
	
	PRIMARY KEY(orderId, rname, fname),
	FOREIGN KEY(promoCode, applicableTo)  REFERENCES Promotions,
	FOREIGN KEY(rname, fname) REFERENCES Sells(rname, fname),
	CHECK(modeOfPayment = 'cash' OR
		 	modeOfPayment ='credit')
);

CREATE TABLE MinSpendingPromotions (
	promoCode	    VARCHAR(20),	
	applicableTo	VARCHAR(200),
	minAmt	        NUMERIC(8, 2),
	PRIMARY KEY (promoCode, applicableTo),
	FOREIGN KEY (promoCode, applicableTo) REFERENCES Promotions
);

CREATE TABLE CustomerPromotions (
    promoCode		VARCHAR(20),	
	applicableTo	VARCHAR(200),
	minAge			INTEGER,
	maxAge 			INTEGER,
	minTimeFromLastOrder 	INTEGER, -- # of days
	PRIMARY KEY (promoCode, applicableTo),
	FOREIGN KEY (promoCode, applicableTo) REFERENCES Promotions
);	