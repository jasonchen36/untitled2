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

export default class Uploads extends React.Component {
    //todo, pass in list of other users to userOptionsHeader
    render() {
        const { loginuser} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="uploads" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader usersList={[loginuser]} activeUser={loginuser}/>
                    <h1>Uploads</h1>
                </section>
            </main>
        )
    }
}