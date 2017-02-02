import * as base from "./lib/baseActions";
import _ from "lodash";

/// Fetch a list of users, optionally with search Terms
export function fetchAccount(accountId) {
  return function(dispatch) {
      getAccount(dispatch, accountId);
  };
}

const  getAccount = (dispatch, accountId) => {
  let searchUrl = "/account/"+accountId;
  
  base.get(searchUrl)
    .then((response) => {
      let result = response;
      dispatch({type: "FETCH_ACCOUNT_FULFILLED", payload:  result});
    })
    .catch((err) => {
      dispatch({type: "FETCH_ACCOUNT_REJECTED", payload: base.cleanErrorObject(err)});
    });
}

export function clearAccount() {
  return function(dispatch) {
    dispatch({type:"CLEAR_ACCOUNT",payload:null});
  };
}

export function fetchTaxReturn(taxReturnId) {
  return function(dispatch) {
    getTaxReturn(dispatch, taxReturnId);
  };
}

export function clearTaxReturnUpdate() {
  return function(dispatch) {
      dispatch({type:"NEED_TO_UPDATE_TAX_RETURN",payload:null});
  }
}

const getTaxReturn = (dispatch, taxReturnId) => {
  const searchUrl = "/tax_return/"+taxReturnId;
  const addressSearchUrl = "/tax_return/"+taxReturnId+"/addresses";

  return Promise.all([base.get(searchUrl), base.get(addressSearchUrl)])
    .then((responses) => {
      const taxResponse = responses[0];

      // only 1 address
      taxResponse.data.address = responses[1].data && responses[1].data.length>0 ? responses[1].data[0] : null ;

      taxResponse.addressResponse = responses[1];
      return dispatch({type: "FETCH_TAX_RETURN_FULFILLED", payload: taxResponse});
      
    })
    .catch((err) => {
      return dispatch({type: "FETCH_TAX_RETURN_REJECTED", payload: base.cleanErrorObject(err)});
    });
};

export function fetchAllTaxReturnStatuses() {
  return function(dispatch) {
    let url = "/admin/tax_returns/statuses";

    base.get(url)
      .then((response) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_FULFILLED",payload:response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_REJECTED",payload: base.cleanErrorObject(err)});
      });
  };
}

export function updateTaxProfile(id, updateValues, addressId, updateAddressValues) {
  return function(dispatch) {
      dispatch({type:"UPDATING_TAX_RETURN", payload:null});

    const updateTaxProfilePromise = callUpdateTaxProfile(dispatch, id, updateValues);
    const updateAddressPromise = callUpdateAddress(dispatch, id, addressId, updateAddressValues);

    return Promise.all([updateTaxProfilePromise, updateAddressPromise])
      .then(function(responses) {
        return getTaxReturn(dispatch, id);
      })
      .then(function(responses) {
        dispatch({type:"UPDATE_TAX_RETURN_COMPLETE",payload:responses});
      }).catch(function(err) {
        dispatch({type:"UPDATE_TAX_RETURN_REJECTED", payload:base.cleanErrorObject(err)});
      });
  };
}

export function fetchChecklist(id) {
  return function(dispatch) {
    let url="/quote/"+id+"/checklist";

    dispatch({type: "FETCH_CHECKLIST",payload:null});

    base.get(url)
      .then((response) => {
        // add quoteId
        if(response && response.data) {
          response.data.quoteId = id;
        }

        dispatch({type: "FETCH_CHECKLIST_FULFILLED",payload:response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_CHECKLIST_REJECTED",payload:base.cleanErrorObject(err)});
      });
  };
}

export function clearChecklist() {
  return function(dispatch) {
    dispatch({type:"CLEAR_CHECKLIST", payload:null});
  }
}

const callUpdateTaxProfile = (dispatch,id,updateValues) => {
  const url = "/tax_return/"+id;

  return base.put(url,updateValues)
    .then((response) => {
      dispatch({type: "UPDATE_TAX_RETURN_FULFILLED", payload: response});

      return response;
    });
};

const callUpdateAddress = (dispatch, id, addressId, updateValues) => {
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
      dispatch({type: "UPDATE_ADDRESS_FULFILLED", payload: response});

      return response;
    });
};


