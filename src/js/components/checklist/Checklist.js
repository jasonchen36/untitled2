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

export default class Checklist extends React.Component {

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