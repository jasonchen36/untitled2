import * as base from "./lib/baseActions";
import _ from "lodash";

export function directDownloadChecklistPdf(quoteId) {
    return callDownloadListPdf(quoteId);
};

const callDownloadListPdf =(quoteId)=> {
  let url = '/quote/'+quoteId+'/checklist/PDF';

  return base.getBlob(url)
    .then((response) => {
      return response;
    });
};

