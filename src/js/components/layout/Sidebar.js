import React from "react";

import { IndexLink, Link } from "react-router";

// Footer for all pages
export default class Sidebar extends React.Component {


    render() {
      const { userId } = this.props;



        return (
            <aside class="col-sm-4">
                <ul id="sidebar-menu">
                    <li>
                        <Link to="personal-profile" class="button grey">Personal Tax 2015</Link>
                    </li>
                    <li>
                        <Link to="personal-profile" class="button">Personal Profile</Link>
                    </li>
                    <li>
                        <Link to="tax-profile" class="button">Tax Profile</Link>
                    </li>
                    <li>
                        <Link to="uploads" class="button">TAXitem Uploads</Link>
                    </li>
                    <li>
                        <Link to="checklist" class="button">Checklist</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/messages" : "/"} class="button">Messages</Link>
                    </li>
                    <li>
                        <Link to="notes" class="button">Notes</Link>
                    </li>
                    <li>
                        <Link to="billing-status" class="button">Billing Status</Link>
                    </li>
                    <li>
                        <Link to="users" class="button grey disabled">Users</Link>
                    </li>
                </ul>
            </aside>
        );
    }
}
