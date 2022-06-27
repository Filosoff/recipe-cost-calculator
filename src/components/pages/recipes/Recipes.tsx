import React, { useState } from "react";
import RecipesItemEdit from "./RecipesItemEdit";
import RecipesItemView from "./RecipesItemView";
import RecipesList from "./RecipesList";
import { Mode } from "../../../misc/enum";

function RecipesPage() {
  const [itemID, setItem] = useState(0);
  const [mode, setMode] = useState(Mode.list);

  const changeValues = (item = 0, mode = Mode.list) => {
    setItem(item);
    setMode(mode);
  }

  const goBack = () => changeValues(0, Mode.list);
  const goEdit = (id: number) => changeValues(id, Mode.edit);
  const goView = (id: number) => changeValues(id, Mode.view);

  switch (mode) {
    case Mode.list: return <RecipesList setEditID={goEdit} setViewID={goView} />;
    case Mode.edit: return <RecipesItemEdit id={itemID} goBack={goBack} />;
    case Mode.view: return <RecipesItemView id={itemID} goBack={goBack} setEditID={goEdit} />;
    default: return <RecipesList setEditID={goEdit} setViewID={goView} />;
  }
}

export default RecipesPage;