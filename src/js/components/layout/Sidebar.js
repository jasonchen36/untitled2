import React from "react";

import { IndexLink, Link } from "react-router";

// sidebar for tax return information pages
export default class Sidebar extends React.Component {

    getButtonClass(screenLink){
        const { activeScreen } = this.props;
        if (activeScreen === screenLink){
            return 'button disabled';
        } else {
            return 'button'
        }
    }
    
    render() {
      const { userId } = this.props;
        return (
            <aside class="col-sm-4">
                <ul id="sidebar-menu">
                    <li>
                        <p class="button disabled">Personal Tax 2015</p>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/personal-profile" : "/"} class={this.getButtonClass('personalProfile')}>Personal Profile</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/tax-profile" : "/"} class={this.getButtonClass('taxProfile')}>Tax Profile</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/uploads" : "/"} class={this.getButtonClass('uploads')}>TAXitem Uploads</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/checklist" : "/"} class={this.getButtonClass('checklist')}>Checklist</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/messages" : "/"} class={this.getButtonClass('messages')}>Messages</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/notes" : "/"} class={this.getButtonClass('notes')}>Notes</Link>
                    </li>
                    <li>
                        <Link to={userId? "/users/"+userId+"/billing-status" : "/"} class={this.getButtonClass('billingStatus')}>Billing Status</Link>
                    </li>
                </ul>
            </aside>
        );
    }
}
