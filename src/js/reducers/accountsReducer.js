// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)

import _ from "lodash";

export default function reducer(state={
    account:null,
    taxReturns: null,
    taxReturn: null,
    taxReturnStatuses:null,
    searchChanged:false,
    user: null,
    fetching: false,
    fetched: false,
    updating: false,
    error: null,
  }, action) {
    switch (action.type) {
      // Users events
      case "CLEAR_TAXRETURNS": {
        return {...state, taxReturns:null};
      }
      case "FETCH_TAXRETURNS": {
        return {...state, fetching: true};
      }
      case "FETCH_TAX_RETURN_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_TAX_RETURN_FULFILLED": {
        const taxReturn = action.payload.data;
        const newTaxReturns = _.map(state.taxReturns,(tr) => { 
          if(tr.id === taxReturn.id) {
            return taxReturn;
          } else {
            return tr;
          }
        });

        return {
          ...state,
          fetching: false,
          fetched: true,
          taxReturn: taxReturn,
          taxReturns: newTaxReturns
        };
      }
      case "FETCH_ACCOUNT_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_ACCOUNT_FULFILLED": {
          //todo, account variable is not getting saved to state by taxreturns and taxreturn are
        const account = action.payload.data;
        const taxReturns = account.taxReturns;
        const taxReturn = taxReturns && taxReturns.length>0 ? taxReturns[0]:null;
        return {
          ...state,
          fetching: false,
          fetched: true,
          account: account,
          taxReturns:taxReturns,
          taxReturn:taxReturn
        };
      }
      case "FETCH_ALL_TAX_RETURN_STATUSES_FULFILLED": {
        return {
          ...state,
          fetching:false,
          taxReturnStatuses: action.payload.data
        };
      }
      case "FETCH_ALL_TAX_RETURN_STATUSES_REJECTED": {
        return {
          ...state,
          fetching:false,
          error:action.payload
        };
      }
      case "UPDATE_TAX_RETURN_FULFILLED": {
        return {
          ...state,
          updating:false
        };
      }
    }

    return state;
};
