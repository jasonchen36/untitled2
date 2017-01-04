/// Actions for viewing and managing users

import * as base from "./baseActions";

/// Fetch a list of users, optionally with search Terms
export function fetchUsers(searchTerms) {
  return function(dispatch) {
    let searchUrl = "/users";
    
    if(searchTerms) {
      searchUrl+="?"+searchTerms;
    }

    base.get(searchUrl)
      .then((response) => {
        dispatch({type: "FETCH_USERS_FULFILLED", payload:  response.data});
      })
      .catch((err) => {

        dispatch({type: "FETCH_USERS_REJECTED", payload: err});
      })
  };
}

/// Fetch user details by id
export function fetchUser(id) {
  return function(dispatch) {
    base.get("/users/"+id)
      .then((response) => {
        dispatch( { type: "FETCH_USER_FULFILLED", payload: response.data});
      });
  };
};

/// add a user
///TODO: implement
export function addUser(id, text) {
  return {
    type: 'ADD_USER',
    payload: {
      id,
      text,
    },
  };
};

/// update a user
/// id: the user's id
/// updateValues : { email:"email",first_name:"new firstname", last_name:"last_name", "phone:"phone", role: "Admin"/"Customer"/"Taxpro" } Only include fields that are to be changed (overwritten)
export function updateUser(id, updatedValues) {
  // update the user 
  return function(dispatch) {
    base.put("/users/"+id,updatedValues)
      .then((response) => {
        dispatch( { type: "UPDATE_USER_FULFILLED", payload: response.data });     
      });
  };
};

/// delete the user
/// id: the id of the user to delete. Be careful!
export function deleteUser(id) {

  return function(dispatch) {
    base.del("/users/"+id)
      .then((response) => {
        dispatch( { type: 'DELETE_USER_FULFILLED', payload: id});
      });
  };
};
