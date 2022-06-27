import _ from 'lodash';
import React from "react";
import {
  AppBar,
  Box,
  List,
  Slide,
  ListItem,
  Grid,
  Toolbar,
  Typography,
  Divider,
  InputAdornment,
  Input
} from "@mui/material";
import { useSettings } from "../../db/db";
import { defaultSettings } from "../../misc/statics";


const labels = {
  electricityCost: {
    primary: 'Electricity cost',
    secondary: 'kWh',
  },
  owenPower: {
    primary: 'Owen power',
    secondary: 'kW',
  },
  ccy: 'Currency',
}

function SettingsPage() {
  const [settings, updateSettings] = useSettings();

  const handleInputChange = (key: string) => (e: any) => {
    const value = e.target.value;
    updateSettings({ [key]: value });
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Settings</Typography>
        </Toolbar>
      </AppBar>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <List>
          {_.map(settings, (value, key) => (
            <React.Fragment key={key}>
              <ListItem>
                <Grid container>
                  <Grid item xs={8}>{_.get(labels, `${key}.primary`, key)}</Grid>
                  <Grid item xs={4}>
                    <Input
                      endAdornment={<InputAdornment
                        position="end">{_.get(labels, `${key}.secondary`, '')}</InputAdornment>}
                      placeholder={(_.get(defaultSettings, key, key)).toString()}
                      value={value}
                      onChange={handleInputChange(key)}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <Divider/>
            </React.Fragment>
          ))}
        </List>
      </Slide>
    </Box>
  );
}

export default SettingsPage;