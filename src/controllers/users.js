const { connection, promiseQuery } = require("../sql/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const supersecret = process.env.JWT_SECRET;

function login(req, res, next) {
  console.log("inside ./POST login");
  const { user_name, user_password } = req.body;
  let sql = `SELECT * FROM users WHERE user_name = ?`;
  promiseQuery(sql, [user_name])
    .then((rows) => {
      let goodpassword;
      if (rows.length > 1) {
        throw new AppError("Multiple records with same UserName", 400);
      }
      if (rows.length == 0) {
        throw new AppError("record not found", 400);
      }
      if (rows.length == 1) {
        console.log(
          `row password before hash compare: `,
          rows[0].user_password
        );
        const hash = rows[0].user_password;
        goodpassword = bcrypt.compareSync(user_password, hash);
        console.log("password is a match? ", goodpassword);
      }
      if (goodpassword) {
        const unsignedToken = {
          user_name: rows[0].user_name,
          user_id: rows[0].user_id,
        };
        const token = jwt.sign(unsignedToken, supersecret);
        res.json({
          token,
          user_id: rows[0].user_id,
          user_name: rows[0].user_name,
        });
      } else {
        console.error("Your password does not match!");
        throw new AppError("Your Password does not match!");
      }
    })
    .catch((e) => {
      next(e);
    });
}

function newUser(req, res, next) {
  console.log("inside the POST /newuser route");
  let { user_name, user_password, email } = req.body;
  user_password = bcrypt.hashSync(user_password, 10);
  console.log(user_password);
  let body = [user_name, user_password, email];
  let sql = `INSERT INTO users (user_name, user_password, email) VALUES (?, ?, ?);`;
  promiseQuery(sql, body)
    .then((rows) => {
      console.log(rows);
      res.json({ user_name: user_name });
    })
    .catch((err) => {
      console.log("in catch");
      next(err);
    });
}

module.exports = { login, newUser };

// function login(req, res, next) {
//   console.log("inside /POST login user route");
//   const { user_name, user_password } = req.body;
//   let sql = `SELECT * FROM users WHERE user_name = ?`;
//   connection.query(sql, [user_name], function (err, rows) {
//     try {
//       if (err) {
//         throw new AppError("Something went wrong", 500);
//       }
//       if (rows.length > 1) {
//         throw new AppError("Multiple records with same UserName", 400);
//       }
//       if (rows.length == 0) {
//         throw new AppError("record not found", 402);
//       }
//       if (!err && rows.length == 1) {
//         if (
//           user_name == rows[0].user_name &&
//           user_password == rows[0].user_password
//         ) {
//           res.json({ user_id: rows[0].user_id, user_name: rows[0].user_name });
//         } else {
//           res.sendStatus(500);
//           console.error("there is a problem with the request: ", err);
//         }
//       }
//     } catch (e) {
//       console.log("catch");
//       next(e);
//     }
//   });
// }
