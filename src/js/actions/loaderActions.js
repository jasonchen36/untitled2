import * as base from "./lib/baseActions";
import _ from "lodash";
import { fetchUser } from "./usersActions";
import { fetchAccount, fetchTaxReturn, clearAccount, fetchChecklist, clearChecklist } from "./accountsActions";
import { fetchQuote } from "./quoteActions";
import {fetchAdminChecklist } from "./checklistActions";

const refreshUpdateState = () => {
  return function(dispatch) {
    dispatch({type:"REFRESH_UPDATE_STATE",payload:{}});
  };
};

/// Loader for A User all the way up to the Quote
const loadUserQuote = (userId,defaults) => {
  let results = {};

  return function(dispatch) {
    return loadUser(userId,defaults)(dispatch)
      .then((userResults) => {
        results = _.merge(results, userResults);
        const quoteId = userResults.quoteId;

        if(typeof quoteId !== 'undefined' && quoteId>0) {
          return Promise.all([fetchQuote(quoteId)(dispatch), fetchAdminChecklist(quoteId)(dispatch) ]);
        } else {
          return Promise.resolve([null,null]);
        }
      })
      .then((quoteResults) => {
        return _.merge(results,{quote: quoteResults[0], adminChecklist:quoteResults[1]}); 
      });
  };
};

/// Parent User Loader. 
/// Loads user, and if needed loads accounts as well
/// userId = user id
/// The defaults will attempt to be used to populate state if on reload it's possible
/// defaults = { quoteId:2, taxReturnId:3}
const loadUser = (userId, defaults) => {
  defaults = defaults ? defaults : {};
 
  let results = {};

 return function(dispatch) {
    return fetchUser(userId)(dispatch)
      .then((result) => {
        if(result && result.data && result.data.account_id) {
          results.user = result.data;

          return loadAccount(results.user.account_id, defaults)(dispatch);
        } else {
          return clearAccount()(dispatch);
        }
      })
      .then((accountResult) => {
        results = _.merge(results, accountResult);

        return results;
      });
 };
};

/// Load an account
/// The defaults will attempt to be used to populate state if on reload it's possible
/// defaults = { quoteId:2, taxReturnId:3}
const loadAccount = (accountId,defaults) => {
  defaults = defaults ? defaults : {};

  let account = null;
  let quoteId = null;
  return function(dispatch) {
    return fetchAccount(accountId)(dispatch)
      .then(function(response) {
        account = response;  
        const firstTaxReturn = getAccountTaxReturn(account,defaults.taxReturnId);
        quoteId = getAccountQuoteId(account, defaults.quoteId);

        let accountDetailPromises = [];

        if(firstTaxReturn) {
          accountDetailPromises.push(fetchTaxReturn(firstTaxReturn.id)(dispatch));
        } else {
          accountDetailPromises.push(Promise.resolve(null));
        }

        if(quoteId>0) {
          accountDetailPromises.push(fetchChecklist(quoteId)(dispatch)); 
        } else {
          accountDetailPromises.push(Promise.resolve(null));
          clearChecklist()(dispatch);
        }

        return Promise.all(accountDetailPromises);
      }).then(function(results) {
        // first is taxreturn, second is checklist 

        return { account:account,
          quoteId: quoteId,
          taxReturn:results[0],
          checklist:results[1]
        };
      });
  };
}

const getAccountTaxReturn = (account, taxReturnId)=> {
    if(!account || !account.taxReturns || account.taxReturns.length === 0) {
      return null;
    }

    const foundTaxReturn = _.find(account.taxReturns,(tr) => { return tr.id === taxReturnId })

    if(foundTaxReturn) {
      return foundTaxReturn;

    } else {
      return _.first(account.taxReturns);
    }
};

const getAccountQuoteId = (account, quoteId) => {
  if(!account || !account.quotes || account.quotes.length === 0) {
    return -1;
  }

  const foundQuote = _.find(account.quotes,(quote) => { return quote.id === quoteId; })

  if(foundQuote) {
    return foundQuote.id;
  } else {
    return _.first(account.quotes).id;
  }
}

/// EXPORTS
export { 
  loadUser, 
  loadAccount,
  loadUserQuote,
  refreshUpdateState
};

