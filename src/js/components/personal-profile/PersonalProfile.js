import React from "react"
import { connect } from "react-redux"
import Sidebar from "../layout/Sidebar";

import { createLoginuser, loginLoginuser, fetchLoginuser } from "../../actions/loginuserActions";
import { fetchUser, updateUser } from "../../actions/usersActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        user: store.users.user
    };
})

export default class PersonalProfile extends React.Component {
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
        this.sin.value = user.sin;
        this.first_name.value= user.first_name;
        this.last_name.value = user.last_name;
        this.email.value = user.email;
        this.phone.value = user.phone;
        this.title.value = user.title;
        this.address.value = user.address;
    };

    fetchUser(userId) {
        this.props.dispatch(fetchUser(userId))
    };

    handleUpdateUser(e) {
        let updatedValues = {
            first_name: this.first_name.value,
            last_name: this.last_name.value,
            email: this.email.value,
            phone: this.phone.value,
            title: this.title.value,
            sin: this.sin.value,
            address: this.address.value
        };

        let { id } = e.target;

        e.preventDefault();

        this.props.dispatch(updateUser(id, updatedValues));
    };

    renderPersonalProfile(user){
        return (
            <form class="standard-form">
                <label for="user-sin">SIN</label>
                <input id="user-sin" ref={(input) => {this.sin = input;}}  type="text" placeholder="SIN" defaultValue={user.sin}/>
                <label for="user-title">Title</label>
                <input id="user-title" ref={(input) => {this.title = input;}} type="text"  placeholder="Title" defaultValue={user.title} />
                <label for="user-first-name">First Name &amp; Initials</label>
                <input id="user-first-name" ref={(input) => {this.first_name = input;}} type="text"  placeholder="First Name" defaultValue={user.first_name} />
                <label for="user-last-name">Last Name</label>
                <input id="user-last-name" ref={(input) => {this.last_name = input;}} type="text"  placeholder="Last Name" defaultValue={user.last_name} />
                <label for="user-email">Preferred Email</label>
                <input id="user-email" ref={(input) => {this.email = input;}} type="text"  placeholder="Email" defaultValue={user.email} />
                <label for="user-address">Address</label>
                <input id="user-address" ref={(input) => {this.address = input;}} type="text"  placeholder="Address" defaultValue={user.address} />
                <label for="user-phone">Preferred Telephone #</label>
                <input id="user-phone" ref={(input) => {this.phone = input;}} type="text"  placeholder="Phone" defaultValue={user.phone} />
                <button id={user.id} onClick={this.updateUser}>update user</button>
            </form>
        );
    }

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

        const { loginuser, user, userId } = this.props;
        const name=<h1>{loginuser.name}</h1>;

        let userOutput='';
        if (!user) {
            userOutput = <div>Please Log in</div>
        } else if (!user.id) {
            userOutput=<button onClick={this.fetchUser.bind(this,this,props.params.userId)}>load users</button>
        } else {
            userOutput= this.renderPersonalProfile(user);
        }


        return (
            <main class="grid-container row">
                <Sidebar activeScreen="personalProfile" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <h1>Personal Profile</h1>
                    <section class="col-sm-8">{name}{userOutput}</section>
                </section>
            </main>
        );
    }
}
