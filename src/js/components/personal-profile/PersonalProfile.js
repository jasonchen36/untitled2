import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";
import { fetchUser } from "../../actions/usersActions";
import { fetchTaxReturn, updateTaxProfile } from "../../actions/taxReturnActions";
import { loadUser } from "../../actions/loaderActions";
import { renderErrors } from "../helpers/RenderErrors";
import { renderSelectionOptions } from "../helpers/LayoutHelpers";
import moment_timezone from "moment-timezone";

const updateState = { initialized:0, updating:1, updated:2};

@connect((store) => {
  return {
    loginuser: store.loginuser.loginuser,
    loginuserFetched: store.loginuser.fetched,
    user: store.users.user,
    account:store.accounts.account,
    taxReturns:store.accounts.taxReturns,
    taxReturn:store.accounts.taxReturn,
    taxReturnDetailsFetched: store.accounts.taxReturnDetailsFetched,
    taxReturnUpdated: store.accounts.taxReturnUpdated,
    updating: store.accounts.updating,
    accountError: store.accounts.error
  };
})

export default class PersonalProfile extends React.Component {
  constructor() {
    super();
    this.updateTaxReturn = this.handleUpdateTaxProfile.bind(this);
    this.clickTaxReturnProfile = this.handleClickTaxReturnProfile.bind(this);
    this.clickInputChange = this.handleClickInputChange.bind(this);
    this.selectedFilerType = { value:"other"};
    this.authorizeCra = {value:0};
    this.canadianCitizen = {value:0};
    this.taxReturnUpdateState = {value:updateState.initialized};
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
    this.props.dispatch(loadUser(userId));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.account_id && nextProps.account &&
      nextProps.taxReturn && this.props.taxReturn) {
        // Update the form with Props if a previous user was loaded
      this.updateLocalProps(nextProps.taxReturn);
    } else {
      // If no previous user was loaded, then default Values will handle loading the form
    }

