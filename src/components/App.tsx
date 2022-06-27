import React, { useState } from 'react';
import RecipesPage from "./pages/recipes/Recipes";
import IngredientsPage from "./pages/ingredients/Ingredients";
import SettingsPage from "./pages/Settings";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box
} from "@mui/material";
import { Settings, MenuBook, Receipt } from "@mui/icons-material";

const pages = [
  {
    label: 'Ingredients',
    icon: <Receipt/>,
    content: <IngredientsPage/>,
  },
  {
    label: 'Recipes',
    icon: <MenuBook/>,
    content: <RecipesPage/>,
  },
  {
    label: 'Settings',
    icon: <Settings/>,
    content: <SettingsPage/>,
  },
];

function App() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  return (
    <Box sx={{ pb: 9 }}>
      {pages[currentPageIndex].content}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={5}>
        <BottomNavigation
          value={currentPageIndex}
          onChange={(event, newValue) => {
            setCurrentPageIndex(newValue);
          }}
        >
          {pages.map(page => (
            <BottomNavigationAction label={page.label} icon={page.icon} key={page.label}/>
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default App;
