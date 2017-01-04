import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";

export default class Checklist extends React.Component {
    render() {
        return (
            <main class="grid-container row">
                <Sidebar/>
                <section class="col-sm-8">
                    <h1>Checklist</h1>
                </section>
            </main>
        )
    }
}