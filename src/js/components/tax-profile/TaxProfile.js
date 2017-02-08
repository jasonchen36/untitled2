import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";
import { saveBlob } from "../../lib/saveBlob";
import { loadUser } from "../../actions/loaderActions";

import { directDownloadTaxProfiles } from "../../actions/taxProfilesActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,   
        user: store.users.user,
        account:store.accounts.account,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        taxReturnDetailsFetched: store.accounts.taxReturnDetailsFetched
    };
})

export default class TaxProfile extends React.Component {

    constructor() {
      super();
      this.clickTaxReturnProfile = this.handleClickTaxReturnProfile.bind(this);  
      this.clickDownloadTaxProfileCsv = this.handleClickDownloadTaxProfileCsv.bind(this);
    }

    componentWillMount() {
      const userId = this.props.params.userId;

      this.props.dispatch(loadUser(userId));
    };

    componentWillReceiveProps(nextProps) {
    };

    renderTaxProfile(taxReturn){
        //todo, get export urls
        if(!taxReturn) {
          return <div>
              No Tax Profile Loaded
            </div>

        }

        return (
            <div>
                <a class="fa-anchor-container" data-tax-return-id={taxReturn.id} onClick={this.clickDownloadTaxProfileCsv}>
                    <i class="fa fa-file-excel-o"></i>Export CSV
                </a>
            </div>
        );
       // <a class="fa-anchor-container">
       //             <i class="fa fa-file-pdf-o"></i>Export PDF
       //         </a>

    }

    handleClickDownloadTaxProfileCsv(e) {
      let { taxReturnId } = e.currentTarget.dataset;
     
      directDownloadTaxProfiles(taxReturnId)
        .then((response) => {
          const data = response.data;
          const fileName = 'taxProfile'+taxReturnId+'.csv';

          saveBlob(fileName, response);
        });
    }

  handleClickTaxReturnProfile(e) {
    e.preventDefault();
    
    this.props.dispatch(fetchTaxReturn(e.target.dataset.id));
  }

    render() {
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="taxProfile" userId={this.props.params.userId}/>
                <section id="tax-profile-container" class="col-sm-8 col-lg-9">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}  handleClickTaxReturnProfile={this.clickTaxReturnProfile} />
                    <h1>Tax Profile</h1>
                    {this.renderTaxProfile(taxReturn)}
                </section>
            </main>
        )
    }
}
