import React from "react";
import { connect } from "react-redux"
import { IndexLink, Link } from "react-router";

import { fetchLoginuser, logoutLoginuser } from "../../actions/loginuserActions"

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser
    };
})

export default class Nav extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {
        this.props.dispatch(fetchLoginuser())
    }

    //listeners
    logoutLoginuser(e) {
        this.props.dispatch(logoutLoginuser())
    }

    //templates
    renderNavMenu(){
        const { loginuser } = this.props;
        if (loginuser.id) {
            return (
                <ul class="standard-menu">
                    <li>
                        {loginuser.first_name} ({loginuser.role})
                        <ul class="sub-menu">
                            <li>
                                <Link to="users">Users</Link>
                            </li>
                            <li>
                                <IndexLink to="/" onClick={this.logoutLoginuser.bind(this)}>Logout</IndexLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul>
                    <li>
                        <IndexLink to="/">Login</IndexLink>
                    </li>
                </ul>
            );
        }
    }

/// Nav for all pages
    render() {
        return (
            <nav id="header-menu-container" role="navigation" class="col-sm-8">
                { this.renderNavMenu() }
            </nav>
        );
    }
}

