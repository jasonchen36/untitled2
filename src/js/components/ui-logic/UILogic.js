
import _ from "lodash";

// TODO: All this logic is currently temporary fixes, and probably means we need to refactor code somwhere

const inPaidState = (stateId) => {
  // TODO: this should be part of state object
  const paidStates = [8,9,10]

  return _.some(paidStates,(ps) => { return ps === stateId } );
}

const taxReturnsInPaidState = (taxReturns) => {
  return _.some(taxReturns, (tx) => {
    const statusId = tx.status ? tx.status.id : tx.status_id;

    return inPaidState(statusId);
  });
}

export { 
inPaidState,
taxReturnsInPaidState
};
