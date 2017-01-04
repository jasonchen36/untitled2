import React from "react"
import { connect } from "react-redux"
import Sidebar from "../layout/Sidebar";

import { createLoginuser, loginLoginuser, fetchLoginuser } from "../../actions/loginuserActions";
import { fetchUser, updateUser } from "../../actions/usersActions";

@connect((store) => {
  return {
    loginuser: store.loginuser.loginuser,
    loginuserFetched: store.loginuser.fetched,
    user: store.users.user,
  };
})

export default class User extends React.Component {
  constructor() {
    super();
    this.updateUser = this.handleUpdateUser.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    const { loginuser } = props;
    if(!loginuser || !loginuser.id) {
      props.router.push('/');
    } else {
    }
  
    const userId = this.props.params.userId;

    this.props.dispatch(fetchUser(userId));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && this.props.user) {
      // Update the form with Props if a previous user was loaded
      this.updateLocalProps(nextProps.user);
    } else {
      // If no previous user was loaded, then default Values will handle loading the form
    }
  };

  /// update all the form with the values from the user (prop)
  updateLocalProps(user) {
    this.role.value = user.role;
    this.first_name.value= user.first_name;
    this.last_name.value = user.last_name;
    this.email.value = user.email;
    this.phone.value = user.phone;
    this.username.value = user.username;
  };

  fetchUser(userId) {
    this.props.dispatch(fetchUser(userId))
  };

  handleUpdateUser(e) {
    let updatedValues = {
      role: this.role.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      email: this.email.value,
      phone: this.phone.value,
      username: this.username.value
    };

    let { id } = e.target;

    e.preventDefault();

    this.props.dispatch(updateUser(id, updatedValues));
  };

  render() {
    // TODO: move to a helper
    const addCalculatedDataToUser = (user) => {
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
    };

    const { loginuser, user } = this.props;
    const name=<h1>{loginuser.name}</h1>;

    let userOutput='';
    if (!user) {
      userOutput = <div>Please Log in</div>
    } else if (!user.id) {
      userOutput=<button onClick={this.fetchUser.bind(this,this,props.params.userId)}>load users</button>
    } else {
      var usersWithFullName =   addCalculatedDataToUser(user);
      // The user form
      // TODO: move to a sub component
      const mappedUser = <div>
        <form>
          <ul>
            <li>
            FullName:{user.fullName}
            </li>
            <li>
            First Name:
              <input ref={(input) => {this.first_name = input;}} type="text"  placeholder="First Name" defaultValue={user.first_name} />
            </li>
            <li>
            Last Name:
             <input ref={(input) => {this.last_name = input;}} type="text"  placeholder="Last Name" defaultValue={user.last_name} />
            
            </li>
            <li>
            Role:
             <input ref={(input) => {this.role = input;}} type="text"  placeholder="Role" defaultValue={user.role} />
({user.role})
            </li>
            <li>
            Email:
             <input ref={(input) => {this.email = input;}} type="text"  placeholder="Email" defaultValue={user.email} />

            </li>
            <li>
            Phone:
             <input ref={(input) => {this.phone = input;}} type="text"  placeholder="Phone" defaultValue={user.phone} />

            </li>
            <li>
            Username:
             <input ref={(input) => {this.username = input;}} type="text"  placeholder="Username" defaultValue={user.username} />

            </li>
          </ul>
          <button id={user.id} onClick={this.updateUser}>update user</button>          
          </form>
        </div>


      userOutput=<div>
         {mappedUser}
      </div>
    }

    return (
        <main class="grid-container row">
            <Sidebar/>
            <section class="col-sm-8">{name}{userOutput}</section>
        </main>
    );
  }
}
