import React from "react";

import _ from "lodash";

// common layout tasks
export function renderSelectionOptions(list, defaultText) {
    var defaultSelection = <option key={-1} value={-1}>{defaultText}</option>;
    if(!list) {
        return defaultSelection;
    } else {
        const renderedList = list.map((item) => {
            return <option key={item.id} value={item.id} >
                     {item.val}
                 </option>
        });
        return _.concat([defaultSelection], renderedList);
    }
}
