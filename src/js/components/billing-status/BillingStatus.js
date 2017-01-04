import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";

export default class BillingStatus extends React.Component {
    render() {
        return (
            <main class="grid-container row">
                <Sidebar/>
                <section class="col-sm-8">
                    <h1>Billing Status</h1>
                </section>
            </main>
        )
    }
}