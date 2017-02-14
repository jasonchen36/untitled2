import React from "react"
import { IndexLink, Link } from "react-router";

import { createLoginuser } from "../../actions/loginuserActions"
import { renderErrors } from "../helpers/RenderErrors";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";
import { renderSelectionOptions } from "../helpers/LayoutHelpers";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.selected = this.handleSelected.bind(this);
    this.selectedVal = {value:null};
  }

  componentWillReceiveProps(nextProps) {
  };

  handleSelected(e) {
    const selected =  e.target.value;
    this.props.onChosenHandler(selected);    
  }

  renderItems(checklist, chosenValue, defaultTextValue) {
    var parsedChecklist = _.map(checklist, (c) => {
      return { 
        id: c.checklist_item_id,
        val: c.name
      };
    });

    return <select class="col" onChange={this.selected} value={chosenValue}>
      { renderSelectionOptions(parsedChecklist,defaultTextValue)}
    </select>
  };


  render() {
    const { errors, checklist,chosenValue,defaultTextValue, onChosenHandler } = this.props;
    
    // functions
    // this.props.uploadItemFunction

    return ( <div>
      { this.renderItems(checklist, chosenValue, defaultTextValue) }
      </div>
    );
  };
}

