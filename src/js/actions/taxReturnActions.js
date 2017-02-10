import * as base from "./lib/baseActions";
import _ from "lodash";

/// DISPATCH FUNCTIONS
/// Fetch a list of users, optionally with search Terms
const fetchTaxReturn = (taxReturnId) => {
  return function(dispatch) {
    return getTaxReturn(taxReturnId)
      .then((response) => {
        dispatch({type: "FETCH_TAX_RETURN_FULFILLED", payload: response});

        return response;
      })
      .catch((err) => {
        return dispatch({type: "FETCH_TAX_RETURN_REJECTED", payload: err}); 
      });
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


/// update tax return & addresses
const updateTaxProfile = (id, updateValues, addressId, updateAddressValues) => {
  id = parseInt(id);
  addressId = parseInt(addressId);
  return function(dispatch) {
    dispatch({type:"UPDATING_TAX_RETURN", payload:{id:id}});

    const updateTaxProfilePromise = callUpdateTaxProfile(id, updateValues)
      .then((result) => {   
        dispatch({type: "UPDATE_TAX_RETURN_PROFILE_FULFILLED", payload: result});
      })
      .catch((err) => {
        dispatch({type: "UPDATE_TAX_RETURN_PROFILE_REJECTED", payload: err});
        return Promise.reject(err);
      });

    const updateAddressPromise = callUpdateAddress(id, addressId, updateAddressValues)
      .then((result) => {
        dispatch({type: "UPDATE_ADDRESS_FULFILLED", payload: result});
      })
      .catch((err) => {
        dispatch({type: "UPDATE_ADDRESS_REJECTED", payload: err});
        return Promise.reject(err);
      });
      
    return Promise.all([updateTaxProfilePromise, updateAddressPromise])
      .then(function(responses) {
        return getTaxReturn(id);
      })
      .then(function(result) {
        dispatch({type:"UPDATE_TAX_RETURN_FULFILLED",payload:result});
      }).catch(function(err) {
        dispatch({type:"UPDATE_TAX_RETURN_REJECTED", payload:{id:id, error:err}});
      });
  };
};

/// update tax return
const updateTaxReturn = (id, updateValues) => {
  id = parseInt(id);
  return function(dispatch) {
    dispatch({type:"UPDATING_TAX_RETURN", payload:{id:id}});

    return callUpdateTaxProfile(id, updateValues)
      .then(function(responses) {
        dispatch({type: "UPDATE_TAX_RETURN_PROFILE_FULFILLED", payload: responses});
        return getTaxReturn(id);
      })
      .catch((err) => {
        dispatch({type: "UPDATE_TAX_RETURN_PROFILE_REJECTED", payload: err});
        return Promise.reject(err);
      })
      .then(function(result) {
        dispatch({type:"UPDATE_TAX_RETURN_FULFILLED",payload:result});
      }).catch(function(err) {
        dispatch({type:"UPDATE_TAX_RETURN_REJECTED", payload:{id:id,error:err}});
      });
  };
};

/// Tax Return status
/// { status_id: 3, return_value: 50, details: 'text'  }
const updateTaxReturnStatus = (taxReturnId, body) => {
  return function(dispatch) {
    
      return Promise.resolve({})
       .catch((err) => {
        dispatch({type: "UPDATE_TAX_RETURN_STATUS_REJECTED", payload: err});
      })
      .then((response) => {
        let result = response.data;

        // get the updated tax Return
        return fetchTaxReturn(taxReturnId)(dispatch);
      }).then((result)=> {
        dispatch({type: "UPDATE_TAX_RETURN_STATUS_FULFILLED", payload:  result});

        return result;
      });
  };
};

/// UPDATE FUNCTIONS

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
  fetchTaxReturn, 
  clearTaxReturnUpdate, 
  fetchAllTaxReturnStatuses, 
  updateTaxProfile,
  updateTaxReturn,
  updateTaxReturnStatus
};

