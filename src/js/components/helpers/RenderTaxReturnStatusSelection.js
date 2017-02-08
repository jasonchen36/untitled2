import { renderSelectionOptions } from "../helpers/LayoutHelpers";

// common layout tasks
export function renderTaxReturnStatusSelectionOptions(statuses) {
  var defaultText = 'All Tax Return Statuses';
  var list = [];

  if(statuses) {
    list = statuses.map((status) => {
      return { id:status.id, 
        val: status.name 
      };
    });
  }

  return renderSelectionOptions(list,defaultText);
};
