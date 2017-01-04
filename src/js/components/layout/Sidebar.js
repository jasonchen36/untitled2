import React from "react";

import { IndexLink, Link } from "react-router";

// Footer for all pages
export default class Sidebar extends React.Component {
    render() {
        return (
            <aside class="col-sm-4">
                <ul id="sidebar-menu">
                    <li>
                        <Link to="personal-profile" class="button grey">Personal Tax 2015</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">Personal Profile</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">Tax Profile</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">TAXitem Uploads</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">Checklist</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">Messages</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">Notes</Link>
                    </li>
                    <li>
                        <Link to="#" class="button">Billing Status</Link>
                    </li>
                    <li>
                        <Link to="users" class="button grey disabled">Users</Link>
                    </li>
                </ul>
            </aside>
        );
    }
}
