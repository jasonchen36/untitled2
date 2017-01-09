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

export default class Notes extends React.Component {
    render() {
        //todo, pass in list of other users to userOptionsHeader
        const { loginuser} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="notes" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader usersList={[loginuser]} activeUser={loginuser}/>
                    <h1>Notes</h1>
                </section>
            </main>
        )
    }
}