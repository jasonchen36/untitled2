import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import { createLoginuser, loginLoginuser, fetchLoginuser } from "../../actions/loginuserActions"

import { fetchUsers, deleteUser } from "../../actions/usersActions"

@connect((store) => {
  return {
    loginuser: store.loginuser.loginuser,
    loginuserFetched: store.loginuser.fetched,
    users: store.users.users,
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


  render() {

    // TODO: move to shared helper
    const addCalculatedDataToUsers = (users) => {
      return users.map(user => {
        if (user.name) {
          user.fullName = user.name;
        }
        else if(user.first_name && user.last_name) {
          user.fullName= user.first_name + ' ' + user.last_name;
        } else if (user.first_name) {
            user.fullName = user.first_name;

        } else {
          user.fullName = user.last_name;
        }

        return user;
      });
    };

    const { loginuser, users } = this.props;
    const name=<h1>{loginuser.name}</h1>;

    let userOutput='';
    if (!users) {
      userOutput = <div>Please Log in</div>
    } else if (!users.length) {
      userOutput=<button onClick={this.fetchUsers.bind(this)}>load users</button>
    } else {
      var usersWithFullName =   addCalculatedDataToUsers(users);

    const mappedUsers = usersWithFullName.map(user => <tr key={user.id}>
          <td><Link to={`/users/${user.id}`}>{user.fullName}</Link></td>
          <td>{user.role}</td>
          <td><button key={user.id} onClick={this.deleteUser.bind(this,user)}>delete</button></td>
        </tr>)


      userOutput=<div>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {mappedUsers}
          </tbody>
        </table>
      </div>
    }

    return <section class="col-sm-8">{name}{userOutput}</section>;
  }
}
