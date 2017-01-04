import React from "react";
import { IndexLink, Link } from "react-router";
import { connect } from "react-redux"

// Actions
import { fetchLoginuser } from "../../actions/loginuserActions";

import Nav from "../layout/Nav";

// Store info needed
@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser
    };
})

export default class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            collapsed: true
        };
    }

    componentWillMount() {
        this.props.dispatch(fetchLoginuser())
    }

/// Nav for all pages
    render() {
        const { location,loginuser } = this.props;
        return (
            <header class="grid-container row">
                <div class="col-sm-4">
                    <IndexLink to="/">
                        <div class="i--icon-logo"></div>
                    </IndexLink>
                </div>
                <Nav location={location} name={loginuser?loginuser.name:null} loggedIn={typeof loginuser ==="undefined"} />
            </header>
        );
    }
}

