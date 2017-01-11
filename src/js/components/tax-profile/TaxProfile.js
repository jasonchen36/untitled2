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

export default class TaxProfile extends React.Component {
    
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
                <section id="tax-profile-container" class="col-sm-8">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Tax Profile</h1>
                    {this.renderTaxProfile()}
                </section>
            </main>
        )
    }
}