import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";

export default class Checklist extends React.Component {
    render() {
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="checklist" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <h1>Checklist</h1>
                </section>
            </main>
        )
    }
}