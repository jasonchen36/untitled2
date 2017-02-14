// TODO: Move this to action on loading of a user. (get account and other info)
import { fetchAccount, clearAccount, fetchChecklist } from "../../actions/accountsActions";
import { fetchTaxReturn } from "../../actions/taxReturnActions";

/// REQUIRES PROPS: taxReturns, taxReturn, account, taxReturnDetailsFetched
export function loadAccountIfNeeded(nextProps, currentProps) {
  if(nextProps.user && !nextProps.user.account_id) {
  // no accountId, clear account
  // TODO: should be in middleware for all accounts
    if(nextProps.account
      || nextProps.taxReturns
      || nextProps.taxReturn) {
      currentProps.dispatch(clearAccount());
    }
 
    return;
  } else {  
    if(nextProps.user && nextProps.user.account_id 
      && (!nextProps.account 
        || nextProps.account.accountId!=nextProps.user.account_id)) {
      // if has user and account id but no account loaded or different account loaded
      currentProps.dispatch(fetchAccount(nextProps.user.account_id));
    }
 
    if(nextProps.taxReturns && nextProps.taxReturns.length>0 && 
      (!nextProps.taxReturn || !nextProps.taxReturnDetailsFetched )) {
      //new tax return loaded, reload tax return
      currentProps.dispatch(fetchTaxReturn(nextProps.taxReturns[0].id));
    }
  }
};


// REQUIRES PROPS: quoteChecklistFetched, quoteChecklistFetching, account, quoteChecklist
export function loadChecklistIfNeeded(nextProps, currentProps) {
  let quoteId = nextProps.account && nextProps.account.quotes && nextProps.account.quotes.length>0 ? nextProps.account.quotes[0].id : -1;

    if(quoteId>0 && (
      (!nextProps.quoteChecklistFetched && !nextProps.quoteChecklistFetching) ||
      (nextProps.quoteChecklistFetched && nextProps.quoteChecklist && nextProps.quoteChecklist.quoteId!==quoteId))) {
        currentProps.dispatch(fetchChecklist(quoteId));
    } else {
    }
};
