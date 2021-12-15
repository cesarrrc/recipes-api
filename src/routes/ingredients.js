const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredients");

router.get("/ingredients", ingredientsController.allIngredients);

router.post("/ingredient", ingredientsController.addIngredient);

router.post("/recipe-ingredient", ingredientsController.addRecipeIngredient);

router.get("/recipe-ingredient/:recipe_id", ingredientsController.recipeIngredients);

module.exports = router;
