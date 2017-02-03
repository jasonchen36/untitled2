import * as base from "./lib/baseActions";
import _ from "lodash";
import { fetchUser } from "./usersActions";
import { fetchAccount, fetchTaxReturn, clearAccount, fetchChecklist, clearChecklist } from "./accountsActions";


/// Parent User Loader. 
/// Loads user, and if needed loads accounts as well
/// userId = user id
/// The defaults will attempt to be used to populate state if on reload it's possible
/// defaults = { quoteId:2, taxReturnId:3}
const loadUser = (userId, defaults) => {
  defaults = defaults ? defaults : {};
 
  let user= null;

 return function(dispatch) {
    return fetchUser(userId)(dispatch)
      .then((result) => {
        if(result && result.data && result.data.account_id) {
          user = result.data;

          return loadAccount(user.account_id, defaults)(dispatch);
        } else {
          return clearAccount()(dispatch);
        }
      });
 };
};

/// Load an account
/// The defaults will attempt to be used to populate state if on reload it's possible
/// defaults = { quoteId:2, taxReturnId:3}
const loadAccount = (accountId,defaults) => {
  defaults = defaults ? defaults : {};

  let account = null;
  return function(dispatch) {
    return fetchAccount(accountId)(dispatch)
      .then(function(response) {
        account = response;   
        const firstTaxReturn = getAccountTaxReturn(account,defaults.taxReturnId);
        const quoteId = getAccountQuoteId(account, defaults.quoteId);

        let accountDetailPromises = [];

        if(firstTaxReturn) {
          accountDetailPromises.push(fetchTaxReturn(firstTaxReturn.id)(dispatch));
        }

        if(quoteId>0) {
          accountDetailPromises.push(fetchChecklist(quoteId)(dispatch)); 
        } else {
          clearChecklist()(dispatch);
        }

        return Promise.all(accountDetailPromises);
      });
  };
}

const getAccountTaxReturn = (account, taxReturnId)=> {
    if(!account.taxReturns || account.taxReturns.length === 0) {
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
  if(!account.quotes || account.quotes.length === 0) {
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
  loadAccount
};

