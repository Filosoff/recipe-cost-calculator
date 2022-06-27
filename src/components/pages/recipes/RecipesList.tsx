import _ from 'lodash';
import React from "react";
import {
  Slide,
  IconButton,
  Divider,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  ListItemButton, Box, AppBar, Toolbar, Typography,
} from "@mui/material";
import { Star, StarBorder, Edit, Delete, Add } from '@mui/icons-material';
import { useDBList } from "../../../db/db";
import { StoragePath } from "../../../misc/enum";
import { Recipe } from "../../../misc/interface";
import { defaultRecipe } from "../../../misc/defaults";


interface Props {
  setEditID: (id: number) => void,
  setViewID: (id: number) => void,
}

function RecipesList({ setEditID, setViewID }: Props) {
  const [recipes, createRecipe, updateRecipe, deleteRecipe] = useDBList(StoragePath.recipes);

  const handleSetFavorites = (id: number, favorite: boolean) => () => {
    updateRecipe(id, { favorite });
  }

  const handleCreateRecipe = () => {
    const newID = createRecipe(defaultRecipe);
    setEditID(newID)
  }

  const handleDeleteRecipe = (id: number) => () => {
    deleteRecipe(id);
  }

  const handleViewlick = (id: number) => () => {
    setViewID(id);
  }

  const handleEditlick = (id: number) => () => {
    setEditID(id);
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Recipes list</Typography>
        </Toolbar>
      </AppBar>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleCreateRecipe} selected>
              <ListItemIcon>
                <Add/>
              </ListItemIcon>
              <ListItemText primary="Create new"/>
            </ListItemButton>
          </ListItem>
          <Divider/>
          {(_.orderBy(recipes, ['favorite', recipe => recipe.name.toLowerCase()], ['desc', 'asc'])).map((recipe: Recipe) => (
            <React.Fragment key={recipe.name}>
              <ListItem sx={{ px: 1, py: 0 }}>
                <ListItemIcon>
                  <IconButton onClick={handleSetFavorites(recipe.id, !recipe.favorite)}>
                    {recipe.favorite ? <Star/> : <StarBorder/>}
                  </IconButton>
                </ListItemIcon>
                <ListItemButton onClick={handleViewlick(recipe.id)}>
                  <ListItemText
                    primary={recipe.name || `Recipe ${recipe.id}`}
                  />
                </ListItemButton>
                <ListItemIcon>
                  <IconButton onClick={handleEditlick(recipe.id)}>
                    <Edit/>
                  </IconButton>
                  <IconButton onClick={handleDeleteRecipe(recipe.id)}>
                    <Delete/>
                  </IconButton>
                </ListItemIcon>
              </ListItem>
              <Divider/>
            </React.Fragment>
          ))}
        </List>
      </Slide>
    </Box>
  );
}

export default RecipesList;