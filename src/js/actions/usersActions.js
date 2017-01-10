/// Actions for viewing and managing users

import * as base from "./baseActions";
import _ from "lodash";

/// Fetch a list of users, optionally with search Terms
export function fetchUsers(searchTerms) {
  return function(dispatch) {
      getUsers(dispatch,searchTerms);
  };
}

export function fetchTaxPros() {
 let searchUrl = "/users?role=TaxPro";
  
  return function(dispatch) {
  base.get(searchUrl)
    .then((response) => {
      let result = { data: response.data };
      dispatch({type: "FETCH_TAXPROS_FULFILLED", payload:  result});
    })
    .catch((err) => {
      dispatch({type: "FETCH_TAXPROS_REJECTED", payload: err});
    });
  };
}

const  getUsers = (dispatch, searchTerms) => {
  let searchUrl = "/users";
  
  if(searchTerms) {
    searchUrl+=searchTermsToString(searchTerms);
  }

  base.get(searchUrl)
    .then((response) => {
      let result = { searchTerms: searchTerms, data: response.data };
      dispatch({type: "FETCH_USERS_FULFILLED", payload:  result});
    })
    .catch((err) => {
      dispatch({type: "FETCH_USERS_REJECTED", payload: err});
    });
}

export function updateSearchTerms(searchTerms,newSearchTerms) {
  return function(dispatch) {
    let  newTermResults =  _.cloneDeep(newSearchTerms);
    newTermResults = _.concat(newTermResults,getNewOrderAscendingSearchTerm(searchTerms,newSearchTerms));

    // get old terms that are not in new terms
    let remainingOldTerms = _.filter(searchTerms,(searchTerm) => {
      return !_.some(newTermResults,(nre) => { return  nre.key===searchTerm.key});
    });

    newTermResults = _.concat(newTermResults,remainingOldTerms);

    dispatch({type:"SEARCH_TERMS_UPDATED",payload:newTermResults});

    getUsers(dispatch,newTermResults);
  } 
}

const getNewOrderAscendingSearchTerm = (searchTerms,newSearchTerms) => {
  let orderAscending = { key:"orderAscending", val:"true"};
  // sortBy reversal
  let newOrderBy = _.find(newSearchTerms,(nst) => { return nst.key==="orderBy" });

  if(newOrderBy) {

    let oldOrderBy = _.find(searchTerms,(nst) => { return nst.key==="orderBy"});

    if(oldOrderBy && oldOrderBy.val===newOrderBy.val) {
      let oldOrderAscending = _.find(searchTerms,(nst) => { return nst.key==="orderAscending"});

      orderAscending.val = oldOrderAscending? oldOrderAscending.val : orderAscending.val;

      orderAscending.val = orderAscending.val==="true" ? "false": "true";
    }
    return [orderAscending];
  } else {
    return [];
  }
};

const searchTermsToString = (searchTerms) => {
  let asString = searchTerms.map((term) => { return term.key+"="+term.val }).join("&");

  return asString? "?"+asString: "";
};

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
