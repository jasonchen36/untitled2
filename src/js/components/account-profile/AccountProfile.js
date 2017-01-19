import React from "react"
import { connect } from "react-redux"
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { createLoginuser, loginLoginuser, fetchLoginuser } from "../../actions/loginuserActions";
import { fetchUser, fetchTaxPros, updateUser } from "../../actions/usersActions";
import { renderTaxProSelectionOptions } from "../helpers/RenderTaxProsSelection";
import { renderSelectionOptions } from "../helpers/LayoutHelpers";


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
    constructor(props) {
        super(props);
        this.updateUser = this.handleUpdateUser.bind(this);
        this.selectedTaxPro = { value:null};
        this.selectedRole = {value:"Customer"};
    }

    componentWillMount() {
        const { loginuser } = this.props;
        if(!loginuser || !loginuser.id) {
            this.props.router.push('/');
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
        }
    };

    /// update all the form with the values from the user (prop)
    updateLocalProps(user) {
        this.first_name.value= user.first_name;
        this.last_name.value = user.last_name;
        this.email.value = user.email;
        this.phone.value = user.phone;
        this.selectedTaxPro.value = user.taxpro_id;
        this.selectedRole.value=user.role;

    };

    handleUpdateUser(e) {
      e.preventDefault();

      let updatedValues = {
          first_name: this.first_name.value,
          last_name: this.last_name.value,
          email: this.email.value,
          phone: this.phone.value,
          taxpro_id: this.selectedTaxPro.value,
          role:this.selectedRole.value
      };

      let { id } = e.target;

      this.props.dispatch(updateUser(id, updatedValues));
    };

    handleTaxProSelected(e) {
        var selected=  e.target.value;
        this.selectedTaxPro.value = selected;
        this.setState({value:this.selectedTaxPro.value});
    }

    handleRoleSelected(e) {
      let selected = e.target.value;
      this.selectedRole.value = selected;
      this.setState({value:this.selectedRole.value});
    }

    renderTaxPro(loginuser,taxPros) {
      if(loginuser.role==="Admin") {
       return  <select value={this.selectedTaxPro.value} onChange={this.handleTaxProSelected.bind(this)}>
                    {renderTaxProSelectionOptions(taxPros)}
                </select>
      } else if(loginuser.role==="TaxPro") {
       return <div>You</div>
      } else {
        return <div>?</div>
      }
    }

    renderRole(loginuser) {
      if(loginuser.role==="Admin") {
      const listOfFilerTypes = [{id:"Customer",val:"Customer"},{id:"TaxPro",val:"TaxPro"},{id:"Admin",val:"Admin"}];

      return <select value={this.selectedRole.value} onChange={this.handleRoleSelected.bind(this)}>
        {renderSelectionOptions(listOfFilerTypes, "Role")}
      </select>
      } else {
        return <div>{this.selectedRole.value}</div>
      }
    }

    renderAccountProfile(user, taxPros,loginuser){
        if(!user) {
          return <div>Getting User...</div>
        }

        //todo, change user role to a dropdown
        return (
            <form class="standard-form" id={user.id} onSubmit={this.updateUser}>
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
                {this.renderRole(loginuser)}
                <input id="user-role" ref={(input) => {this.role = input;}} type="text"  placeholder="Role" defaultValue={user.role} />
                <label for="user-tax-pro">Assigned TaxPro</label>
                  {this.renderTaxPro(loginuser,taxPros)}
                <button id={user.id} >update user</button>
            </form>
        );
    }

    render() {
        const { loginuser,user, taxPros, taxReturns, taxReturn } = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="accountProfile" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1>Account Profile</h1>
                    {this.renderAccountProfile(user, taxPros,loginuser)}
                </section>
            </main>
        );
    }
}
