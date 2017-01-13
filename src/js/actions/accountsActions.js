/// Actions for viewing and managing users

import * as base from "./baseActions";
import _ from "lodash";

/// Fetch a list of users, optionally with search Terms
export function fetchAccount(accountId) {
  return function(dispatch) {
      getAccount(dispatch, accountId);
  };
}

const  getAccount = (dispatch, accountId) => {
  let searchUrl = "/account/"+accountId;
  
  base.get(searchUrl)
    .then((response) => {
      let result = response;
      dispatch({type: "FETCH_ACCOUNT_FULFILLED", payload:  result});
    })
    .catch((err) => {
      dispatch({type: "FETCH_ACCOUNT_REJECTED", payload: err});
    });
}

export function fetchTaxReturn(taxReturnId) {
  return function(dispatch) {
    let searchUrl = "/tax_return/"+taxReturnId;

    base.get(searchUrl)
      .then((response) => {
        dispatch({type: "FETCH_TAX_RETURN_FULFILLED", payload: response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_TAX_RETURN_REJECTED", payload: err});
      });
  };
}

export function fetchAllTaxReturnStatuses() {
  return function(dispatch) {
    let url = "/admin/tax_returns/statuses";

    base.get(url)
      .then((response) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_FULFILLED",payload:response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_REJECTED",payload:err});
      });
  };
}

