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
    return <li key={key}> {error.message} </li>
  });
};

