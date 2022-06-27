import _ from 'lodash';
import React from "react";
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
  InputAdornment,
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import { StoragePath, Units } from "../../../misc/enum";
import { useDBItem, useSettings } from "../../../db/db";

interface Props {
  id: number,
  goBack: () => void,
}

function IngredientsItem({ goBack, id }: Props) {
  const [item, updateItem] = useDBItem(StoragePath.ingredients, id);
  const [settings] = useSettings();

  if (!item) {
    return (
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Alert severity="error">Ingredient not found</Alert>
      </Slide>
    )
  }

  const handleInputChange = (field: string) => (e: any) => {
    const value = e.target.value;
    updateItem({ [field]: value });
  }

  const handleSetFavorite = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateItem({
      favorite: e.target.checked,
    });
  }

  const switchControl = <Switch checked={item.favorite} onChange={handleSetFavorite}/>;

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
          <Typography variant="h6">{item.name || `Ingredient ${item.id}`}</Typography>
        </Toolbar>
      </AppBar>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Box sx={{ px: 2 }}>
          <FormControlLabel sx={{ mt: 2 }} control={switchControl} label="Favorite"/>
          <TextField
            fullWidth
            id="outlined-required"
            label="Name"
            value={item.name}
            onChange={handleInputChange('name')}
            sx={{ mt: 3 }}
          />

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="outlined-required"
                label="Price"
                value={item.price}
                onChange={handleInputChange('price')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{settings.ccy}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="outlined-required"
                label="Per stack"
                value={item.unitsPerStack}
                onChange={handleInputChange('unitsPerStack')}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="units-label">Units</InputLabel>
                <Select
                  labelId="units-label"
                  value={item.unit}
                  label="Units"
                  onChange={handleInputChange('unit')}
                >
                  {_.map(Units, (label, value) => (<MenuItem key={value} value={label}>{label}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Slide>
    </Box>
  );
}

export default IngredientsItem;