# Introduction:
This project is a PERN (PostgresSQL, Express, Node.js and React) full stack web application. This repository contains an sample of a food delivery service application. For further details, refer to the report.

# Application setup:

- Clone the code
- Restore missing packages by using npm install in both frontend and backend folders.
- Initialize database in the /backend/database/SQL_script folder and using the command \i init.sql and \i loaddb.sql in PSQL console.
- Make appropriate changes to /backend/database/db.js

```
const pool = new Pool({
  user: 'postgres',     //change to your own postgres user
  host: 'localhost', 
  database: 'project',  //change to your own database name
  password: 'password', //change to your own postgres password
  port: 5432,
}); 
```
# Running the application:
- cd backend
- npm start
- cd frontend
- npm start

# Documentation
- Refer to the report.pdf 
