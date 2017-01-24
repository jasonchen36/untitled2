import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import { Link  } from "react-router";

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { currentYearProductId } from "../../config";

import { fetchUser } from "../../actions/usersActions";
import { fetchChecklistPdf, directDownloadChecklistPdf } from "../../actions/checklistActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";
import { saveBlob } from "../../lib/saveBlob";

import { loadAccountIfNeeded } from "../loaders/loadUser";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        quoteChecklistPdf: store.accounts.quoteChecklistPdf,
        account: store.accounts.account,
        taxReturnDetailsFetched: store.accounts.taxReturnDetailsFetched
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
      loadAccountIfNeeded(nextProps, this.props);
    };

    handleClickDownloadChecklist(e) {
      let { quoteId } = e.target.dataset;

      directDownloadChecklistPdf(quoteId)
        .then((response) => {
          const data = response.data;
          let fileName = "Checklist-"+quoteId + '.pdf';

          saveBlob(fileName, response);
        });
    }

    renderChecklist(quote){
      //todo, get checklist url
      if(quote && quote.id) {
        return (
            <div>
                <a class="fa-anchor-container" data-quote-id={quote.id} onClick={this.clickDownloadChecklist}>
                    <i class="fa fa-file-pdf-o"></i> Print
                </a>
            </div>
        )
      } else {
        return <div>
          <p>
            {"No Quote for this account"}
          </p>
        </div>
      }
    }

    render() {
        const { taxReturns, taxReturn, account} = this.props;
        const currentProductId = currentYearProductId ? currentYearProductId : 10;

        const quote = account && account.quotes  ? _.find(account.quotes, (quote) => { return quote.product_id === currentProductId; }) : undefined;

        return (
            <main class="grid-container row">
                <Sidebar activeScreen="checklist" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1>Checklist</h1>
                    {this.renderChecklist(quote)}
                </section>
            </main>
        )
    }
}
