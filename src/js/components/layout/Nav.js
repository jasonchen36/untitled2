import React from "react";
import { IndexLink, Link } from "react-router";

export default class Nav extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

/// Nav for all pages
    render() {
        const { name, loggedIn } = this.props;
        return (
            <nav id="header-menu-container" role="navigation" class="col-sm-8">
                <ul>
                    <li>
                        {name}{loggedIn}
                    </li>
                    <li>
                        <IndexLink to="/">Login</IndexLink>
                    </li>
                    <li>
                        <Link to="users">Users</Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

