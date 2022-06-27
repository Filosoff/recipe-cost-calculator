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
import { useDBList, useSettings } from "../../../db/db";
import { StoragePath } from "../../../misc/enum";
import { defaultIngredient } from "../../../misc/defaults";


interface Props {
  setItemID: (id: number) => void,
}

function IngredientsList(props: Props) {
  const [ingredients, createIngredient, updateIngredient, deleteIngredient] = useDBList(StoragePath.ingredients);
  const [settings] = useSettings();

  const handleSetFavorites = (id: number, favorite: boolean) => () => {
    updateIngredient(id, { favorite });
  }

  const handleCreateIngredient = () => {
    const newID = createIngredient(defaultIngredient);
    props.setItemID(newID)
  }

  const handleDeleteIngredient = (id: number) => () => {
    deleteIngredient(id);
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Ingredients list</Typography>
        </Toolbar>
      </AppBar>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleCreateIngredient} selected>
              <ListItemIcon>
                <Add/>
              </ListItemIcon>
              <ListItemText primary="Create new"/>
            </ListItemButton>
          </ListItem>
          <Divider/>
          {(_.orderBy(ingredients, ['favorite', item => item.name.toLowerCase()], ['desc', 'asc'])).map((item: any) => (
            <React.Fragment key={item.name}>
              <ListItem>
                <ListItemIcon>
                  <IconButton onClick={handleSetFavorites(item.id, !item.favorite)}>
                    {item.favorite ? <Star/> : <StarBorder/>}
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={item.name || `Ingredient ${item.id}`}
                  secondary={`${item.price || 0} ${settings.ccy} for ${item.unitsPerStack || 0} ${item.unit}`}
                />
                <ListItemIcon>
                  <IconButton onClick={() => props.setItemID(item.id)}>
                    <Edit/>
                  </IconButton>
                  <IconButton onClick={handleDeleteIngredient(item.id)}>
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

export default IngredientsList;