import React from "react";
import { connect } from "react-redux"
import { IndexLink, Link } from "react-router";

import { logoutLoginuser } from "../../actions/loginuserActions"

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

    //listeners
    logoutLoginuser(e) {
        this.props.dispatch(logoutLoginuser())
    }

    //templates
    renderNavMenu(user){
        if (user && user.hasOwnProperty('first_name')) {
            return (
              <ul class="standard-menu">
                <li>
                  {user.first_name} ({user.role})
                  <ul class="sub-menu">
                      <li>
                          <Link to="/users">Users</Link>
                      </li>
                    <li>
                      <IndexLink to="/" onClick={this.logoutLoginuser.bind(this)}>Logout</IndexLink>
                    </li>
                  </ul>
                </li>
              </ul>
            );
        }
    }

/// Nav for all pages
    render() {
        const { loginuser } = this.props;
        return (
            <nav id="header-menu-container" role="navigation">
                { this.renderNavMenu(loginuser) }
            </nav>
        );
    }
}

