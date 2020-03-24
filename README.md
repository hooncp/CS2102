# CS2102
For testing:
cd to frontend => npm start

cd to backend => node app.js

update db.js in backend to fit your own (currently using test inserted with pizza.sql



Test using postman:

GET requests 

eg: http://localhost:5000/rider/getData


POST requests 

eg: http://localhost:5000/rider/insertData

- add Key: Content-Type & Value: application/json to HEADER,

- include info in json format in BODY -> raw

eg: 
{
"name1": "value1",
"name2": "value2"
}
