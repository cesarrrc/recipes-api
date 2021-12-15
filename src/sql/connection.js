const { createPool } = require("mysql");

const connection = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});

const promiseQuery = (...args) => {
  return new Promise((resolve, reject) => {
    connection.query(...args, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
};

module.exports = { connection, promiseQuery };
