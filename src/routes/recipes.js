const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipes");
const { checkJwt } = require("../utils/checkJwt");

router.get("/recipes", recipesController.allRecipes);
router.get("/recipes/:recipe_id", recipesController.getRecipe);
router.get("/user-recipes/:user_name", recipesController.userRecipes);

router.post("/recipe", recipesController.postRecipe);

module.exports = router;
