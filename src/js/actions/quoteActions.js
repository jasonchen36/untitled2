import * as base from "./lib/baseActions";
import _ from "lodash";

/// DISPATCH FUNCTIONS
/// Fetch a list of users, optionally with search Terms
const fetchQuote = (quoteId) => {
  return function(dispatch) {

    const url = "/quote/"+quoteId + "?includeDisabledLineitems=1";

    return base.get(url)
      .then((response) => {
        let result = response.data;
        dispatch({type: "FETCH_QUOTE_FULFILLED", payload:  result});
        return result;
      })
      .catch((err) => {
        dispatch({type: "FETCH_QUOTE_REJECTED", payload: err});
      });
  };
};


const disableQuoteLineItem = (quoteId, quoteLineItemId,enable) => {
  return function(dispatch) {

    const enableUrl = enable === 1 ? "/enabled" : "/disabled";

    const url = "/quote/"+quoteId+"/lineItem/"+quoteLineItemId + enableUrl;

    return base.put(url)
      .then((response) => {
        let result = response.data;
        dispatch({type: "DISABLE_QUOTE_FULFILLED", payload:  result});
        return result;
      })
      .catch((err) => {
        dispatch({type: "DISABLE_QUOTE_REJECTED", payload: err});
      })
      .then((response) => {
          return fetchQuote(quoteId)(dispatch);
      });
  };
};

const addAdminLineItem= (quoteId, adminLineItem) => {
  return function(dispatch) {
    const url = "/quote/"+quoteId+"/adminQuoteLineItem";

    dispatch({type: "ADDING_ADMIN_LINE_ITEM", payload: {}}) 

    return base.post(url, adminLineItem)
      .then((response) => {
        let result = response.data;
        dispatch({type: "ADD_ADMIN_LINE_ITEM_SUCCEEDED", payload:  result}) 
        return result;
      })
      .catch((err) => {
        dispatch({type: "ADD_ADMIN_LINE_ITEM_REJECTED", payload: err});
      })
      .then((response) => {
          return fetchQuote(quoteId)(dispatch);
      })
  };
};

const deleteAdminLineItem= (quoteId, adminQuoteLineItemId) => {
  return function(dispatch) {
    const url = "/quote/"+quoteId+"/adminQuoteLineItem/"+adminQuoteLineItemId;

    return base.del(url)
      .then((response) => {
        let result = response.data;
        dispatch({type: "DELETE_ADMIN_LINE_ITEM_FULFILLED", payload:  result});
        return result;
      })
      .catch((err) => {
        dispatch({type: "DELETE_ADMIN_LINE_ITEM_REJECTED", payload: err});
      })
      .then((response) => {
          return fetchQuote(quoteId)(dispatch);
      });
  };
};

const sendBillToClient = (quoteId) => {
  return function(dispatch) {
    const url = "/admin/quote/" + quoteId + "/sendBillToClient";
    dispatch({type:"SENDING_BILL_TO_CLIENT",payload:{quoteId:quoteId}});

    return base.post(url)
      .then((response) => {
        // This should only be allowed if all tax return statuses are set to 'Data Complete'

        dispatch({type: "SEND_BILL_TO_CLIENT_FULFILLED", payload:response.data});
        return response;
      })
      .catch((err) => {
        // If err status === '
        dispatch({type:"SEND_BILL_TO_CLIENT_REJECTED", payload: err });
      })
      .then((response) => {
        // reget quote
        return fetchQuote(quoteId)(dispatch);
      });
  };
};

/// Calls

/// EXPORTS
export { 
  fetchQuote,
  disableQuoteLineItem,
  addAdminLineItem,
  deleteAdminLineItem,
  sendBillToClient
 };


