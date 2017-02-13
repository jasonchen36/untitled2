import _ from "lodash";
import React from "react";

const updateStates = { initialized:0, updating:1, updated:2};

const initUpdateState = () => { return updateStates.initialized; };
/// Render pagination
const renderUpdateButton = (updatedState, baseText, changingText, doneText, isUpload) => {
  let buttonText = baseText;
  let updatedStateValue = updatedState ? updatedState.value : updateStates.initialized;

  if(updatedStateValue===updateStates.updating) {
    buttonText=changingText;
  } else if(updatedStateValue===updateStates.updated) {
    buttonText=doneText;
  }

  if(isUpload){
      return <button className={updatedStateValue===updateStates.updated ? "flash" : "button button-upload"}>{buttonText}</button>
  } else{
      return <button className={updatedStateValue===updateStates.updated ? "flash" : "button button-save"}>{buttonText}</button>
  }

};

/// Local updated state, to set the form button text
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


