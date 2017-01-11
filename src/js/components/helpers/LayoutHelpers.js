import React from "react";

import _ from "lodash";

// common layout tasks
export function renderTaxProSelection(taxPros, user) {
    var defaultSelection = <option key={-1} disabled defaultValue>TaxPros</option>;
    if(!taxPros) {
        return defaultSelection;
    } else {
        if (!user){
            defaultSelection = <option key={-1} disabled defaultValue>TaxPros</option>;
            user = {
                assigned_tax_pro: ''
            }
        }
        const renderedTaxPros = taxPros.map((taxPro) => {
            return (
                <option key={taxPro.id} defaultValue={taxPro.id===user.assigned_tax_pro}>
                    {taxPro.first_name}{ taxPro.last_name ? ' ' + taxPro.last_name : ''}
                </option>
            );
        });
        return _.concat([defaultSelection], renderedTaxPros);
    }
}