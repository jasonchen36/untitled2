import * as base from "./lib/baseActions";
import { downloadFile } from "./lib/directDownloadActions";
import _ from "lodash";

/// These actions may be outside of redux, as we don't want to save the PDF in memory?
export function fetchChecklistPdf(quoteId) {
  return function(dispatch) {
    return callDownloadListPdf(quoteId)
      .then((response) => {
        dispatch({type:"FETCH_CHECKLIST_PDF_FULFILLED",payload: response});
      }).catch((err) => {
        dispatch({type:"FETCH_CHECKLIST_PDF_REJECTED",payload: err});
      });
  };
};

export function directDownloadChecklistPdf(quoteId) {
  let url = '/quote/'+quoteId+'/checklist/PDF';
  
  return downloadFile(url);
};
