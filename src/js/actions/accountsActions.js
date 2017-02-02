import * as base from "./lib/baseActions";
import _ from "lodash";

/// Fetch a list of users, optionally with search Terms
export function fetchAccount(accountId) {
  return function(dispatch) {
    getAccount(accountId)
      .then((response) => {
        let result = response;
        dispatch({type: "FETCH_ACCOUNT_FULFILLED", payload:  result});
      })
      .catch((err) => {
        dispatch({type: "FETCH_ACCOUNT_REJECTED", payload: err});
      });
  };
}

const  getAccount = (accountId) => {
  let searchUrl = "/account/"+accountId;
  
  return base.get(searchUrl)
};

export function clearAccount() {
  return function(dispatch) {
    dispatch({type:"CLEAR_ACCOUNT",payload:null});
  };
}

export function fetchTaxReturn(taxReturnId) {
  return function(dispatch) {
    return getTaxReturn(taxReturnId)
      .then((response) => {
        dispatch({type: "FETCH_TAX_RETURN_FULFILLED", payload: response});
      })
      .catch((err) => {
        return dispatch({type: "FETCH_TAX_RETURN_REJECTED", payload: err}); 
      });
  };
}

export function clearTaxReturnUpdate() {
  return function(dispatch) {
      dispatch({type:"NEED_TO_UPDATE_TAX_RETURN",payload:null});
  }
}

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

export function fetchAllTaxReturnStatuses() {
  return function(dispatch) {
    let url = "/admin/tax_returns/statuses";

    base.get(url)
      .then((response) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_FULFILLED",payload:response});
      })
      .catch((err) => {
        dispatch({type: "FETCH_ALL_TAX_RETURN_STATUSES_REJECTED",payload: err});
      });
  };
}

export function updateTaxProfile(id, updateValues, addressId, updateAddressValues) {
  return function(dispatch) {
      dispatch({type:"UPDATING_TAX_RETURN", payload:null});

    const updateTaxProfilePromise = callUpdateTaxProfile(id, updateValues)
      .then((result) => {   
        dispatch({type: "UPDATE_TAX_RETURN_PROFILE_FULFILLED", payload: response});
      })
      .catch((err) => {
        dispatch({type: "UPDATE_TAX_RETURN_PROFILE_REJECTED", payload: err});
        return Promise.reject(err);
      });

    const updateAddressPromise = callUpdateAddress(id, addressId, updateAddressValues)
      .then((result) => {
        dispatch({type: "UPDATE_ADDRESS_FULFILLED", payload: response});
      })
      .catch((err) => {
        dispatch({type: "UPDATE_ADDRESS_REJECTED", payload: err});
        return Promise.reject(err);
      });
      
    return Promise.all([updateTaxProfilePromise, updateAddressPromise])
      .then(function(responses) {
        return getTaxReturn(id);
      })
      .then(function(response) {
        dispatch({type:"UPDATE_TAX_RETURN_FULFILLED",payload:response});
      }).catch(function(err) {
        dispatch({type:"UPDATE_TAX_RETURN_REJECTED", payload:err});
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
        dispatch({type: "FETCH_CHECKLIST_REJECTED",payload:err});
      });
  };
}

export function clearChecklist() {
  return function(dispatch) {
    dispatch({type:"CLEAR_CHECKLIST", payload:null});
  }
}

export function loadAccountIfNeeded(user, account, taxReturns, taxReturn, taxReturnDetailsFetched) {
    let results = {
        user, 
        account,
        taxReturn,
        taxReturns,
        taxReturnDetailsFetched
    };

    // current user
    // current account
    // current taxReturns
    // current taxReturn
    // taxReturnDetailsFetched


    // If no user loaded, get account Id

    // if account Id is not same as account or no account, get account.


    // once got account, get tax returns
      // if current tax return is still in tax returns, keep it selected.
      // otherwise, take first tax return

    // if tax Return exists, but don't have details, fetch tax return details
};

/// REQUIRES PROPS: taxReturns, taxReturn, account, taxReturnDetailsFetched
//const loadAccountIfNeeded =(nextProps, currentProps) => {
//  if(nextProps.user && !nextProps.user.account_id) {
//  // no accountId, clear account
//  // TODO: should be in middleware for all accounts
//    if(nextProps.account
//      || nextProps.taxReturns
//      || nextProps.taxReturn) {
//      currentProps.dispatch(clearAccount());
//    }
// 
//    return;
//  } else {  
//    if(nextProps.user && nextProps.user.account_id 
//      && (!nextProps.account 
//        || nextProps.account.accountId!=nextProps.user.account_id)) {
//      // if has user and account id but no account loaded or different account loaded
//      currentProps.dispatch(fetchAccount(nextProps.user.account_id));
//    }
// 
//    if(nextProps.taxReturns && nextProps.taxReturns.length>0 && 
//      (!nextProps.taxReturn || !nextProps.taxReturnDetailsFetched )) {
//      //new tax return loaded, reload tax return
//      currentProps.dispatch(fetchTaxReturn(nextProps.taxReturns[0].id));
//    }
//  }
//};


// REQUIRES PROPS: quoteChecklistFetched, quoteChecklistFetching, account, quoteChecklist
//const loadChecklistIfNeeded =(nextProps, currentProps) => {
//  let quoteId = nextProps.account && nextProps.account.quotes && nextProps.account.quotes.length>0 ? nextProps.account.quotes[0].id : -1;
//
//    if(quoteId>0 && (
//      (!nextProps.quoteChecklistFetched && !nextProps.quoteChecklistFetching) ||
//      (nextProps.quoteChecklistFetched && nextProps.quoteChecklist && nextProps.quoteChecklist.quoteId!==quoteId))) {
//        currentProps.dispatch(fetchChecklist(quoteId));
//    } else {
//    }
//};

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


