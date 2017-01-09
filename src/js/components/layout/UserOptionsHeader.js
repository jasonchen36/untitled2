import React from "react";

import { IndexLink, Link } from "react-router";

// header for changing users in tax return
export default class UserOptionsHeader extends React.Component {

    getButtonClass(entry, activeUser){
        if (entry && entry.id === activeUser.id){
            return 'button disabled';
        } else {
            return 'button'
        }
    }

    //todo, add bindings to switch users on button click
    
    renderUserOptions(usersList, activeUser){
        if (!activeUser){
            activeUser = usersList[0];
        }
        return usersList.map(user =>
            <button class={this.getButtonClass(user, activeUser)} key={user.id}>{user.first_name} {user.last_name}</button>
        );
    }

    render() {
        const { usersList, activeUser } = this.props;
        return (
            <aside id="header-user-options" class="col-sm-12">
                {this.renderUserOptions(usersList, activeUser)}
            </aside>
        );
    }
}
