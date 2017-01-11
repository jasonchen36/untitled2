import React from "react"
import { connect } from "react-redux"
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { createLoginuser, loginLoginuser, fetchLoginuser } from "../../actions/loginuserActions";
import { fetchUser, fetchTaxPros, updateUser } from "../../actions/usersActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        user: store.users.user,
        taxPros: store.users.taxPros,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class AccountProfile extends React.Component {
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

        this.props.dispatch(fetchTaxPros(userId));
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
        this.first_name.value= user.first_name;
        this.last_name.value = user.last_name;
        this.email.value = user.email;
        this.phone.value = user.phone;
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
        };

        let { id } = e.target;

        e.preventDefault();

        this.props.dispatch(updateUser(id, updatedValues));
    };

    renderAccountProfile(user, taxPros){
        //todo, change user role to a dropdown
        return (
            <form class="standard-form">
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
                <hr/>
                <label for="user-role">Account Role</label>
                <input id="user-role" ref={(input) => {this.role = input;}} type="text"  placeholder="Role" defaultValue={user.role} />
                <label for="user-tax-pro">Assigned TaxPro</label>
                <select>
                    {this.renderTaxProSelection(user,taxPros)}
                </select>
                <button id={user.id} onClick={this.updateUser}>update user</button>
            </form>
        );
    }

    renderTaxProSelection(user, taxPros) {
        const defaultSelection = <option key={-1} disabled>TaxPros</option>;
        if(!taxPros) {
            return defaultSelection;
        }
        const renderedTaxPros= taxPros.map((taxPro) => {
            return (
                <option key={taxPro.id} defaultValue={taxPro.id===user.assigned_tax_pro ? true: false}>
                    {taxPro.first_name}{ taxPro.last_name? ' '+taxPro.last_name:''}
                </option>
            );
        });
        return _.concat([defaultSelection],renderedTaxPros);
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

        const { loginuser, user, userId,taxPros, taxReturns, taxReturn } = this.props;
        const name=<h1>{loginuser.name}</h1>;

        let userOutput='';
        if (!user) {
            userOutput = <div>Please Log in</div>
        } else if (!user.id) {
            userOutput=<button onClick={this.fetchUser.bind(this,this,props.params.userId)}>load users</button>
        } else {
            userOutput= this.renderAccountProfile(user,taxPros);
        }

//todo, pass in list of other users to userOptionsHeader
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="accountProfile" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Account Profile</h1>
                    <section class="col-sm-8">{name}{userOutput}</section>
                </section>
            </main>
        );
    }
}
