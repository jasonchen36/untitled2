import React from "react"
import { connect } from "react-redux"
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn, updateTaxProfile } from "../../actions/accountsActions";

import { renderSelectionOptions } from "../helpers/LayoutHelpers";

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
    this.updateTaxReturn = this.handleUpdateTaxProfile.bind(this);

    this.selectedFilerType = { value:"other"};
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

    const taxReturnId = this.props.params.taxReturnId;

    if(taxReturnId) {
      this.props.dispatch(fetchTaxReturn(taxReturnId));
    }

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
    this.firstName.value= taxReturn.first_name;
    this.lastName.value = taxReturn.last_name;
    this.provinceOfResidence.value = taxReturn.province_of_residence;
    this.canadianCitizen.value = taxReturn.canadian_citizen;

    this.selectedFilerType.value = taxReturn.filer_type;
    this.address.value = taxReturn.address;
  };

  fetchUser(userId) {
    this.props.dispatch(fetchUser(userId))
  };

  handleUpdateTaxProfile(e) {
    e.preventDefault();
 
    let { id } = e.target;
    let updateTaxProfileParams = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      provinceOfResidence: this.provinceOfResidence.value,
      filerType: this.selectedFilerType.value
    };


    this.props.dispatch(updateTaxProfile(id,updateTaxProfileParams));
  };

  handleFilerTypeSelected(e) {
    var selected=  e.target.value;
    this.selectedFilerType.value = selected;
    this.setState({value:this.selectedFilerType.value});
  }

  renderFilerType(filerType) {
    const listOfFilerTypes = [{id:"primary",val:"primary"},{id:"spouse",val:"spouse"},{id:"other",val:"other"}];

    return <select value={this.selectedFilerType.value} onChange={this.handleFilerTypeSelected.bind(this)}>
      {renderSelectionOptions(listOfFilerTypes, "Filer Type")}
    </select>
  }

  renderPersonalProfile(taxReturn){
    return (
      <form class="standard-form">
        <label for="user-first-name">First Name &amp; Initials</label>
        <input id="user-first-name" ref={(input) => {this.firstName = input;}} type="text"  placeholder="First Name" defaultValue={taxReturn.first_name ? taxReturn.first_name:''} />
        <label for="user-last-name">Last Name</label>
        <input id="user-last-name" ref={(input) => {this.lastName = input;}} type="text"  placeholder="Last Name" defaultValue={taxReturn.last_name? taxReturn.last_name:''} />

        <label for="user-province-of-residence">Province Of Residence</label>
        <input id="user-province-of-residence" ref={(input) => {this.provinceOfResidence = input;}} type="text"  placeholder="Province of residence" maxLength="2" defaultValue={taxReturn.province_of_residence ? taxReturn.province_of_residence:''} />
          <label for="user-canadian-citizen">Canadian Citizen</label>
        <input id="user-canadian-citizen" ref={(input) => {this.canadianCitizen = input;}} type="checkbox"   defaultValue={taxReturn.canadian_citizen ? taxReturn.canadian_citizen:false} />
        <label for="user-filer-type">Filer Type</label>
        {this.renderFilerType(taxReturn.filer_type)}

        <button id={taxReturn.id} data-id={taxReturn.id} onClick={this.updateTaxReturn}>update profile</button>
      </form>
    );
  }

  handleClickTaxReturnProfile(e) {
    e.preventDefault();
    
    this.props.dispatch(fetchTaxReturn(e.target.dataset.id));
  }

  render() {
      // TODO: move to a helper
      const { user, taxReturns, taxReturn } = this.props;
      let userOutput='';

      if (!taxReturn) {
          userOutput = <div></div>
      } else if (!user.id) {
          userOutput=<div>No User Id</div>
      } else {
          userOutput= this.renderPersonalProfile(taxReturn);
      }
      return (
          <main class="grid-container row">
              <Sidebar activeScreen="personalProfile" userId={this.props.params.userId}/>
              <section class="col-sm-8 col-lg-9">
                  <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn} handleClickTaxReturnProfile={this.handleClickTaxReturnProfile.bind(this)} />
                  <h1>Personal Profile</h1>
                  {userOutput}
              </section>
          </main>
      );
  }
}
