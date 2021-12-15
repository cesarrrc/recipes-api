const { promiseQuery } = require("../sql/connection");
const AppError = require("../utils/appError");

function allIngredients(req, res, next) {
  console.log("inside GET /ingredients route");
  let sql = `SELECT * FROM ingredient_table`;
  promiseQuery(sql).then((rows) => {
    return res.json(rows);
  });
}

function addIngredient(req, res, next) {
  console.log("inside /POST ingredient route");
  const { ingredient_name } = req.body;
  let getIngredients = `SELECT * FROM ingredient_table WHERE ingredient_name = ?`;
  let addIngredient = `INSERT INTO ingredient_table (ingredient_name) VALUES (?)`;
  promiseQuery(getIngredients, [ingredient_name])
    .then((rows) => {
      if (rows.length > 0) {
        throw new AppError("Ingredient already exits!", 400);
      } else {
        promiseQuery(addIngredient, [ingredient_name]).then((rows2) => {
          return res.json(rows2);
        });
      }
    })
    .catch((e) => {
      // console.log(e);
      console.log("in catch");
      next(e);
    });
}

function addRecipeIngredient(req, res, next) {
  console.log("inside the /POST recipe-ingredient route");
  const { recipe_id, ingredient_name, measurement_id, amount } = req.body;
  let getIngredients = `SELECT * FROM ingredient_table WHERE ingredient_name = ?`;
  let addIngredient = `INSERT INTO ingredient_table (ingredient_name) VALUES (?)`;
  let addRecipeIngredient = `
    INSERT INTO recipe_ingredient_table (recipe_id, ingredient_id, measurement_id, amount) 
    VALUES (?, ?, ?, ?);
    `;

  promiseQuery(getIngredients, [ingredient_name])
    .then((rows) => {
      if (rows.length > 0) {
        let ingredient_id;
        ingredient_id = rows[0].ingredient_id;
        console.log("ingredient exists");
        return ingredient_id;
      } else {
        return promiseQuery(addIngredient, [ingredient_name]).then((rows2) => {
          let ingredient_id;
          console.log(rows2.insertId);
          console.log(rows2);
          ingredient_id = rows2.insertId;
          console.log(ingredient_id);
          return ingredient_id;
        });
      }
    })
    .then((ingredient_id) => {
      console.log(ingredient_id);
      // ingredient_id = ingredient_id.toString();
      let body = [recipe_id, ingredient_id, measurement_id, amount];
      console.log("body", body);
      promiseQuery(addRecipeIngredient, body).then((rows) => {
        console.log(rows);
        res.json(rows);
      });
    })
    .catch((e) => {
      // console.log(e);
      console.log("in catch");
      next(e);
    });
}

function recipeIngredients(req, res, next) {
  console.log("indside GET all /ingredients/:recipe_id");
  const { recipe_id } = req.params;
  console.log(recipe_id);
  let sql = `
    SELECT u.user_id, r.recipe_name, i.ingredient_name, mu.measurement_name, ri.amount
    FROM recipe_ingredient_table ri
    JOIN recipe_table r ON ri.recipe_id = r.recipe_id 
    JOIN ingredient_table i ON i.ingredient_id = ri.ingredient_id 
    JOIN users u ON u.user_id = r.user_id
    LEFT OUTER JOIN measurement_table mu on mu.measurement_id = ri.measurement_id
    WHERE r.recipe_id = ?;
  `;
  promiseQuery(sql, [recipe_id]).then((rows) => {
    console.log(rows);
    res.send(rows);
  });
}

module.exports = {
  allIngredients,
  addIngredient,
  addRecipeIngredient,
  recipeIngredients,
};
