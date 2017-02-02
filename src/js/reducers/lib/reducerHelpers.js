/// reducerHelpers for reducers

/// Create a new list based on id of new object and id on list.
/// if you need a differen compare function, you ca pass in compare function
const updateListWithObjectById = (list, newObject, compareFunction) => {
  compareFunction = typeof compareFunction === "function" ? compareFunction : ( oldObj) => { return newObject.id === oldObj.id; };

  const newList = _.cloneDeep(list);

  const listIndexToReplace = _.findIndex(newList, compareFunction);

  if(listToReplace>=0) {
    newList[listIndexToReplace] = newObject;
  }

  return newList;
};

export {
  updateListWithObjectById
};
