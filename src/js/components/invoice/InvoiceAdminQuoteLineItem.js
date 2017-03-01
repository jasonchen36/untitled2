import React from "react"
import _ from "lodash";

export default class InvoiceAdminQuoteLineItem extends React.Component {

  constructor() {
    super();

    this.deleteLineItem = this.handleDeleteLineItem.bind(this);
  }

  componentWillMount() {
  };

  componentWillReceiveProps(nextProps) {
  };

  handleDeleteLineItem(e) {
    e.preventDefault();

    const { quoteLineItem, taxReturn } = this.props;
    const quoteId = quoteLineItem.quote_id;
    const quoteLineItemId = quoteLineItem.id;

    this.props.deleteLineItemHandler(quoteId, quoteLineItemId);
  }

  deleteButton(){
    if(!this.hasAdminPrivileges()) {
      return <td></td>
    }

    return <td>
      <a class="tax-item-trash-container" onClick={this.deleteLineItem}>
        <div class="tax-item-trash">
          <i class="fa fa-trash-o"></i>
        </div>
      </a>
    </td>
  }

  hasAdminPrivileges() {
    return this.props.hasAdminPrivileges ? true : false;
  }

  renderQuoteList(lineItem,taxReturn) {
      let tRName = taxReturn && taxReturn.first_name ? taxReturn.first_name : "";
      tRName +=  taxReturn && taxReturn.first_name && taxReturn.last_name ? " ": "";
      tRName += taxReturn && taxReturn.last_name ? taxReturn.last_name : "";
      tRName += lineItem && lineItem.text && tRName.length>0 ? " - " : "";
      tRName += lineItem && lineItem.text ? lineItem.text : "";

      return <tr key={lineItem.id}>
        <td>
        </td><td className={lineItem.enabled ? "" : "greyed-out"}> {tRName}
        </td><td className={lineItem.enabled ? "" : "greyed-out"}> {lineItem.value}

        </td>{this.deleteButton()}
        </tr>
  }

  render() {
      //todo, figure out what "No documents added to this package" means
      //todo, pass in data to table
      const { quoteLineItem, taxReturn, deleteLineItemHandler} = this.props;
      return  this.renderQuoteList(quoteLineItem, taxReturn)
  }
}
