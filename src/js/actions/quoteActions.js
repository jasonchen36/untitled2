import * as base from "./lib/baseActions";
import _ from "lodash";

/// DISPATCH FUNCTIONS
/// Fetch a list of users, optionally with search Terms
const fetchQuote = (quoteId) => {
  return function(dispatch) {
    console.log('quote id', quoteId);

    const url = "/quote/"+quoteId;

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


/// Calls

/// EXPORTS
export { 
  fetchQuote,
 };


