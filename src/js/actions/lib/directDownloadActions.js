import * as base from "./baseActions";
import _ from "lodash";

/// direct download of a file
const downloadFile = (url) => {
  return base.getBlob(url)
    .then((response) => {
      return response;
    });

};

export { downloadFile };
