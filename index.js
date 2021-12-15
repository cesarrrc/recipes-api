require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connection} = require("./src/sql/connection");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const users = require("./src/routes/users");
const ingredients = require("./src/routes/ingredients");
const recipes = require("./src/routes/recipes");
const measurements = require("./src/routes/measurements");


app.use(users);
app.use(ingredients);
app.use(recipes);
app.use(measurements);
const AppError = require("./src/utils/appError");

const port = process.env.PORT || 3330;

app.all("*", (req, res, next) => {
  const err = new AppError(`Requested URL not found!`, 404);
  next(err);
});

app.use((err, req, res, next) => {
  console.log("get in here");
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: 0,
    message: err.message,
    // stack: err.stack,
  });
});

app.get("/", (req, res) => {
  console.log("hello world");
  res.send("hello world");
});

app.get("/api", (req, res, next) => {
  connection.query(`SELECT * FROM users`, (error, results) => {
    if (error) {
      console.log("error: ", error);
      res.sendStatus(500);
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

app.get("/bad", (req, res, next) => {
  try {
    let e = new AppError("whatever", 403);
    throw e;
  } catch (e) {
    next(e);
  }
});

app.listen(port, () => {
  console.log("listening on port: ", port);
});

