import React from "react"
import { connect } from "react-redux"
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { createLoginuser, loginLoginuser, fetchLoginuser } from "../../actions/loginuserActions";
import { fetchUser, updateUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        user: store.users.user,
        account:store.accounts.account,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class PersonalProfile extends React.Component {
    constructor() {
        super();
        this.updateUser = this.handleUpdateUser.bind(this);
        this.updateTaxReturn = this.handleFetchTaxReturn.bind(this);
    }

    componentWillMount() {
        const props = this.props;
        //todo, redirects on page reload
        const { loginuser } = props;
        if(!loginuser || !loginuser.id) {
            props.router.push('/');
        } else {
        }

        const userId = this.props.params.userId;

        this.props.dispatch(fetchUser(userId));

        if(this.props.user && this.props.user.accountId) {
            this.props.dispatch(fetchAccount(this.props.user.account_id));
        }
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.user && nextProps.user.account_id && (!nextProps.account || nextProps.account.accountId!=nextProps.user.account_id)) {
            this.props.dispatch(fetchAccount(nextProps.user.account_id));
        }

        if(nextProps.taxReturns && !nextProps.taxReturn && nextProps.taxReturns.length>0) {
            this.props.dispatch(fetchTaxReturn(nextProps.taxReturns[0].id));
        }

        if (nextProps.taxReturn && this.props.taxReturn) {
            // Update the form with Props if a previous user was loaded
            this.updateLocalProps(nextProps.taxReturn);
        } else {
            // If no previous user was loaded, then default Values will handle loading the form
        }
    };

    /// update all the form with the values from the user (prop)
    updateLocalProps(taxReturn) {
        this.sin.value = taxReturn.sin;
        this.first_name.value= taxReturn.first_name;
        this.last_name.value = taxReturn.last_name;
        this.title.value = taxReturn.title;
        this.address.value = taxReturn.address;
    };

    fetchUser(userId) {
        this.props.dispatch(fetchUser(userId))
    };

    handleUpdateUser(e) {
        let updatedValues = {
            first_name: this.first_name.value,
            last_name: this.last_name.value,
            title: this.title.value,
            sin: this.sin.value
        };

        let { id } = e.target;

        e.preventDefault();

        // TODO: dispatch to update tax profile, only if account
        //    this.props.dispatch(updateUser(id, updatedValues));
    };

    handleFetchTaxReturn(e) {
        let { id } = e.target;

        e.preventDefault();

        this.props.dispatch(fetchTaxReturn(id));
    };

    renderPersonalProfile(taxReturn){
        return (
            <form class="standard-form">
                <label for="user-sin">SIN</label>
                <input id="user-sin" ref={(input) => {this.sin = input;}}  type="text" placeholder="SIN" defaultValue={taxReturn.sin ?taxReturn.sin:''}/>
                <label for="user-title">Title</label>
                <input id="user-title" ref={(input) => {this.title = input;}} type="text"  placeholder="Title" defaultValue={taxReturn.title ? taxReturn.title:''} />
                <label for="user-first-name">First Name &amp; Initials</label>
                <input id="user-first-name" ref={(input) => {this.first_name = input;}} type="text"  placeholder="First Name" defaultValue={taxReturn.first_name ? taxReturn.first_name:''} />
                <label for="user-last-name">Last Name</label>
                <input id="user-last-name" ref={(input) => {this.last_name = input;}} type="text"  placeholder="Last Name" defaultValue={taxReturn.last_name? taxReturn.last_name:''} />
                <label for="user-address">Address</label>
                <input id="user-address" ref={(input) => {this.address = input;}} type="text"  placeholder="Address" defaultValue={taxReturn.address ? taxReturn.address:''} />
                <button id={taxReturn.id} onClick={this.updateUser}>update profile</button>
            </form>
        );
    }

    render() {
        // TODO: move to a helper
        const { user, taxReturns, taxReturn } = this.props;
        let userOutput='';
        if (!taxReturn) {
            userOutput = <div></div>
        } else if (!user.id) {
            userOutput=<button onClick={this.fetchUser.bind(this,this,props.params.userId)}>load users</button>
        } else {
            userOutput= this.renderPersonalProfile(taxReturn);
        }
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="personalProfile" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Personal Profile</h1>
                    {userOutput}
                </section>
            </main>
        );
    }
}
