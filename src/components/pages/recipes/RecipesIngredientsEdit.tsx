import _ from 'lodash';
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
  Input, ListItemText, ListItemIcon
} from "@mui/material";
import { Delete, Star, StarBorder } from '@mui/icons-material';
import { StoragePath } from "../../../misc/enum";
import { useDBList } from "../../../db/db";
import { Ingredient, Recipe, RecipeIngredient } from "../../../misc/interface";

interface Props {
  recipe: Recipe;
  updateRecipe: (item: Recipe) => Recipe,
}

function RecipesIngredientsEdit({ updateRecipe, recipe }: Props) {
  const [ingredients] = useDBList(StoragePath.ingredients);
  const [selectedID, setSelectedID] = useState(-1)
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);

  useEffect(() => {
    const filtered = ingredients.filter((ing: Ingredient) => !recipe.ingredients.map(i => i.id).includes(ing.id))
    const ordered = _.orderBy(filtered, ['favorite', item => item.name.toLowerCase()], ['desc', 'asc']);
    setFilteredIngredients(ordered);
  }, [ingredients, recipe.ingredients])

  const handleSelectChange = (e: SelectChangeEvent) => {
    setSelectedID(parseInt(e.target.value, 10));
  }

  const handleAddClick = () => {
    const ingredient = _.find(ingredients, { id: selectedID });
    if (!ingredient) {
      return;
    }

    const updatedRecipe = _.cloneDeep(recipe);
    updatedRecipe.ingredients.push({
      id: ingredient.id,
      amount: ingredient.unitsPerStack,
    });

    updateRecipe(updatedRecipe);
    setSelectedID(-1);
  }

  const handleDeleteClick = (id: number) => () => {
    const updatedRecipe = _.cloneDeep(recipe);
    _.remove(updatedRecipe.ingredients, { id });
    updateRecipe(updatedRecipe);
  }

  const handleAmountChange = (id: number) => (e: any) => {
    const value = e.target.value;
    const updatedRecipe = _.cloneDeep(recipe);
    const index = _.findIndex(updatedRecipe.ingredients, { id });
    updatedRecipe.ingredients[index].amount = parseInt(value, 10) || 0;
    updateRecipe(updatedRecipe);
  }

  const IngredientEntry = (recipeIngredient: RecipeIngredient, index: number) => {
    const ingredient = _.find(ingredients, { id: recipeIngredient.id });
    if (!ingredient) {
      return null;
    }
    return (
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0 }} key={index}>
        <Grid item xs={6}>{_.get(ingredient, 'name', `Ingredient ${ingredient.id}`)}</Grid>
        <Grid item xs={4}>
          <Input
            endAdornment={<InputAdornment position="end">{_.get(ingredient, 'unit', 'N/A')}</InputAdornment>}
            value={recipeIngredient.amount}
            onChange={handleAmountChange(recipeIngredient.id)}
          />
        </Grid>
        <Grid item xs="auto">
          <IconButton aria-label="delete" onClick={handleDeleteClick(recipeIngredient.id)}>
            <Delete/>
          </IconButton>
        </Grid>
      </Grid>
    )
  }

  return (
    <Box>
      {recipe.ingredients.map((recipeIngredient, index) => IngredientEntry(recipeIngredient, index))}
      {!_.isEmpty(filteredIngredients) && (
        <Grid container sx={{ mt: 3 }} justifyContent="space-between">
          <Grid item xs={9}>
            <FormControl fullWidth size="small">
              <InputLabel id="ingredient-label">Ingredient</InputLabel>
              <Select
                labelId="ingredient-label"
                label="Ingredient"
                value={selectedID.toString()}
                onChange={handleSelectChange}
                renderValue={() => _.get(_.find(ingredients, { id: selectedID }), 'name', 'Select ingredient')}
              >
                {_.map(filteredIngredients, (ingredient, index) => (
                  <MenuItem key={index} value={ingredient.id}>
                    <ListItemIcon>{ingredient.favorite ? <Star/> : <StarBorder/>}</ListItemIcon>
                    <ListItemText primary={ingredient.name}/>
                  </MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs="auto">
            <Button variant="contained" sx={{ py: 0.9 }} onClick={handleAddClick}>Add</Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default RecipesIngredientsEdit;