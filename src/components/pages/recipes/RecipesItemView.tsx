import _ from 'lodash';
import React from "react";
import {
  Slide,
  Alert,
  Box,
  Grid,
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Divider,
  ListItem,
  List,
} from "@mui/material";
import { ArrowBack, Edit } from '@mui/icons-material';
import { StoragePath } from "../../../misc/enum";
import { cakeSizes } from "../../../misc/statics";
import { useDBItem, useDBList, useSettings } from "../../../db/db";
import { RecipeIngredient } from "../../../misc/interface";

interface Props {
  id: number,
  goBack: () => void,
  setEditID: (id: number) => void,
}

function RecipesItemView({ id, goBack, setEditID }: Props) {
  const [recipe] = useDBItem(StoragePath.recipes, id);
  const [ingredients] = useDBList(StoragePath.ingredients);
  const [settings] = useSettings();

  if (!recipe) {
    return (
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Alert severity="error">Recipe not found</Alert>
      </Slide>
    )
  }

  const getIngredientData = (recipeIngredient: RecipeIngredient) => {
    try {
      const ingredient = _.find(ingredients, { id: recipeIngredient.id });
      const costPercentage = recipeIngredient.amount / ingredient.unitsPerStack;
      const cost = ingredient.price * costPercentage;
      return { ingredient, cost };
    } catch {
      return { ingredient: null, cost: 0 }
    }
  }

  const getBakingCost = () => recipe.bakingTime * settings.owenPower * settings.electricityCost;

  const getTotalCost = () => {
    return recipe.ingredients.reduce((acc: number, recipeIngredient: RecipeIngredient) => {
      const { ingredient, cost } = getIngredientData(recipeIngredient);
      if (ingredient) {
        acc += cost;
        return acc;
      }
      return acc;
    }, getBakingCost());
  }

  const RecipeIngredient = (recipeIngredient: RecipeIngredient, index: number) => {
    const { ingredient, cost } = getIngredientData(recipeIngredient);
    if (!ingredient) {
      return null;
    }

    return (
      <React.Fragment key={index}>
        {!!index && <Divider/>}
        <ListItem>
          <Grid container sx={{ py: 0.4 }} justifyContent="space-between">
            <Grid item xs={5}>
              <Typography>{ingredient.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography sx={{
                textAlign: 'right',
                fontSize: '0.9rem'
              }}>{`${recipeIngredient.amount} ${ingredient.unit}`}</Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right' }}>
              <Typography>{`${cost.toFixed(2)} ${settings.ccy}`}</Typography>
            </Grid>
          </Grid>
        </ListItem>
      </React.Fragment>
    )
  }

  const SizesCosts = () => {
    const totalCost = getTotalCost();
    const scale = cakeSizes[recipe.size].value;

    return (
      <List>
        {cakeSizes.map((size, index) => (
          <React.Fragment key={index}>
            <ListItem selected={index === recipe.size}>
              <Grid container sx={{ py: 0.4 }} justifyContent="space-between">
                <Grid item xs={5}>
                  <Typography>{size.ppl}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>{size.form}</Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <Typography>{`${(totalCost * (size.value / scale)).toFixed(2)} ${settings.ccy}`}</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <Divider/>
          </React.Fragment>
        ))}
      </List>
    )
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={goBack}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} >{recipe.name || `Recipe ${recipe.id}`}</Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={() => setEditID(id)}
          >
            <Edit />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Box sx={{ pt: 2 }}>
          <Divider textAlign="left"
                   sx={{ mb: -2, color: 'text.secondary', fontWeight: 300, fontSize: '0.7rem' }}>Ingredients</Divider>
          <List>
            {recipe.ingredients.map((recipeIngredient: RecipeIngredient, index: number) => RecipeIngredient(recipeIngredient, index))}

            <Divider textAlign="left"
                     sx={{ mt: -1, mb: -1, color: 'text.secondary', fontWeight: 300, fontSize: '0.7rem' }}>Baking
              Time</Divider>
            <ListItem>
              <Grid container sx={{ py: 0.4 }} justifyContent="space-between">
                <Grid item xs={9}>
                  <Typography sx={{ textAlign: 'right', fontSize: '0.9rem' }}>{`${recipe.bakingTime}h`}</Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <Typography>{`${(getBakingCost().toFixed(2))} ${settings.ccy}`}</Typography>
                </Grid>
              </Grid>
            </ListItem>

            <Divider textAlign="left" sx={{
              mt: -1,
              mb: -1,
              color: 'text.secondary',
              fontWeight: 300,
              fontSize: '0.7rem'
            }}>Total</Divider>
            <ListItem>
              <Grid container justifyContent="space-between">
                <Grid item xs={12} sx={{ textAlign: 'right' }}><Typography
                  sx={{ fontWeight: 'bold' }}>{`${getTotalCost().toFixed(2)} ${settings.ccy}`}</Typography></Grid>
              </Grid>
            </ListItem>
          </List>

            <Divider textAlign="left"
                     sx={{ mt: 4, mb: -1, color: 'text.secondary', fontWeight: 300, fontSize: '0.7rem' }}>Cost per
              size</Divider>
            {SizesCosts()}
        </Box>
      </Slide>
    </Box>
  );
}

export default RecipesItemView;