import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class BillingStatus extends React.Component {
    
    renderBillingStatusRow(data){
        return (
            <tr>
                <td>
                    {data.status}
                </td>
                <td>
                    {data.fileElectronically}
                </td>
                <td>
                    {data.result}
                </td>
                <td>
                    {data.fee}
                </td>
            </tr>
        );
    }

    renderBillingStatusTable(data) {
        const tableRows = data.map(row =>this.renderBillingStatusRow(row));
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
            </table>
        );
    }

    render() {
        //todo, pass in list of other users to userOptionsHeader
        //todo, figure out what "No documents added to this package" means
        //todo, pass in data to table
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="billingStatus" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Billing Status</h1>
                    <h2>Personal Questionnaire 2015</h2>
                    <p>No documents added to this package</p>
                    {this.renderBillingStatusTable([])}
                </section>
            </main>
        )
    }
}