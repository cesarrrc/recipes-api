const { connection, promiseQuery } = require("../sql/connection");

function allMeasurements(req, res, next) {
  console.log("inside GET /ingredients route");
  let sql = `SELECT * FROM measurement_table`;
  promiseQuery(sql).then((rows) => {
    return res.json(rows);
  });
}

module.exports = { allMeasurements };
