// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)
import _ from "lodash";

export default function reducer(state={
    account:null,
    taxReturns: null,
    taxReturn: null,
    taxReturnStatuses:null,
    quoteChecklist: null,
    searchChanged:false,
    user: null,
    fetching: false,
    fetched: false,
    updating: false,
    taxReturnDetailsFetched:false,
    quoteChecklistFetched:false,
    quoteChecklistFetching:false,
    quoteChecklistPdf: null,
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
        const newTaxReturns = _.map(state.taxReturns, (tr) => { 
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
          taxReturns: newTaxReturns,
          taxReturnDetailsFetched: true
        };
      }
      case "FETCH_ACCOUNT_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "CLEAR_ACCOUNT": {
        return {...state, 
          account:null, 
          taxReturns:null, 
          taxReturn:null,
          address:null,
          taxReturnDetailsFetched:false, 
          quoteChecklist:null,
          quoteChecklistFetched:false
        };
      }
      case "FETCH_ACCOUNT_FULFILLED": {
          //todo, account variable is not getting saved to state by taxreturns and taxreturn are
        const account = action.payload.data;
        let taxReturns = account.taxReturns;
        let taxReturn = null;
        let taxReturnDetailsFetched = state.taxReturnDetailsFetched;
        if(taxReturns && taxReturns.length>0) {
          taxReturn = state.taxReturn ?  _.find(taxReturns,(tr) => { return tr.id===state.taxReturn.id;}) : taxReturns[0];
          taxReturnDetailsFetched=false;
        }

        return {
          ...state,
          fetching: false,
          fetched: true,
          account: account,
          taxReturns:taxReturns,
          taxReturn:taxReturn,
          taxReturnDetailsFetched: taxReturnDetailsFetched,
          quoteChecklistFetching:false
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
      case "FETCH_CHECKLIST": {
        return {
          ...state,
          quoteChecklistFetching:true
        }
      }
      case "FETCH_CHECKLIST_FULFILLED": {
        return {
          ...state,
          fetching:false,
          quoteChecklist:action.payload.data,
          quoteChecklistFetched:true,
          quoteChecklistFetching:false
        };
      }
      case "FETCH_CHECKLIST_REJECTED": {
        return {
          ...state,
          fetching:false,
          error: action.payload
        };
      }
      case "FETCH_CHECKLIST_PDF_FULFILLED": {
        return {
          ...state,
          fetching:false,
          quoteChecklistPdf: action.payload.data
        };
      }
      case "FETCH_CHECKLIST_PDF_REJECTED": {
        return {
          ...state,
          fetching:false,
          error:action.payload
        };
      }
    }

    return state;
};
