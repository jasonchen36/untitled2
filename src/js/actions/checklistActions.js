import * as base from "./lib/baseActions";
import { downloadFile } from "./lib/directDownloadActions";
import _ from "lodash";

/// Dispatch Functions
const fetchAdminChecklist = (quoteId) => {
  return function(dispatch) {
    let url = '/quote/'+quoteId+'/adminChecklist';    
    return base.get(url)
      .then((response) => {
        const payloadData = _.merge(response.data,{quoteId:parseInt(quoteId)});
        dispatch({type:"FETCH_ADMIN_CHECKLIST_FULFILLED",payload: payloadData});
      }).catch((err) => {
        dispatch({type:"FETCH_ADMIN_CHECKLIST_REJECTED",payload: err});
      });
  };
};

const uploadAdminDocument = (quoteId, taxReturnId, checklistId, file) => {
  return function(dispatch) {
    let url = '/quote/'+quoteId+'/document';

    let postFormData = {
      uploadFileName: file
    };
    let documentId = null;
    // TODO: allow these when they work
    if(typeof taxReturnId !== 'undefined') {
      postFormData.taxReturnId = taxReturnId;
    }

    if(typeof checklistId !== 'undefined') {
      postFormData.checklistItemId = checklistId;
    }

    dispatch({type:"UPLOAD_ADMIN_DOCUMENT_UPLOADING",payload:{quoteId:parseInt(quoteId), checklistId: parseInt(checklistId), taxReturnId: parseInt(taxReturnId)}});        

    return base.postFile(url,postFormData)
      .then((response) => {
        let documentId = response.data.documentId;
        dispatch({type:"UPLOAD_DOCUMENT_FULFILLED",payload:{quoteId:parseInt(quoteId), documentId: parseInt(documentId)}});

        return fetchAdminChecklist(quoteId)(dispatch);
      }).then(function(result) {
        dispatch({type:"UPLOAD_DOCUMENT_AND_REFRESH_FULFILLED",payload:{quoteId:parseInt(quoteId), checklistId: parseInt(checklistId), taxReturnId: parseInt(taxReturnId),  documentId: parseInt(documentId)}});        
      }).catch((err) => {
        dispatch({type:"UPLOAD_ADMIN_DOCUMENT_REJECTED",payload:{checklistId:checklistId, taxReturnId: taxReturnId,  error:err}});
      });
  };
};

const directDownloadChecklistPdf = (quoteId) => {
  let url = '/quote/'+quoteId+'/checklist/PDF';
  
  return downloadFile(url);
};

/// EXPORTS
export { 
  fetchAdminChecklist,
  uploadAdminDocument,
  directDownloadChecklistPdf 
};

