import * as base from "./lib/baseActions";
import _ from "lodash";
import { fetchUser } from "./usersActions";
import { fetchAccount, fetchTaxReturn, clearAccount, loadAccountIfNeeded } from "./accountsActions";

const loadUserIfNeeded = (userId,account,taxReturns, taxReturn, taxReturnDetailsFetched) => {
 return function(dispatch) {
    return fetchUser(userId)(dispatch)
      .then((result) => {
        if(result && result.data) {
          var user = result.data;
          
          return loadAccountIfNeeded(user, account, taxReturns, taxReturn, taxReturnDetailsFetched)(dispatch);
        }
      });
 };
};

/// EXPORTS
export { 
  loadUserIfNeeded 
};

