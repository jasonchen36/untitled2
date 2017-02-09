// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)
import _ from "lodash";
import { updateListWithObjectById } from "./lib/reducerHelpers";

export default function reducer(state={
    quoteChecklist: null,
    fetching: false,
    fetched: false,
    updating: false,
    updated: false,
    quoteChecklistFetched:false,
    quoteChecklistFetching:false,
    adminChecklist: null,
    adminChecklistFetched:false,
    adminChecklistFetching:false,
    error: null,
  }, action) {
    switch (action.type) {
      case "CLEAR_ACCOUNT": {
        return {...state, 
          quoteChecklist:null,
          quoteChecklistFetched:false,
          adminChecklist:null,
          adminChecklistFetched:false,
        };
      }
      case "FETCH_ACCOUNT_FULFILLED": {
          //todo, account variable is not getting saved to state by taxreturns and taxreturn are
        const account = action.payload;
        const quoteChecklist = state.quoteChecklist && _.some(account.quotes,(quote) => { return quote.id === state.quoteChecklist.quoteId; }) ? state.quoteChecklist : null;
        const adminChecklist = state.adminChecklist && _.some(account.quotes,(quote) => { return quote.id === state.adminChecklist.quoteId; }) ? state.quoteChecklist : null;

        return {
          ...state,
          fetching: false,
          fetched: true,
          quoteChecklist: quoteChecklist,
          adminChecklist: adminChecklist,
          quoteChecklistFetching:false,
          adminChecklistFetching:false
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
      case "CLEAR_CHECKLIST": {
        return {
          ...state,
          quoteChecklist: null
        };
      }
      case "DELETE_DOCUMENT_FULFILLED": {
        let result = action.payload;
        let checklist = state.quoteChecklist;
        const quoteChecklist = removeChecklistDocument(result, state.quoteChecklist);
        const adminChecklist = removeChecklistDocument(result, state.adminChecklist);

        return {
          ...state,
          fetching:false,
          quoteChecklist:quoteChecklist,
          adminChecklist:adminChecklist
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
      case "FETCH_ADMIN_CHECKLIST_FULFILLED": {
        return {
          ...state,
          fetching:false,
          adminChecklist: action.payload
        };
      }
      case "FETCH_ADMIN_CHECKLIST_REJECTED": {
        return {
          ...state,
          fetching:false,
          error:action.payload
        };
      }
    }

    return state;
};

const removeChecklistDocument = (result, checklist) => {
    checklist = _.cloneDeep(checklist);
  
  if(checklist.quoteId === result.quoteId) {
    _.each(checklist.checklistitems,(cli) => {
        cli.documents = _.filter(cli.documents,(doc) => {
            return doc.documentId!==result.documentId;
        });
    });

    if(checklist.additionalDocuments) {
      checklist.additionalDocuments = _.filter(checklist.additionalDocuments, (ad) => {
          return ad.documentId !== result.documentId;
      });
    }
  
    if(checklist.documents) {
      checklist.documents = _.filter(checklist.documents, (ad) => {
          return ad.documentId !== result.documentId;
      });
    }
  }

  return checklist;
};
