const { connection, promiseQuery } = require("../sql/connection");
const AppError = require("../utils/appError");

function allRecipes(req, res, next){
  console.log("inside /GET user-recipes route");
  let sql = `
  SELECT r.recipe_name,
    r.recipe_id,
    r.recipe_description,
    r.recipe_image,
    u.user_name
    FROM recipe_table r 
    JOIN users u on u.user_id = r.user_id
    GROUP BY r.recipe_name;
    `;
    promiseQuery(sql).then((rows) => {
      console.log(rows);
      res.send(rows);
    });
  }


  function postRecipe(req, res, next) {
    console.log("inside /POST recipe route");
    const { user_id, recipe_name, recipe_description, recipe_image } = req.body;
    let body = [];
    body.push(user_id, recipe_name, recipe_description, recipe_image);
    let sql = `
    INSERT INTO recipe_table
    VALUES (recipe_id, ?, ?, ?, ?);
    `;
    promiseQuery(sql, body)
      .then(rows=>{
        console.log(rows.insertId)
        return res.send(rows)
      })
  }
  // connection.query(sql, body, function (err, rows) {
  //   if (err) {
  //     res.status(500).send(err);
  //     console.log("There is an error ", err);
  //   } else {
  //     res.json(rows[0].recipe_id);
  //     console.log(rows[0].recipe_id);
  //   }
  // });
  
  function userRecipes(req, res) {
    console.log("inside /GET user-recipes route");
    const { user_name } = req.params;
    console.log(user_name);
    let sql = `
    SELECT r.recipe_name,
    r.recipe_id,
    r.recipe_description,
    r.recipe_image,
    u.user_name
    FROM recipe_table r 
    JOIN users u on u.user_id = r.user_id
    WHERE u.user_name = ?
    GROUP BY r.recipe_name;
    `;
    promiseQuery(sql, [user_name]).then((rows) => {
      console.log(rows);
      res.send(rows);
    });
  }
  
  function getRecipe(req, res) {
    console.log("inside /GET user-recipes route");
    const { recipe_id } = req.params;
    console.log(recipe_id);
    let sql = `
    SELECT r.recipe_name,
    r.recipe_id,
    r.recipe_description,
    r.recipe_image,
    u.user_id,
    u.user_name
    FROM recipe_table r 
    JOIN users u on u.user_id = r.user_id
    WHERE r.recipe_id = ?
    GROUP BY r.recipe_name;
    `;
    promiseQuery(sql, [recipe_id]).then((rows) => {
      console.log(rows);
      res.send(rows);
    });
  }
  
  module.exports = { allRecipes, postRecipe, userRecipes, getRecipe };
  




  // function allRecipes(req, res, next) {
  //   console.log("inside /GET all recipes route");
  //   const sql = `
  //   SELECT r.recipe_name AS 'recipe_name',
  //   r.recipe_id,
  //   GROUP_CONCAT(i.ingredient_name) AS 'ingredient_name',
  //   GROUP_CONCAT(IFNULL(ri.amount, 'null')) AS 'amount',
  //   GROUP_CONCAT(IFNULL(mu.measurement_name, 'null')) AS 'measurement_name'
  //   FROM recipe_table r 
  //   JOIN recipe_ingredient_table ri on r.recipe_id = ri.recipe_id 
  //   JOIN ingredient_table i on i.ingredient_id = ri.ingredient_id 
  //   LEFT OUTER JOIN measurement_table mu on mu.measurement_id = ri.measurement_id
  //   GROUP BY r.recipe_name;
  //   `;
  //   promiseQuery(sql).then((rows) => {
  //     let recipes = [];
  //     for (i = 0; i < rows.length; i++) {
  //       let recipe = {};
  //       let ingredients = [];
  
  //       recipe.recipe_id = rows[i].recipe_id;
  //       recipe.recipe_name = rows[i].recipe_name;
  
  //       let i_name = rows[i].ingredient_name.split(",");
  //       let a = rows[i].amount.split(",");
  //       let m = rows[i].measurement_name.split(",");
  
  //       for (i2 = 0; i2 < i_name.length; i2++) {
  //         let ingredient = {};
  //         ingredient.ingredient_name = i_name[i2];
  //         ingredient.amount = a[i2];
  //         ingredient.measurement = m[i2];
  //         ingredients.push(ingredient);
  //         console.log(i2);
  //       }
  //       recipe.ingredients = ingredients;
  //       recipes.push(recipe);
  //       console.log(recipes, i);
  //     }
  //     console.log(recipes);
  //     return res.json(recipes);
  //   });
  // }
