import * as base from "./lib/baseActions";
import { downloadFile } from "./lib/directDownloadActions";
import _ from "lodash";

/// These actions may be outside of redux, as we don't want to save the PDF in memory?
export function fetchUploads(quoteId, documentId) {
  return function(dispatch) {
    let url = '/quote/'+quoteId+'/document/'+documentId;    
    return downloadFile(quoteId)
      .then((response) => {
        dispatch({type:"FETCH_DOWNLOAD_UPLOADS_FULFILLED",payload: response});
      }).catch((err) => {
        dispatch({type:"FETCH_DOWNLOAD_UPLOADS_REJECTED",payload: err});
      });
  };
};

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
        dispatch({type:"DELETE_DOCUMENT_REJECTED",payload:base.cleanErrorObject(err)});
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
