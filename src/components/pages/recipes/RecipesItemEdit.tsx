import _ from 'lodash';
import React, { useEffect } from "react";
import {
  Slide,
  Alert,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Divider, Input, InputAdornment,
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import { StoragePath } from "../../../misc/enum";
import { cakeSizes } from "../../../misc/statics";
import { useDBItem } from "../../../db/db";
import RecipesIngredientsEdit from "./RecipesIngredientsEdit";

interface Props {
  id: number,
  goBack: () => void,
}

function RecipesItemEdit({ goBack, id }: Props) {
  const [recipe, updateRecipe] = useDBItem(StoragePath.recipes, id);

  if (!recipe) {
    return (
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Alert severity="error">Recipe not found</Alert>
      </Slide>
    )
  }

  const handleInputChange = (field: string) => (e: any) => {
    const value = e.target.value;
    updateRecipe({ [field]: value });
  }

  const handleSetFavorite = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRecipe({
      favorite: e.target.checked,
    });
  }

  const switchControl = <Switch checked={recipe.favorite} onChange={handleSetFavorite}/>;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={goBack}
          >
            <ArrowBack/>
          </IconButton>
          <Typography variant="h6">{recipe.name || `Recipe ${recipe.id}`}</Typography>
        </Toolbar>
      </AppBar>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Box sx={{ px: 2 }}>
          <Grid container sx={{ mt: 2 }} alignItems="center">
            <Grid item xs={6}>
              <FormControlLabel control={switchControl} label="Favorite"/>
            </Grid>
            <Grid item xs={4}>Baking time:</Grid>
            <Grid item xs={2}>
              <Input
                endAdornment={<InputAdornment position="end">h</InputAdornment>}
                value={recipe.bakingTime}
                onChange={handleInputChange('bakingTime')}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            id="outlined-required"
            label="Name"
            value={recipe.name}
            onChange={handleInputChange('name')}
            sx={{ mt: 3 }}
          />
          <Divider sx={{ mt: 3 }}>Size</Divider>
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs>
              <FormControl fullWidth>
                <InputLabel id="ppl-label">Ppl</InputLabel>
                <Select
                  labelId="ppl-label"
                  value={recipe.size}
                  label="Ppl"
                  onChange={handleInputChange('size')}
                >
                  {_.map(cakeSizes, (value, index) => (<MenuItem key={index} value={index}>{value.ppl}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Divider orientation="vertical" flexItem>
              OR
            </Divider>
            <Grid item xs>
              <FormControl fullWidth>
                <InputLabel id="form-label">Form</InputLabel>
                <Select
                  labelId="form-label"
                  value={recipe.size}
                  label="Form"
                  onChange={handleInputChange('size')}
                >
                  {_.map(cakeSizes, (value, index) => (<MenuItem key={index} value={index}>{value.form}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 3 }}>Ingredients</Divider>
          <RecipesIngredientsEdit recipe={recipe} updateRecipe={updateRecipe}/>
        </Box>
      </Slide>
    </Box>
  );
}

export default RecipesItemEdit;