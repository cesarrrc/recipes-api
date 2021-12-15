const { connection, promiseQuery } = require("../sql/connection");
const jwt = require("jsonwebtoken");
const superSecret = process.env.JWT_SECRET;

const checkJwt = (req, res, next) => {
  console.log("processing token");
  let token;
  if (req.headers.authorization) {
    let bearer = req.headers.authorization.split(" ");
    token = bearer[1];
  } else {
    token = null;
  }
  if (!token) {
    return res.status(401).send("Unauthorized!");
  }
  jwt.verify(token, superSecret, function (err, decoded) {
    if (err) {
      console.timeLog("Did not verify jwt ", err);
      return res.status(401).send("Unauthorized!");
    }
    console.log(decoded);
    req.user_name = decoded.user_name;
    req.user_id = decoded.user_id;
    console.log(req.user_id, req.user_name);
    next();
  });
};

module.exports = { checkJwt };
