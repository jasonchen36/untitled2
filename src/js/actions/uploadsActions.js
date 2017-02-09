import * as base from "./lib/baseActions";
import { downloadFile } from "./lib/directDownloadActions";
import _ from "lodash";

export function directDownloadChecklistItems(quoteId, documentId) {
  let url = '/quote/'+quoteId+'/document/'+documentId;    

  return downloadFile(url);
};

export function deleteDocument(quoteId, documentId) {
  return function(dispatch) {
    let url = '/quote/'+quoteId+'/document/'+documentId;
    return base.del(url)
      .then((response) => {
        dispatch({type:"DELETE_DOCUMENT_FULFILLED",payload:{quoteId:parseInt(quoteId), documentId: parseInt(documentId)}});
      }).catch((err) => {
        dispatch({type:"DELETE_DOCUMENT_REJECTED",payload:err});
      });
  };
};

export function uploadDocument(quoteId, taxReturnId, checklistId, file) {
  return function(dispatch) {
    let url = '/quote/'+quoteId+'/document';

    let postFormData = {
      uploadFileName: file
    };

    // TODO: allow these when they work
    if(typeof taxReturnId !== 'undefined') {
      postFormData.taxReturnId = taxReturnId;
    }

    if(typeof checklistId !== 'undefined') {
      postFormData.checklistItemId = checklistId;
    }

    postFormData.checklistItemId =0;

    return base.postFile(url,postFormData)
      .then((response) => {
        let documentId = response.data.documentId;
        dispatch({type:"UPLOAD_DOCUMENT_FULFILLED",payload:{quoteId:parseInt(quoteId), documentId: parseInt(documentId)}});
      }).catch((err) => {
        dispatch({type:"UPLOAD_DOCUMENT_REJECTED",payload:err});
      });
  };
};

export function viewedDocument(quoteId, documentId, viewed) {
  return function(dispatch) {
    let url = '/admin/quote/' + quoteId + '/document/'+documentId + '/viewed';

    return base.put(url)
      .then((response) => {
        dispatch({type:"DOCUMENT_VIEWED", payload:{quoteId: parseInt(quoteId), documentId: parseInt(documentId), viewed:(parseInt(viewed) === 0 ? 1 : 0) }});
      });
  };
};
