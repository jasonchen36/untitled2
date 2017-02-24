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
    
    getButtonUrl(url, userId){
       return userId?url:'/';
    }

    
    render() {
      const { userId } = this.props;
        return (
            <aside class="col-sm-4 col-lg-3">
                <ul id="sidebar-menu">
                    <li>
                        <p class="button disabled">Personal Tax 2016</p>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/personal-profile', userId)} class={this.getButtonClass('personalProfile')}>Personal Profile</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/account-profile', userId)} class={this.getButtonClass('accountProfile')}>Account Profile</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/tax-profile',userId)} class={this.getButtonClass('taxProfile')}>Tax Profile</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/uploads',userId)} class={this.getButtonClass('uploads')}>TAXitem Uploads</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/checklist',userId)} class={this.getButtonClass('checklist')}>Checklist</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/messages',userId)} class={this.getButtonClass('messages')}>Messages</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/notes',userId)} class={this.getButtonClass('notes')}>Notes</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/billing-status',userId)} class={this.getButtonClass('billingStatus')}>Status</Link>
                    </li>
                    <li>
                        <Link to={this.getButtonUrl('/users/'+userId+'/invoice',userId)} class={this.getButtonClass('invoice')}>Invoice</Link>
                    </li>
                </ul>
            </aside>
        );
    }
}
