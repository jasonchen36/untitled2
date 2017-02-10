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

    getTotalBillingAmount(totals){
      if(!totals) {
        return <tr><td>
          Loading Totals
        </td></tr>

      }
      
      return _.map(totals, (total,key) => {
        return <div key={key}>
            <tr>
              <td>{ total.name }
              </td>
              <td> ${ total.cost }
              </td>
              </tr>
        </div>
      });
    }

    renderBillingStatusRow(taxReturn){
        return (
            <tr key={taxReturn.id}>
                <td>
                    {taxReturn.first_name}{taxReturn.last_name ? ' ' : ''}{taxReturn.last_name}
                </td>
                <td>
                    { taxReturn && taxReturn.status ? taxReturn.status.display_text : 'no status'}
                </td>
                <td>
                    {"?"}
                </td>
                <td>
                    ${"?"}
                </td>
            </tr>
        );
    }

    renderBillingStatusTable(taxReturns,totals) {
      if(!taxReturns || taxReturns.length===0) {
        return <div>
          No Tax returns
          </div>
      }

        const tableRows = taxReturns.map(taxReturn =>this.renderBillingStatusRow(taxReturn));
        return (
            <table class="standard-table">
                <thead>
                <tr>
                    <th>
                        My TAXreturn Status
                    </th>
                    <th>
                        File Electronically?
                    </th>
                    <th>
                        Result
                    </th>
                    <th>
                        Fee
                    </th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
                <tfoot>
                  {this.getTotalBillingAmount(totals)}
                </tfoot>
            </table>
        );
    }

    render() {
        //todo, figure out what "No documents added to this package" means
        //todo, pass in data to table
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="invoice" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1></h1>
                    <h2></h2>
                    <p>No documents added to this package</p>
                    {this.renderBillingStatusTable(taxReturns)}
                </section>
            </main>
        )
    }
}
