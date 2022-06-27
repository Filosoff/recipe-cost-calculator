import { Ingredient, Recipe } from "./interface";
import { Units } from "./enum";

export const defaultIngredient:Ingredient = {
  id: 0,
  name: 'New Ingredient',
  price: 1,
  unit: Units.pieces,
  unitsPerStack: 1,
  favorite: false,
}

export const defaultRecipe:Recipe = {
  id: 0,
  name: 'New Recipe',
  ingredients: [],
  size: 0,
  bakingTime: 1,
  favorite: false,
}