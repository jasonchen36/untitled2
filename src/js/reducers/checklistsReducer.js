// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)
import _ from "lodash";
import { updateListWithObjectById } from "./lib/reducerHelpers";

export default function reducer(state={
    quoteChecklist: null,
    fetching: false,
    fetched: false,
    updating: [],
    updated: [],
    quoteChecklistFetched:false,
    quoteChecklistFetching:false,
    adminChecklist: null,
    adminChecklistFetched:false,
    adminChecklistFetching:false,
    error: null,
  }, action) {
    switch (action.type) {
      case "REFRESH_UPDATE_STATE": {
        return { ...state,
          updating: [],
          updated:[]
        };
      }
      case "CLEAR_ACCOUNT": {
        return {...state, 
          quoteChecklist:null,
          quoteChecklistFetched:false,
          adminChecklist:null,
          updated:false,
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
          adminChecklistFetching:false,
        };
      }
      case "FETCH_CHECKLIST": {
        return {
          ...state,
          quoteChecklistFetching:true
        };
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
      case "UPLOAD_DOCUMENT_FULFILLED": {
        return {
          ...state,
        };
      }
      case "UPLOAD_DOCUMENT_REJECTED": {
        return {
          ...state,
        };
      }
      case "UPLOAD_ADMIN_DOCUMENT_UPLOADING": {
        const { taxReturnId, checklistId } = action.payload;
        let updated = _.filter(state.updated,(u) => { return u.checklistId !== checklistId || u.taxReturnId !== taxReturnId  });
        let updating = _.cloneDeep(state.updating);
        updating.push({checklistId:checklistId, taxReturnId:taxReturnId});

        return {
          ...state,
          updated: updated,
          updating: updating
        };
      }
      case "UPLOAD_DOCUMENT_AND_REFRESH_FULFILLED": {
        const { taxReturnId, checklistId } = action.payload;
        let updating = _.filter(state.updating,(u) => { return u.checklistId !==checklistId || u.taxReturnId !== taxReturnId });
        let updated = _.cloneDeep(state.updated);
        updated.push({checklistId:checklistId, taxReturnId:taxReturnId});
        
        return {
          ...state,
          updating: updating,
          updated: updated
        };
      }
      case "UPLOAD_ADMIN_DOCUMENT_REJECTED": {
        const { taxReturnId, checklistId } = action.payload;
        
        let updating = _.filter(state.updating,(u) => { return u.checklistId !== checklistId || u.taxReturnId !== taxReturnId});
        return {
          ...state,
          error: payload.err,
          updating: updating
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
        let updated = state.updated;

        const quoteId = result.quoteId;
        const documentId = result.documentId;

        updated = onDeleteRemoveChecklistItemFromUpdated(quoteId, documentId, state.quoteChecklist,updated);
        updated = onDeleteRemoveChecklistItemFromUpdated(quoteId, documentId, state.adminChecklist,updated);

        const quoteChecklist = removeChecklistDocument(quoteId, documentId, state.quoteChecklist);
        const adminChecklist = removeChecklistDocument(quoteId, documentId, state.adminChecklist);

        return {
          ...state,
          fetching:false,
          updated:updated,
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

/// remove checklistItem from updated with quoteid and doc with docid
const onDeleteRemoveChecklistItemFromUpdated = (quoteId,documentId,checklist,updated) => {
  let checklistItem = getRemovedChecklistItem(quoteId,documentId,checklist);

  if(checklistItem) {
    let taxReturnId = checklistItem.tax_return_id;
    let checklistId = checklistItem.checklist_item_id;

    updated = _.filter(updated,(u) => { return u.checklistId !== checklistId || u.taxReturnId !== taxReturnId });
  }

  return updated;
};

/// find checklistItem from updated with quoteid and doc with docid
const getRemovedChecklistItem = (quoteId, documentId,checklist) => {
  let checklistItem = null;
  if(checklist.quoteId === quoteId) {
     checklistItem =  _.find(checklist.checklistitems,(cli) => {
        return _.some(cli.documents,(doc) => {
          return doc.documentId !== documentId;
        });
    });
  }

  return checklistItem;
};

const removeChecklistDocument = (quoteId, documentId, checklist) => {
    checklist = _.cloneDeep(checklist);

  if(checklist.quoteId === quoteId) {
    _.each(checklist.checklistitems,(cli) => {
        cli.documents = _.filter(cli.documents,(doc) => {
            return doc.documentId!==documentId;
        });
    });

    if(checklist.additionalDocuments) {
      checklist.additionalDocuments = _.filter(checklist.additionalDocuments, (ad) => {
          return ad.documentId !== documentId;
      });
    }
  
    if(checklist.documents) {
      checklist.documents = _.filter(checklist.documents, (ad) => {
          return ad.documentId !== documentId;
      });
    }
  }

  return checklist;
};
