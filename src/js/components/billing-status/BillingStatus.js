import React from "react"
import _ from "lodash";

import { connect } from "react-redux"
import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class BillingStatus extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.props.dispatch(fetchUser(this.props.params.userId));
    };

    componentWillReceiveProps(nextProps) {
    };

    getDummyData(){
        return [
            {
                id: 1,
                status: 'To Be Assigned',
                fileElectronically: 'Yes',
                result: '20.50',
                fee: '5.00'
            },
            {
                id: 2,
                status: 'Pending Review',
                fileElectronically: 'No',
                result: '15.00',
                fee: '5.00'
            },
            {
                id: 3,
                status: 'Done',
                fileElectronically: 'Yes',
                result: '0.00',
                fee: '0.00'
            }
        ]
    }

    fetchUser(userId) {
        this.props.dispatch(fetchUser(userId))
    };

    getTotalBillingAmount(data){
        var total = 0;
        _.each(data, function(entry){
            total += parseFloat(entry.result) + parseFloat(entry.fee);
        });
        return total.toFixed(2);
    }

    renderBillingStatusRow(data){
        return (
            <tr key={data.id}>
                <td>
                    {data.status}
                </td>
                <td>
                    {data.fileElectronically}
                </td>
                <td>
                    ${data.result}
                </td>
                <td>
                    ${data.fee}
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
                <tfoot>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Total</th>
                    <th>${this.getTotalBillingAmount(data)}</th>
                </tr>
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
                <Sidebar activeScreen="billingStatus" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Billing Status</h1>
                    <h2>Personal Questionnaire 2015</h2>
                    <p>No documents added to this package</p>
                    {this.renderBillingStatusTable(this.getDummyData())}
                </section>
            </main>
        )
    }
}
