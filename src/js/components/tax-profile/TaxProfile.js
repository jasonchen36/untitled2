import React from "react"
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

export default class TaxProfile extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.props.dispatch(fetchUser(this.props.params.userId));
    };

    componentWillReceiveProps(nextProps) {
        //todo, stuck in infinite loop getting account
        // if(nextProps.user && nextProps.user.account_id && (!nextProps.account || nextProps.account.accountId!=nextProps.user.account_id)) {
        //     this.props.dispatch(fetchAccount(nextProps.user.account_id));
        // }
        //
        // if(nextProps.taxReturns && !nextProps.taxReturn && nextProps.taxReturns.length>0) {
        //     this.props.dispatch(fetchTaxReturn(nextProps.taxReturns[0].id));
        // }
        //
        // if (nextProps.taxReturn && this.props.taxReturn) {
        //     // Update the form with Props if a previous user was loaded
        //     // this.updateLocalProps(nextProps.taxReturn);
        // } else {
        //     // If no previous user was loaded, then default Values will handle loading the form
        // }
    };

    renderTaxProfile(){
        //todo, get export urls
        return (
            <div>
                <a class="fa-anchor-container">
                    <i class="fa fa-file-excel-o"></i>Export CSV
                </a>
                <a class="fa-anchor-container">
                    <i class="fa fa-file-pdf-o"></i>Export PDF
                </a>
            </div>
        );
    }

    render() {
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="taxProfile" userId={this.props.params.userId}/>
                <section id="tax-profile-container" class="col-sm-8 col-lg-9">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Tax Profile</h1>
                    {this.renderTaxProfile()}
                </section>
            </main>
        )
    }
}