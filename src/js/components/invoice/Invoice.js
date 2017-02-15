import React from "react"
import _ from "lodash";

import { connect } from "react-redux"
import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { renderErrors } from "../helpers/RenderErrors";

import { loadUser, loadUserQuote, refreshUpdateState } from "../../actions/loaderActions";
import InvoiceQuoteLineItem from "./InvoiceQuoteLineItem";
import InvoiceAdminQuoteLineItem from "./InvoiceAdminQuoteLineItem";
import InvoiceAddAdminQuoteLineItem from "./InvoiceAddAdminQuoteLineItem";
import InvoiceSendBillToClient from "./InvoiceSendBillToClient";

import { disableQuoteLineItem, addAdminLineItem, deleteAdminLineItem, sendBillToClient } from "../../actions/quoteActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        quotes:store.quotes.quotes,
        quoteUpdating:store.quotes.updating,
        quoteUpdated: store.quotes.updated,
        billError: store.quotes.billError,
        billSending: store.quotes.billSending,
        billSent: store.quotes.billSent,
        errors: store.quotes.error
    };
})

export default class Invoice extends React.Component {

    constructor() {
        super();
        this.hideLineItem = this.handleHideLineItem.bind(this);
        this.deleteAdminLineItem = this.handleDeleteAdminLineItem.bind(this);
        this.addAdminLineItem = this.handleAddAdminLineItem.bind(this);
        this.sendBillToClient = this.handleSendBillToClient.bind(this);
    }

    componentWillMount() {
      const userId = this.props.params.userId;
      this.props.dispatch(refreshUpdateState());
      this.props.dispatch(loadUserQuote(userId));
    };

    componentWillReceiveProps(nextProps) {
    };

    getTotalBillingAmount(quote){
      if(!quote) {
        return <tbody><tr><td>
          Loading Totals
        </td></tr></tbody>

      }
      
      return <tbody> 
          <tr>
            <td>Subtotal
            </td>
            <td> ${ quote.subtotal }
            </td>
            </tr>
          <tr>
            <td>Tax
            </td>
            <td> ${ quote.tax }
            </td>
            </tr>
          <tr>
            <td>Total
            </td>
            <td> ${ quote.total }
            </td>
            </tr>
      </tbody>
    }

    handleHideLineItem(quoteId, quoteLineItemId, enable) {
      this.props.dispatch(disableQuoteLineItem(quoteId, quoteLineItemId, enable));
    }

    handleDeleteAdminLineItem(quoteId, quoteLineItemId) {
      this.props.dispatch(deleteAdminLineItem(quoteId, quoteLineItemId));
    }

    handleAddAdminLineItem(quoteId,newLineItem) {
      this.props.dispatch(addAdminLineItem(quoteId,newLineItem));
    }

    handleSendBillToClient(quoteId) {
      this.props.dispatch(sendBillToClient(quoteId));
    }

    renderQuoteList(quote,taxReturns) {
      if(!quote) {
        return <div>
          Loading quote
        </div>
      }

      const quoteLineItems = _.map(quote.quoteLineItems, (li) => {
        const taxReturn = _.find(taxReturns,(tr) => {
            return tr.id === li.tax_return_id;
        });

        return <InvoiceQuoteLineItem key={li.id} quoteLineItem={li} taxReturn={taxReturn} hideLineHandler={this.hideLineItem} /> 
      });

      const adminLineItems = _.map(quote.adminLineitems, (li) => {
        const taxReturn = _.find(taxReturns,(tr) => {
            return tr.id === li.tax_return_id;
        });

        return <InvoiceAdminQuoteLineItem key={li.id} quoteLineItem={li} taxReturn={taxReturn} deleteLineItemHandler={this.deleteAdminLineItem} /> 
      });

    
      return <thead>
        {quoteLineItems}
        {adminLineItems}
      </thead>
    }

    renderBillingStatusTable(taxReturns,quotes, quoteUpdating, quoteUpdated, errors) {
      if(!taxReturns || taxReturns.length===0) {
        return <div>
          No Tax returns
          </div>
      }

      const addAdminLineItems = <InvoiceAddAdminQuoteLineItem quote={quotes} addLineItemHandler={this.addAdminLineItem} updating={quoteUpdating} updated={quoteUpdated} /> 

      return (<div>
          <table class="standard-table">
              <thead>
              <tr>
                  <th>
                      Hide
                  </th>
                  <th>
                      Line Item Description
                  </th>
                  <th>
                      Refund/ Owing Amount
                  </th>
                  <th>
                      Remove
                  </th>
              </tr>
              </thead>
              {this.renderQuoteList(quotes, taxReturns)}
          </table>
          { addAdminLineItems }
          { renderErrors(errors) }
          <table class="standard-table">
                {this.getTotalBillingAmount(quotes)}
          </table>
        </div>
      );
    }

    renderSendBillButton(quotes,billError,billSending,billSent) {
      if(!quotes) {
        return <div> getting quote
        </div>
      }

      return <InvoiceSendBillToClient submitHandler={this.sendBillToClient} quoteId={quotes.id} updating={billSending} updated={billSent} error={billError} />
    }

    render() {
        //todo, figure out what "No documents added to this package" means
        //todo, pass in data to table
        const { taxReturns, taxReturn, quotes, quoteUpdating, quoteUpdated, billError, billSending, billSent, errors} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="invoice" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1>Invoice</h1>
                    <h2></h2>
                    {this.renderBillingStatusTable(taxReturns, quotes, quoteUpdating, quoteUpdated, errors)}
                    {this.renderSendBillButton(quotes,billError,billSending,billSent)}
                </section>
            </main>
        )
    }
}
