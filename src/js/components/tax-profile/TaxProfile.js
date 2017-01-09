import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser
    };
})

export default class TaxProfile extends React.Component {
    //todo, get export urls
    //todo, pass in list of other users to userOptionsHeader
    render() {
        const { loginuser} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="taxProfile" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader usersList={[loginuser]} activeUser={loginuser}/>
                    <h1>Tax Profile</h1>
                    <div>
                        <a class="tax-profile-export">
                            <i class="fa fa-file-excel-o"></i>Export CSV
                        </a>
                        <a class="tax-profile-export">
                            <i class="fa fa-file-pdf-o"></i>Export PDF
                        </a>
                    </div>
                </section>
            </main>
        )
    }
}