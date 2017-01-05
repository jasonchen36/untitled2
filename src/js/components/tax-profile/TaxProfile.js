import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";

export default class TaxProfile extends React.Component {
    render() {
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="taxProfile" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <h1>Tax Profile</h1>
                </section>
            </main>
        )
    }
}