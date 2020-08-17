const Pool = require('pg').Pool;

//change to your own database and password. check if got special characters. change to password with no special characters
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'project',
  password: 'password',
  port: 5432,
});

module.exports = pool;
