import * as base from "./lib/baseActions";
import _ from "lodash";

/// DISPATCH FUNCTIONS
/// Fetch a list of users, optionally with search Terms
const fetchAccount = (accountId) => {
  return function(dispatch) {
    return getAccount(accountId)
      .then((response) => {
        let result = response.data;
        dispatch({type: "FETCH_ACCOUNT_FULFILLED", payload:  result});
        return result;
      })
      .catch((err) => {
        dispatch({type: "FETCH_ACCOUNT_REJECTED", payload: err});
      });
  };
};

const clearAccount = () => {
  return function(dispatch) {
    dispatch({type:"CLEAR_ACCOUNT",payload:null});
  };
};

const clearTaxReturnUpdate = () => {
  return function(dispatch) {
    dispatch({type:"NEED_TO_UPDATE_TAX_RETURN",payload:null});
  };
};

const fetchAllTaxReturnStatuses = () => {
  return function(dispatch) {
    let url = "/admin/tax_returns/statuses";

    return base.get(url)
      .then((response) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_FULFILLED",payload:response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_REJECTED",payload: err});
      });
  };
};

const fetchChecklist = (id) => {
  return function(dispatch) {
    let url="/quote/"+id+"/checklist";

    dispatch({type: "FETCH_CHECKLIST",payload:null});

    return base.get(url)
      .then((response) => {
        // add quoteId
        if(response && response.data) {
          response.data.quoteId = id;
        }

        dispatch({type: "FETCH_CHECKLIST_FULFILLED",payload:response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_CHECKLIST_REJECTED",payload:err});
      });
  };
};

const clearChecklist = () => {
  return function(dispatch) {
    dispatch({type:"CLEAR_CHECKLIST", payload:null});
  }
};

/// UPDATE FUNCTIONS

const  getAccount = (accountId) => {
  let searchUrl = "/admin/account/"+accountId;
  
  return base.get(searchUrl);
};

const getTaxReturn = (taxReturnId) => {
  const searchUrl = "/tax_return/"+taxReturnId;
  const addressSearchUrl = "/tax_return/"+taxReturnId+"/addresses";

  return Promise.all([base.get(searchUrl), base.get(addressSearchUrl)])
    .then((responses) => {
      const taxResponse = responses[0];

      // only 1 address
      taxResponse.data.address = responses[1].data && responses[1].data.length>0 ? responses[1].data[0] : null ;

      taxResponse.addressResponse = responses[1];
      return taxResponse;
    });
};

const callUpdateTaxProfile = (id,updateValues) => {
  const url = "/tax_return/"+id;

  return base.put(url,updateValues)
    .then((response) => {
      return response;
    });
};

const callUpdateAddress = (id, addressId, updateValues) => {
  let url = "/tax_return/"+id+"/address";

  // if country is blank, set it as null
  updateValues.country = updateValues.country && updateValues.country==='' ? null : updateValues.country;

  let upsertPromise = null;

  if(!updateValues.addressLine1 && !updateValues.city && !updateValues.postalCode && !updateValues.province) {
    // no values, so obviously not updating address.  Skip updating address.
    return Promise.resolve({});
  }

  if(addressId > 0) {
    url+= "/" + addressId;
    upsertPromise = base.put(url, updateValues);
  } else {
    upsertPromise = base.post(url, updateValues)
      .then((result) => {
        addressId = result.data.addressId;
        const linkUrl="/tax_return/"+id+"/address/"+addressId;

        return base.post(linkUrl,{});
      });
  }
  
  return upsertPromise
    .then((response) => {
      return response;
    });
};

/// EXPORTS

export { 
  fetchAccount, 
  clearAccount, 
  clearTaxReturnUpdate, 
  fetchAllTaxReturnStatuses, 
  fetchChecklist, 
  clearChecklist 
};

