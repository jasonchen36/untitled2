import React from "react"
import _ from "lodash";

import { updateState, initUpdateState, renderUpdateButton } from "../helpers/RenderUpdateButton";

export default class Layout extends React.Component {

  constructor() {
    super();

    this.addLineItem = this.handleAddLineItem.bind(this);
    this.updateState = {value:initUpdateState()};
    this.clickInputChange = this.handleClickInputChange.bind(this);

    this.lineItemDescription = { value:''  };
    this.lineItemRefund = { value:'' };
  }

  componentWillMount() {
  };

  componentWillReceiveProps(nextProps) {

    // TODO: update state flash
    this.updateState.value=updateState(nextProps.updating, nextProps.updated);
  };

  handleAddLineItem(e) {
    e.preventDefault();

    const { quote} = this.props;
    const quoteId = quote.id;
    
    const newLineItem = { text: this.lineItemDescription.value,
      value: this.lineItemRefund.value }

    this.props.addLineItemHandler(quoteId, newLineItem);

    this.lineItemDescription.value='';
    this.lineItemRefund.value='';
  }

  handleClickInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this[name].value = value;

    this.setState({
      value: value
    });
  }

  renderAddLineItem(quote) {
    return <form onSubmit={this.addLineItem}>
        <label for="add-line-item-description">Line Item Description</label>
        <input id="add-line-item-description" type="text"  placeholder="Line Item Description" onChange={this.clickInputChange} value={this.lineItemDescription.value} name="lineItemDescription" />
        <label for="add-line-item-refund">Refund</label>
        <input id="add-line-item-refund" type="number" placeholder="Refund" onChange={this.clickInputChange} value={this.lineItemRefund.value} name="lineItemRefund" />
        { renderUpdateButton(this.updateState,"Add", "Adding", "Added") }
    </form>
  }

  render() {
      //todo, figure out what "No documents added to this package" means
      //todo, pass in data to table
      const { quote, addLineItemHandler } = this.props;
      return  this.renderAddLineItem(quote);
  }
}
