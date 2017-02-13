import React from "react"
import _ from "lodash";

import { connect } from "react-redux"
import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { loadUser, loadUserQuote } from "../../actions/loaderActions";


@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        quotes:store.quotes.quotes
    };
})

export default class BillingStatus extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
      const userId = this.props.params.userId;

      this.props.dispatch(loadUserQuote(userId));
    };

    componentWillReceiveProps(nextProps) {
    };

    getTotalBillingAmount(quote){
      if(!quote) {
        return <tr><td>
          Loading Totals
        </td></tr>

      }
      
      return <div key={quote.id}>
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

      </div>
    }

    renderQuoteList(quote,taxReturns) {
      if(!quote) {
        return <div>
          Loading quote
        </div>
      } 

      const getCheckbox = (qli) => {
        if (!qli.original_quote) {
          //TODO: should be opposite
        //if (qli.original_quote) {
          return <td> original check : <input type="checkbox" checked={qli.checkbox} /> </td>;
        } else {
          return <td></td>
        }
      };

      const quoteLineItems = _.map(quote.quoteLineItems, (li) => {
        const taxReturn = _.find(taxReturns,(tr) => {
            return tr.id === li.tax_return_id;
        });

        let tRName = taxReturn && taxReturn.first_name ? taxReturn.first_name : "";
        tRName +=  taxReturn && taxReturn.first_name && taxReturn.last_name ? " ": "";
        tRName += taxReturn && taxReturn.last_name ? taxReturn.last_name : "";
        tRName += li && li.text && tRName.length>0 ? " - " : "";
        tRName += li && li.text ? li.text : "";

        return <tr key={li.id}>
          <td>
          {getCheckbox(li)}
          </td><td> {tRName}
          </td><td> {li.value}
          </td><td> {!li.original_quote}
          </td>
          </tr>
      });

      const otherLineItems = _.map(quote.otherLineItems, (li) => {
        return <tr key={li.id}>
          <td>
          {getCheckbox(li)}
          </td><td> {li.text}
          </td><td> {li.value}
          </td><td> {li.original_quote}
          </td>
          </tr>
      });

      return <thead>
        {quoteLineItems}
        {otherLineItems}
      </thead>
    }

    renderBillingStatusTable(taxReturns,quotes) {
      if(!taxReturns || taxReturns.length===0) {
        return <div>
          No Tax returns
          </div>
      }

        return (
            <table class="standard-table">
                <thead>
                <tr>
                    <th>
                        Hide
                    </th>
                    <th>
                        Text
                    </th>
                    <th>
                        Amount
                    </th>
                    <th>
                        Remove
                    </th>
                </tr>
                </thead>
                {this.renderQuoteList(quotes, taxReturns)}
                <tfoot>
                  {this.getTotalBillingAmount(quotes)}
                </tfoot>
            </table>
        );
    }

    render() {
        //todo, figure out what "No documents added to this package" means
        //todo, pass in data to table
        const { taxReturns, taxReturn, quotes} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="invoice" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1></h1>
                    <h2></h2>
                    <p>No documents added to this package</p>
                    {this.renderBillingStatusTable(taxReturns, quotes)}
                </section>
            </main>
        )
    }
}
