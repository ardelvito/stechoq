const mariadb = require('mariadb');
const dotenv = require("dotenv")
dotenv.config()

// Debug log ENV variables
console.log('ENV CHECK:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[PROVIDED]' : '[MISSING]');
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mariadb.createPool(
    {
        host: process.env.DB_HOST, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }
);

module.exports = pool;
