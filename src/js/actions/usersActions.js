/// Actions for viewing and managing users

import * as base from "./lib/baseActions";
import _ from "lodash";
import { currentYearProductId } from "../config";


/// Fetch a list of users, optionally with search Terms
const fetchUsers = (searchTerms) => {
  return function(dispatch) {
    let searchUrl = "/users";
    
    if(searchTerms || currentYearProductId) {
      searchUrl+=searchTermsToString(searchTerms);
    }
  
    return base.get(searchUrl)
      .then((response) => {
        let result = { searchTerms: searchTerms, data: response.data };
  
        dispatch({type: "FETCH_USERS_FULFILLED", payload:  result});
  
        return result;
      })
      .catch((err) => {
        dispatch({type: "FETCH_USERS_REJECTED", payload: err});
      });
  };
}

const fetchTaxPros = () => {
  let searchUrl = "/users?role=TaxPro&perPage=all";
  
  return function(dispatch) {
    return base.get(searchUrl)
      .then((response) => {
        let result = { data: response.data };
        dispatch({type: "FETCH_TAXPROS_FULFILLED", payload:  result});

        return result;
      })
      .catch((err) => {
        dispatch({type: "FETCH_TAXPROS_REJECTED", payload: err});

      });
  };
}

const getUsers = (dispatch, searchTerms) => {
  let searchUrl = "/users";
  
  if(searchTerms || currentYearProductId) {
    searchUrl+=searchTermsToString(searchTerms);
  }

  return base.get(searchUrl)
    .then((response) => {
      const usersCount = response.data.count;
      const users = response.data.users;
      console.log('response', response.data, users.length===0 && response.data.count>0);
      if(users.length===0 && usersCount>0) {
        let pageSearchTerm = searchTerms? _.find(searchTerms,(st) => { return st.key==='page' }) : null;
        if(pageSearchTerm) {
          pageSearchTerm.val='1';
        } else if (searchTerms) {
          searchTerms.push({key:'page',val:'1'});
        } else {
          searchTerms = [{key:'page',val:'1'}];
        }
        searchUrl = "/users";
        console.log('searchTerms');
        searchUrl+=searchTermsToString(searchTerms);
        return base.get(searchUrl);
      } else {
        return response;
      }

    })
    .then((response) => {

      let result = { searchTerms: searchTerms, data: response.data };

      dispatch({type: "FETCH_USERS_FULFILLED", payload:  result});

      return result;
    })
    .catch((err) => {
      dispatch({type: "FETCH_USERS_REJECTED", payload: err});
    });
}

const updateSearchTerms = (searchTerms,newSearchTerms) => {
  return function(dispatch) {
    let  newTermResults =  _.cloneDeep(newSearchTerms);
    newTermResults = _.concat(newTermResults,getNewOrderAscendingSearchTerm(searchTerms,newSearchTerms));

    // get old terms that are not in new terms
    let remainingOldTerms = _.filter(searchTerms,(searchTerm) => {
      return !_.some(newTermResults,(nre) => { return  nre.key===searchTerm.key});
    });

    newTermResults = _.concat(newTermResults,remainingOldTerms);

    // remove terms that have removeTerm==true
    newTermResults = _.filter(newTermResults,(newTerm) => {
      return typeof newTerm.removeTerm === 'undefined' || !newTerm.removeTerm;
    });

    dispatch({type:"SEARCH_TERMS_UPDATED",payload:newTermResults});

    fetchUsers(newTermResults)(dispatch);
  } 
}

const clearSearchTerms = () => {
  return function(dispatch) {
    const newTermResults = [];

    dispatch({type:"SEARCH_TERMS_UPDATED",payload:newTermResults});

    fetchUsers(newTermResults)(dispatch);
  } 
}

/// Fetch user details by id
const fetchUser = (id) => {
  return function(dispatch) {
    return getUser(id)
      .then((response) => {
        dispatch( { type: "FETCH_USER_FULFILLED", payload: response.data});

        return response;
      });
  };
};

/// add a user
///TODO: implement
const addUser = (id, text) => {
  return {
    type: 'ADD_USER',
    payload: {
      id,
      text,
    },
  };
};

const getUser = (id) => {
  return  base.get("/users/"+id)
};

/// update a user
/// id: the user's id
/// updateValues : { email:"email",first_name:"new firstname", last_name:"last_name", "phone:"phone", role: "Admin"/"Customer"/"Taxpro" } Only include fields that are to be changed (overwritten)
const updateUser = (id, updatedValues) => {
  // update the user 
  return function(dispatch) {
    dispatch({type: "UPDATE_USER", payload: null });

    return base.put("/users/"+id,updatedValues)
      .then((response) => {
        return getUser(id);
      })
      .then((response) => {
        dispatch( { type: "UPDATE_USER_FULFILLED", payload: response.data });     
      });
  };
};

/// delete the user
/// id: the id of the user to delete. Be careful!
const deleteUser =(id) => {

  return function(dispatch) {
    base.del("/users/"+id)
      .then((response) => {
        dispatch( { type: 'DELETE_USER_FULFILLED', payload: id});
      });
  };
};


/// Help functions

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
  let asString = !searchTerms ? "": searchTerms.map((term) => { return term.key+"="+term.val }).join("&");

  return asString? "?product="+currentYearProductId+"&"+asString: "?product="+currentYearProductId;
};



export {
  fetchUsers,
  fetchTaxPros,
  updateSearchTerms,
  clearSearchTerms,
  fetchUser,
  addUser,
  updateUser,
  deleteUser
}
