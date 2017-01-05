import React from "react";
import { IndexLink } from "react-router";
import Nav from "../layout/Nav";


export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

/// Nav for all pages
    render() {
        return (
            <header class="grid-container row">
                <div class="col-sm-12">
                    <IndexLink to="/">
                        <div class="i--icon-logo"></div>
                    </IndexLink>
                </div>
                <div id="header-nav-container" class="col-sm-12 text-right">
                    <Nav/>
                </div>
            </header>
        );
    }
}

