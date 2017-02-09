import * as base from "./lib/baseActions";
import { downloadFile } from "./lib/directDownloadActions";
import _ from "lodash";

/// Dispatch Functions
const fetchAdminChecklist = (quoteId) => {
  return function(dispatch) {
    let url = '/quote/'+quoteId+'/adminChecklist';    
    return base.get(url)
      .then((response) => {
        const payloadData = _.merge(response.data,{quoteId:quoteId});
        dispatch({type:"FETCH_ADMIN_CHECKLIST_FULFILLED",payload: payloadData});
      }).catch((err) => {
        dispatch({type:"FETCH_ADMIN_CHECKLIST_REJECTED",payload: err});
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
  directDownloadChecklistPdf 
};

