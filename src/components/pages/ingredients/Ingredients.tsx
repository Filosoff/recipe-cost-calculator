import React, { useState } from "react";
import IngredientsItem from "./IngredientsItem";
import IngredientsList from "./IngredientsList";

function IngredientsPage() {
  const [activeItem, setActiveItem] = useState(0);

  const goBack = (): void => {
    setActiveItem(0);
  }

  return activeItem ? <IngredientsItem id={activeItem} goBack={goBack}/> : <IngredientsList setItemID={setActiveItem}/>;
}

export default IngredientsPage;