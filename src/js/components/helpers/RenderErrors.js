import _ from "lodash";
import React from "react";

/// Render pagination
export function renderErrors(errors) {

  if((errors && (Array.isArray(errors) && errors.length===0)) || !errors) {
    return <div></div>
  } else {
    let renderedErrors = renderErrorsArray(errors);

    return (
      <div className="user errors">
        <ul >
          {renderedErrors}
        </ul>
    </div>)
  }
}

const renderErrorsArray = function(errors) {
  if(!Array.isArray(errors)) {
    errors = [errors];
  }
  
  // now handle errors
  return _.map(errors,(error,key) => {
    console.log('e',error);
    if(error && error.message) {

      return <li key={key}> {error.message} </li>
    } else if(error) {
      return <li key={key}> There was an error. If it persists, please contact support.</li>
    }
  });
};

