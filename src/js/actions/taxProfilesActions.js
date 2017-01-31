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

export function directDownloadTaxProfiles(taxReturnId) {
  let url = '/tax_return/'+taxReturnId+'/tax_profile';   
  // TODO: change this to the correct URL
  url ='/quote/21/checklist/PDF';

  return downloadFile(url);
};

