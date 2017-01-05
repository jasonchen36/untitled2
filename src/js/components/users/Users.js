import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import { fetchUsers, deleteUser } from "../../actions/usersActions"

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        users: store.users.users
    };
})

export default class Users extends React.Component {
    componentWillMount() {
        this.props.dispatch(fetchUsers())

        const newProps = this.props;
        const { loginuser } = newProps;

        // TODO: move to a support function
        // redirect if not logged in
        if(!loginuser || !loginuser.id) {
            newProps.router.push('/');
        } else {
        }

    };

    /// Handlers
    fetchUsers() {
        this.props.dispatch(fetchUsers())
    };

    deleteUser(user) {

        if(confirm("are you sure you want to delete '"+user.fullName+"'?")) {
            this.props.dispatch(deleteUser(user.id));
        } else {
            console.log('canceled delete');
        }
    };

    getUsersRow(user){
        return (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                    <Link to={`/users/${user.id}/personal-profile`}>{user.first_name} {user.last_name}</Link>
                </td>
                <td>{user.status}</td>
                <td>{user.role}</td>
                <td>
                    <a href="#" key={user.id} onClick={this.deleteUser.bind(this,user)}>delete</a>
                </td>
                <td>todo</td>
                <td>{user.updated_at}</td>
            </tr>
        );
    }

    getTableFilters(){
        //todo, populate taxpros and status from db
        //todo, add event handlers to filters
        return (
            <div id="users-table-filters" class="text-right">
                <label class="col">Filter by:</label>
                <input class="col" type="text" placeholder="User Name"/>
                <select class="col">
                    <option disabled selected>Select TaxPro</option>
                </select>
                <select class="col">
                    <option disabled selected>Select Status</option>
                </select>
            </div>
        );
    }

    getUsersTable(){
        const { users } = this.props;
        if (!users) {
            //todo, redirect to login screen if no user session
            return (
                <div>Please Log in</div>
            );
        } else if (!users.length) {
            return (
                <button onClick={this.fetchUsers.bind(this)}>load users</button>
            );
        } else {
            const usersRows = users.map(user =>this.getUsersRow(user));
            return (
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                        <th>TaxPro</th>
                        <th>Last User Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usersRows}
                    </tbody>
                </table>
            );
        }
    }

    render() {
        return (
            <main class="grid-container row">
                <section class="col-sm-12">
                    <h1>Users</h1>
                    {this.getTableFilters()}
                    {this.getUsersTable()}
                </section>
            </main>
        )
    }
}
