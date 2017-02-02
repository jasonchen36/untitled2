// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)
import _ from "lodash";

export default function reducer(state={
    account:null,
    taxReturns: null,
    taxReturn: null,
    taxReturnUpdated: false,
    taxReturnStatuses:null,
    quoteChecklist: null,
    searchChanged:false,
    user: null,
    fetching: false,
    fetched: false,
    updating: false,
    updated: false,
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
          taxReturnDetailsFetched: true,
          taxReturnUpdated: false
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
          taxReturnUpdated: false,
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
      case "UPDATING_TAX_RETURN": {
        return {
          ...state,
          updating:true
        }
      }
      case "UPDATE_TAX_RETURN_FULFILLED": {
        return {
          ...state
        };
      }
      case "UPDATE_ADDRESS_FULFILLED": {
        return {
          ...state
        };
      }
      case "UPDATE_TAX_RETURN_REJECTED": {
        return {
          ...state,
          error:action.payload
        };
      }
      case "UPDATE_TAX_RETURN_COMPLETE": {
        return {
          ...state,
          error:null,   
          updating:false,
        taxReturnUpdated:true
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
      case "DELETE_DOCUMENT_FULFILLED": {
        let result = action.payload;
        let checklist = state.quoteChecklist;
        if(checklist.quoteId === result.quoteId) {
          checklist = _.cloneDeep(state.quoteChecklist);
          _.each(checklist.checklistitems,(cli) => {
              cli.documents = _.filter(cli.documents,(doc) => {
                  return doc.documentId!==result.documentId;
              });
          });
          checklist.additionalDocuments = _.filter(checklist.additionalDocuments, (ad) => {
              return ad.documentId !== result.documentId;
          });

        }

        return {
          ...state,
          fetching:false,
          quoteChecklist:checklist
        };

      }
      case "DELETE_DOCUMENT_REJECTED": {
        return {
          ...state,
          error: action.payload
        };
      }
      case "DOCUMENT_VIEWED" : {
        let result = action.payload;
        let checklist = _.cloneDeep(state.quoteChecklist);
        if(checklist.quoteId === result.quoteId) {
          _.each(checklist.checklistitems,(cli) => {
              _.each(cli.documents,(doc) => {
                  if(doc.documentId===result.documentId) {
                    doc.viewedByTaxPro=result.viewed;
                  }
              });
          });
          _.each(checklist.additionalDocuments, (ad) => {
              if(ad.documentId === result.documentId) {
                ad.viewedByTaxPro = result.viewed;
              }
          });
        }

        return {
          ...state,
          fetching:false,
          quoteChecklist:checklist
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
