import _ from 'lodash';
import { useEffect, useState } from "react";
import { StoragePath } from "../misc/enum";
import { defaultSettings } from "../misc/statics";
import { Settings } from "../misc/interface";

const getDBList = (path: string) => {
  try {
    return JSON.parse(window.localStorage.getItem(path) || '[]');
  } catch {
    return [];
  }
}

const getDBItem = (path: string, id: number) => {
  try {
    const list = getDBList(path);
    return _.find(list, { id });
  } catch {
    return;
  }
}

const createDBItem = (path: string, item: object): number => {
  try {
    const list = getDBList(path);
    const nextID = _.get(_.last(list), 'id', 0) + 1;
    list.push({
      ...item,
      id: nextID,
      name: `${_.get(item, 'name', 'Item')} ${nextID}`,
    });

    window.localStorage.setItem(path, JSON.stringify(list));

    return nextID;
  } catch {
    return -1;
  }
}

const updateDBItem = (path: string, id: number, changes: object): void => {
  try {
    const list = getDBList(path);
    const index = _.findIndex(list, { id });
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...changes,
      };

      window.localStorage.setItem(path, JSON.stringify(list));
    }
  } catch {
    return;
  }
}

const deleteDBItem = (path: string, id: number): void => {
  try {
    const list = getDBList(path);
    _.remove(list, { id });
    window.localStorage.setItem(path, JSON.stringify(list));
  } catch {
    return;
  }
}

export const useDBList = (path: string) => {
  const [list, updateList] = useState(getDBList(path));

  const createItem = (item: object):number => {
    const createdID = createDBItem(path, item);
    updateList(getDBList(path));
    return createdID;
  };

  const updateItem = (id: number, changes: object) => {
    updateDBItem(path, id, changes);
    updateList(getDBList(path));
  };

  const deleteItem = (id: number) => {
    deleteDBItem(path, id);
    updateList(getDBList(path));
  };

  useEffect(() => {
    updateList(getDBList(path));
  }, [path]);

  return [list, createItem, updateItem, deleteItem];
}

export const useDBItem = (path: string, id: number) => {
  const [item, updateItem] = useState(getDBItem(path, id));

  const update = (changes: object) => {
    updateItem((item: object) => ({
      ...item,
      ...changes,
    }));
    updateDBItem(path, id, changes);
  };

  useEffect(() => {
    updateItem(getDBItem(path, id));
  }, [path, id]);

  return [item, update];
}

export const useSettings = ():[Settings, (changes:object) => void] => {
  const [settings, setSettings] = useState(defaultSettings);

  const update = (changes: object) => {
    const newSettings = {
      ...settings,
      ...changes,
    };

    _.forEach(changes, (value, key) => {
      if (!value) {
        _.unset(changes, key);
      }
    })

    window.localStorage.setItem(StoragePath.settings, JSON.stringify(changes));
    setSettings(newSettings);
  }

  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(StoragePath.settings) || '{}';
      const savedSettings = JSON.parse(savedData);
      const actualSettings = {
        ...defaultSettings,
        ...savedSettings,
      };
      setSettings(actualSettings);
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  return [settings, update];
}