import React from "react"
import _ from "lodash";

import { connect } from "react-redux"
import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchAllTaxReturnStatuses, updateTaxReturnStatus } from "../../actions/taxReturnActions";

import { loadUser, loadUserQuote } from "../../actions/loaderActions";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";
import QuoteDetails from "./QuoteDetails"
import BillingStatusRow from "./BillingStatusRow"
import { directDownloadChecklistItems, deleteDocument, uploadDocument } from "../../actions/uploadsActions";

@connect((store) => {
  return {
    loginuser: store.loginuser.loginuser,
    user: store.users.user,
    taxReturns:store.accounts.taxReturns,
    taxReturn:store.accounts.taxReturn,
    quotes:store.quotes.quotes,
    taxReturnStatuses : store.accounts.taxReturnStatuses,
    adminChecklist: store.checklists.adminChecklist,
    adminChecklistFetched: store.checklists.adminChecklistFetched,
    adminChecklistFetching: store.checklists.adminChecklistFetching
  };
})

export default class BillingStatus extends React.Component {
  constructor() {
    super();
    this.showDetails ={value:false};
    this.updateTaxReturnStatus = this.handleUpdateTaxReturnStatus.bind(this);
    this.uploadItem = this.handleUploadItem.bind(this);
    this.downloadItem = this.handleDownloadItem.bind(this);
    this.deleteItem = this.handleDeleteItem.bind(this);
  }

  componentWillMount() {
    const userId = this.props.params.userId;

    this.props.dispatch(loadUserQuote(userId));
    this.props.dispatch(fetchAllTaxReturnStatuses());  
    
  };

  componentWillReceiveProps(nextProps) {
  };

  handleUploadItem(quoteId, taxReturnId, checklistId, uploadFile) {
      this.props.dispatch(uploadDocument(quoteId, taxReturnId, checklistId, uploadFile));
  }

  handleDownloadItem(quoteId, documentId,documentName) {
    // TODO: fix to real one
    quoteId = 14;
    documentId=408;

    directDownloadChecklistItems(quoteId,documentId)
        .then((response) => {
          const data = response.data;
          const fileName = documentName;

          saveBlob(fileName, response);
        });
  }

  handleDeleteItem(quoteId,documentId,documentName) {
     if(confirm("are you sure you want to delete document '"+documentName+"'?")) {
      // TODO: enable
//      this.props.dispatch(deleteDocument(quoteId,documentId));
    } else {
    }
  }


  /// pass to children
  handleUpdateTaxReturnStatus(taxReturnId,results) {
    this.props.dispatch(updateTaxReturnStatus(taxReturnId,results));
  }

  renderBillingStatusTable(taxReturns, quotes, statuses) {
    if(!taxReturns || taxReturns.length===0) {
      return <div>
        No Tax returns
        </div>
    }

    const tableRows = taxReturns.map((taxReturn) => {
      let quote = quotes?  _.find(quotes.quoteLineItems, (q) => {
          return q.tax_return_id === taxReturn.id; 
        }) : {}; 

  // TODO get from a call.
    const adminDownloads = [ {id:1, name:'Tax Summary', checklist_id:4},
      { id:2, name:'Signed Document', checklist_id:5},
      {id:3, name:'Tax Return', checklist_id:6}
    ];

      return <BillingStatusRow taxReturn={taxReturn} quote={quote} statuses={statuses} taxReturnAdminDownloads={adminDownloads} submitFunction={this.updateTaxReturnStatus} uploadItemFunction={this.uploadItem} downloadItemFunction={this.downloadItem} deleteItemFunction={this.deleteItem}  ></BillingStatusRow>
    });
      
    return (<div >{tableRows}</div>);
  }

  render() {
    //todo, figure out what "No documents added to this package" means
    //todo, pass in data to table
    const { taxReturns, taxReturn, quotes, taxReturnStatuses} = this.props;
    return (
      <main class="grid-container row">
        <Sidebar activeScreen="billingStatus" userId={this.props.params.userId}/>
        <section class="col-sm-8 col-lg-9">
          <h1></h1>
          <h2></h2>
          {this.renderBillingStatusTable(taxReturns, quotes, taxReturnStatuses)}
        </section>
      </main>
    )
  }
}
