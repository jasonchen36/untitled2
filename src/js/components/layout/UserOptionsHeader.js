import React from "react";

import { IndexLink, Link } from "react-router";

// header for changing users in tax return
export default class UserOptionsHeader extends React.Component {

    getButtonClass(entry, activeUser){
        if (entry && entry.id === activeUser.id){
            return 'button disabled';
        } else if(!entry || !activeUser) {
            return 'button disabled';
        } else {
            return 'button'
        }
    }

    //todo, add bindings to switch users on button click

    renderUserOptions(taxReturns, activeUser){
        if (taxReturns && taxReturns.length > 0){
            if (!activeUser) {
                activeUser = taxReturns[0];
            }
            return taxReturns.map(user =>
                <button key={user.id} class={this.getButtonClass(user, activeUser)}>{user.first_name} {user.last_name}</button>
            );
        } else {
            return <button class="button disabled">No Tax Returns</button>
        }
    }

    render() {
        const { taxReturns, activeTaxReturn } = this.props;
        return (
            <aside id="header-user-options" class="col-sm-12">
                {this.renderUserOptions(taxReturns, activeTaxReturn)}
            </aside>
        );
    }
}
