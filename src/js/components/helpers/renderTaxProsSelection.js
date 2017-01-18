import { renderSelectionOptions } from "../helpers/LayoutHelpers";

// common layout tasks
export function renderTaxProSelectionOptions(taxPros) {

  var defaultText = 'Tax Pros';
  var list = [];
  if(taxPros) {
    list = taxPros.map((taxPro) => {
      return { id:taxPro.id, 
        val: (taxPro.first_name + (taxPro.last_name ? ' ' + taxPro.last_name: '')) 
      };
    });
  }

  return renderSelectionOptions(list,defaultText);
};
