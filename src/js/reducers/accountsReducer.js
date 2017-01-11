// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)

export default function reducer(state={
    account:null,
    taxReturns: null,
    taxReturn: null,
    searchChanged:false,
    user: null,
    fetching: false,
    fetched: false,
    error: null,
  }, action) {
    switch (action.type) {
      // Users events
      case "CLEAR_TAXRETURNS": {
        return {...state, taxReturns:null};
      }
      case "FETCH_TAXRETURNS": {
        return {...state, fetching: true};
      }
      case "FETCH_TAX_RETURN_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_TAX_RETURN_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          taxReturn: action.payload.data
        };
      }
      case "FETCH_ACCOUNT_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_ACCOUNT_FULFILLED": {
        const account = action.payload.data;
        const taxReturns = account.taxReturns;
        const taxReturn = taxReturns && taxReturns.length>0 ? taxReturns[0]:null;
        return {
          ...state,
          fetching: false,
          fetched: true,
          account: action.payload.data,
          taxReturns:taxReturns,
          taxReturn:taxReturn
        };
      }
    }

    return state;
};
