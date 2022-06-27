import { Units } from "./enum";

export interface RecipeIngredient {
  id: number;
  amount: number;
}

export interface Item {
  id: number;
  name: string;
}

export interface Ingredient extends Item {
  price: number;
  unit: Units;
  unitsPerStack: number;
  favorite?: boolean;
}

export interface Recipe extends Item {
  ingredients: RecipeIngredient[];
  size: number;
  bakingTime: number;
  favorite?: boolean;
}

export interface Settings {
  electricityCost: number;
  owenPower: number;
  ccy: string;
}