    this.taxReturnUpdateState.value = this.getUpdatedState(nextProps.updating, nextProps.taxReturnUpdated);
  };

  // Local updated state, to set the form button text
  getUpdatedState(updating, updated) {
    let taxReturnUpdateState = updateState.initialised;

    if (updating) {
      taxReturnUpdateState = updateState.updating;
    } else if(!updating && updated) {
        taxReturnUpdateState = updateState.updated;
    } else {
      taxReturnUpdateState = updateState.initialised;
    }

    return taxReturnUpdateState;
  }

  /// update all the form with the values from the user (prop)
  updateLocalProps(taxReturn) {
    // tax profile props

    this.prefix.value = taxReturn.prefix;
    this.firstName.value= taxReturn.first_name;
    this.middleInitial.value = taxReturn.middle_initial;
    this.lastName.value = taxReturn.last_name;
    this.provinceOfResidence.value = taxReturn.province_of_residence;
    this.dateOfBirth.value = taxReturn.date_of_birth ? moment(taxReturn.date_of_birth).format('YYYY-MM-DD'):'';
    this.canadianCitizen.value = taxReturn.canadian_citizen;
    this.authorizeCra.value = taxReturn.authorize_cra;
    this.sin.value = taxReturn.SIN ? taxReturn.SIN : '';
    this.selectedFilerType.value = taxReturn.filer_type;

    // address props
    const address = taxReturn.address ? taxReturn.address : {};

    this.addressLine1.value = address.address_line1 ? address.address_line1: '';
    this.city.value = address.city ? address.city : '';
    this.postalCode.value = address.postal_code ? address.postal_code : '';
    this.province.value = address.providence ? address.providence : '';
    this.country.value = address.country ? address.country : '';
  };

  fetchUser(userId) {
    this.props.dispatch(fetchUser(userId))
  };

  handleUpdateTaxProfile(e) {
    e.preventDefault();

    let { id, addressId } = e.target.dataset;
    let updateTaxProfileParams = {
      prefix: this.prefix.value,
      firstName: this.firstName.value,
      middleInitial: this.middleInitial.value,
      lastName: this.lastName.value,
      provinceOfResidence: this.provinceOfResidence.value,
      dateOfBirth: moment_timezone.tz(this.dateOfBirth.value, "America/Toronto").format('YYYY-MM-DD'),
      canadianCitizen: this.canadianCitizen.value,
      authorizeCra: this.authorizeCra.value,
      sin: this.sin.value,
      filerType: this.selectedFilerType.value
    };

    let updateAddressParams = {
      addressLine1: this.addressLine1.value,
      city: this.city.value,
      postalCode: this.postalCode.value,
      province: this.province.value,
      country: this.country.value
    };


    this.props.dispatch(updateTaxProfile(id,updateTaxProfileParams, addressId, updateAddressParams))
  }

  handleFilerTypeSelected(e) {
    var selected =  e.target.value;
    this.selectedFilerType.value = selected;

    this.taxReturnUpdated.value = false;
    this.setState({value:this.selectedFilerType.value});
  }

  handleClickInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this[name].value = value;

    this.setState({
      value: value
    });
  }

  renderFilerType(filerType) {
    const listOfFilerTypes = [{id:"primary",val:"primary"},{id:"spouse",val:"spouse"},{id:"other",val:"other"}];

    return <select value={this.selectedFilerType.value} onChange={this.handleFilerTypeSelected.bind(this)}>
      {renderSelectionOptions(listOfFilerTypes, "Choose Filer Type")}
    </select>
  }

  renderAddress(address) {
    address = address? address : {};

    return  <div>
        <p>
          Address
        </p>
        <label for="user-address-line1">Address Line 1</label>
        <input id="user-address-line1" ref={(input) => {this.addressLine1 = input;}} type="text"  placeholder="Address Line 1" />
        <label for="user-address-city">City</label>
        <input id="user-address-city" ref={(input) => {this.city = input;}} type="text"  placeholder="City"  />
        <label for="user-address-province">Province</label>
        <input id="user-address-province" maxLength="2" ref={(input) => {this.province = input;}} type="text"  placeholder="Province" />
        <label for="user-address-postal-code">Postal Code</label>
        <input id="user-address-postal-code" ref={(input) => {this.postalCode = input;}} type="text"  placeholder="City" />
        <label for="user-address-country">Country</label>
        <input id="user-address-country" ref={(input) => {this.country = input;}} type="text"  placeholder="Country" defaultValue={address.country ? address.country:''} />
      </div>
  }

  renderPersonalProfile(taxReturn){
    return (
      <form class="standard-form">
        <label for="user-prefix">Prefix</label>
        <input id="user-prefix" ref={(input) => {this.prefix = input;}} type="text"  placeholder="Prefix ('Mr.','Mrs.','Miss','Ms.','Dr.')" defaultValue={taxReturn.prefix ? taxReturn.prefix:''} />
        <label for="user-first-name">First Name</label>
        <input id="user-first-name" ref={(input) => {this.firstName = input;}} type="text"  placeholder="First Name" defaultValue={taxReturn.first_name ? taxReturn.first_name:''} />
        <label for="user-middle-initial">Middle Initial</label>
        <input id="user-middle-initial" maxLength="1" ref={(input) => {this.middleInitial = input;}} type="text"  placeholder="Middle Initial" defaultValue={taxReturn.middle_initial ? taxReturn.middle_initial:''} />
        <label for="user-last-name">Last Name</label>
        <input id="user-last-name" ref={(input) => {this.lastName = input;}} type="text"  placeholder="Last Name" defaultValue={taxReturn.last_name? taxReturn.last_name:''} />
        <label for="user-province-of-residence">Province Of Residence</label>
        <input id="user-province-of-residence" ref={(input) => {this.provinceOfResidence = input;}} type="text"  placeholder="Province of residence" maxLength="2" defaultValue={taxReturn.province_of_residence ? taxReturn.province_of_residence:''} />
        <label for="user-date-of-birth">Date of Birth</label>
        <input id="user-date-of-birth" ref={(input) => {this.dateOfBirth = input;}} type="text"  placeholder="Date of Birth (YYYY-MM-DD)" defaultValue={taxReturn.date_of_birth ? taxReturn.date_of_birth:''} />
        <label for="user-sin">Social Insurance Number</label>
        <input id="user-sin" ref={(input) => {this.sin = input;}} type="text" placeholder="Social Insurance Number"   defaultValue={taxReturn.SIN ? taxReturn.SIN: false} />
        <label for="user-canadian-citizen">Canadian Citizen</label>
        <input id="user-canadian-citizen" name="canadianCitizen" checked={this.canadianCitizen.value} onChange={this.clickInputChange} type="checkbox" />
        <label for="user-authorize-cra">Authorize Cra</label>
        <input id="user-authorize-cra" name="authorizeCra" checked={this.authorizeCra.value} onChange={this.clickInputChange} type="checkbox" />
        <label for="user-filer-type">Filer Type</label>
        {this.renderFilerType(taxReturn.filer_type)}
        <hr/>
        {this.renderAddress(taxReturn.address)}
        {this.renderFormButton(taxReturn,this.taxReturnUpdateState)}
      </form>
    );
  }

  renderFormButton(taxReturn,taxReturnUpdateState) {
    let buttonText = "update profile";

    if(taxReturnUpdateState.value===updateState.updating) {
      buttonText="updating";
    } else if(taxReturnUpdateState.value===updateState.updated) {
      buttonText="updated";
    }

    return <button id={taxReturn.id} data-id={taxReturn.id} data-address-id={taxReturn.address ? taxReturn.address.id:-1} onClick={this.updateTaxReturn} className={taxReturnUpdateState.value===updateState.updated ? "flash" : ""} >{buttonText}</button>
  }

  handleClickTaxReturnProfile(e) {
    e.preventDefault();

    this.props.dispatch(fetchTaxReturn(e.target.dataset.id));
  }

  render() {
      const { user, taxReturns, taxReturn, taxReturnUpdated, accountError } = this.props;
      let userOutput='';

      if (!taxReturn) {
          userOutput = <div></div>
      } else if (!user.id) {
          userOutput=<div>No User Id</div>
      } else {
        userOutput= this.renderPersonalProfile(taxReturn, taxReturnUpdated);
      }

      return (
          <main class="grid-container row">
              <Sidebar activeScreen="personalProfile" userId={this.props.params.userId}/>
              <section class="col-sm-8 col-lg-9">
                  <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn} handleClickTaxReturnProfile={this.clickTaxReturnProfile} />
                  <h1>Personal Profile</h1>
                  {userOutput}
                  {renderErrors(accountError)}
              </section>
          </main>
      );
  }
}
