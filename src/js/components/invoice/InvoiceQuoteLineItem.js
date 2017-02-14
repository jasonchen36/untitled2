import React from "react"
import _ from "lodash";

export default class InvoiceQuoteLineItem extends React.Component {

  constructor() {
    super();

    this.hideLineItem = this.handleHideLineItem.bind(this);
  }

  componentWillMount() {
  };

  componentWillReceiveProps(nextProps) {
  };

  handleHideLineItem(e) {
    e.preventDefault();

    const { quoteLineItem, taxReturn } = this.props;
    const quoteId = quoteLineItem.quote_id;
    const quoteLineItemId = quoteLineItem.id;

    // toggle
    const enable = quoteLineItem.enabled === 1 ? 0 : 1;
    
    this.props.hideLineHandler(quoteId, quoteLineItemId, enable); 
  }

  getCheckbox(lineItem){
    return <td><input type="checkbox" checked={lineItem.enabled} onChange={this.hideLineItem} /> </td>;
  }

  renderQuoteList(lineItem,taxReturn) {
      let tRName = taxReturn && taxReturn.first_name ? taxReturn.first_name : "";
      tRName +=  taxReturn && taxReturn.first_name && taxReturn.last_name ? " ": "";
      tRName += taxReturn && taxReturn.last_name ? taxReturn.last_name : "";
      tRName += lineItem && lineItem.text && tRName.length>0 ? " - " : "";
      tRName += lineItem && lineItem.text ? lineItem.text : "";

      return <tr key={lineItem.id} className={lineItem.enabled ? "" : "greyed-out"} >
        {this.getCheckbox(lineItem)}
        <td> {tRName} (From Quote)
        </td><td> {lineItem.value}
        </td><td> {!lineItem.original_quote}
        </td>
        </tr>
  }

  render() {
      //todo, figure out what "No documents added to this package" means
      //todo, pass in data to table
      const { quoteLineItem, taxReturn, hideLineHandler} = this.props;
      return  this.renderQuoteList(quoteLineItem, taxReturn)
  }
}
