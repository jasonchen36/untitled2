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

export default class Checklist extends React.Component {

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

    renderChecklist(){
        //todo, get checklist url
        return (
            <div>
                <a class="fa-anchor-container">
                    <i class="fa fa-file-pdf-o"></i> Print
                </a>
            </div>
        )
    }

    render() {
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="checklist" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Checklist</h1>
                    {this.renderChecklist()}
                </section>
            </main>
        )
    }
}