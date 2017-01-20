import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchChecklistPdf, directDownloadChecklistPdf } from "../../actions/downloadActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";
import { saveBlob } from "../../lib/saveBlob";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        quoteChecklistPdf: store.accounts.quoteChecklistPdf
    };
})

export default class Checklist extends React.Component {

    constructor() {
        super();
        this.clickDownloadChecklist = this.handleClickDownloadChecklist.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(fetchUser(this.props.params.userId));
    };

    componentWillReceiveProps(nextProps) {
        // todo: should load taxreturn
        //todo, stuck in infinite loop getting account
        // if(nextProps.user && nextProps.user.account_id && (!nextProps.account || nextProps.account.accountId!=nextProps.user.account_id)) {
        //     this.props.dispatch(fetchAccount(nextProps.user.account_id));
        // }
        //
        // if(nextProps.taxReturns && !nextProps.taxReturn && nextProps.taxReturns.length>0) {
        //     this.props.dispatch(fetchTaxReturn(nextProps.taxReturns[0].id));
        // }
        //
        // if (nextProps.taxReturn && this.props.taxReturn) {
        //     // Update the form with Props if a previous user was loaded
        //     // this.updateLocalProps(nextProps.taxReturn);
        // } else {
        //     // If no previous user was loaded, then default Values will handle loading the form
        // }
    };

    handleClickDownloadChecklist(e) {
      let { quoteId } = e.target.dataset;

      directDownloadChecklistPdf(quoteId)
        .then((response) => {
          const data = response.data;
          let fileName = "Checklist-"+quoteId + '.pdf';
          fileName = "Checklist.pdf";

          saveBlob(fileName, response);
        });
    }

    renderChecklist(){
        //todo, get checklist url
        return (
            <div>
                <a class="fa-anchor-container" data-quote-id={21} onClick={this.clickDownloadChecklist}>
                    <i class="fa fa-file-pdf-o"></i> Print
                </a>
            </div>
        )
    }

    render() {
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="checklist" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Checklist</h1>
                    {this.renderChecklist()}
                </section>
            </main>
        )
    }
}
