import _ from "lodash";
import React from "react";

const updateStates = { initialized:0, updating:1, updated:2};

const initUpdateState = () => { return updateStates.initialized; };
/// Render pagination
const renderUpdateButton = (updatedState,baseText,changingText,doneText) => {
    let buttonText = baseText;

    if(updatedState.value===updateStates.updating) {
      buttonText=changingText;
    } else if(updatedState.value===updateStates.updated) {
      buttonText=doneText;
    }

    return <button className={updatedState.value===updateStates.updated ? "flash" : "button"} >{buttonText}</button>
  
};

      // Local updated state, to set the form button text
const updateState =(updating, updated) => {
    let curUpdateState = updateStates.initialised;

    if (updating) {
      curUpdateState = updateStates.updating;
    } else if(!updating && updated) {
      curUpdateState = updateStates.updated;
    } else {
      curUpdateState = updateStates.initialised;
    }

    return curUpdateState;
}


/// EXPORTS
export { 
  updateStates,
  updateState,
  initUpdateState,
  renderUpdateButton,
 };



