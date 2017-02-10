import React from "react"
import _ from "lodash";

import { connect } from "react-redux"
import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchAllTaxReturnStatuses, updateTaxReturn } from "../../actions/taxReturnActions";

import { loadUser, loadUserQuote } from "../../actions/loaderActions";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";
import QuoteDetails from "./QuoteDetails"
import BillingStatusRow from "./BillingStatusRow"
import { directDownloadChecklistItems, deleteDocument, uploadDocument } from "../../actions/uploadsActions";
import { uploadAdminDocument } from "../../actions/checklistActions";
import { saveBlob } from "../../lib/saveBlob";

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

  handleUploadItem(quoteId, taxReturnId, checklistId, uploadFile, documents) {
      if(documents && documents.length>0) {
        // delete all the old documents
        _.each(documents, (doc) => {
          let documentId = doc.documentId;
          this.props.dispatch(deleteDocument(quoteId,documentId));
        });
      }

      this.props.dispatch(uploadAdminDocument(quoteId, taxReturnId, checklistId, uploadFile));
  }

  handleDownloadItem(quoteId, documentId,documentName) {

    directDownloadChecklistItems(quoteId,documentId)
        .then((response) => {
          const data = response.data;
          const fileName = documentName;

          saveBlob(fileName, response);
        });
  }

  handleDeleteItem(quoteId,docs,documentName) {
     if(confirm("are you sure you want to delete document '"+documentName+"'?")) {
      _.each(docs,(doc) => {
        let documentId = doc.documentId;

        this.props.dispatch(deleteDocument(quoteId,documentId));
      });
    } else {
      console.log('not deleted');
    }
  }


  /// pass to children
  handleUpdateTaxReturnStatus(taxReturnId,results) {
    this.props.dispatch(updateTaxReturn(taxReturnId,results));
  }

  renderBillingStatusTable(taxReturns, quotes, adminChecklist, statuses) {
    if(!taxReturns || taxReturns.length===0) {
      return <div>
        No Tax returns
        </div>
    }

    const tableRows = taxReturns.map((taxReturn) => {
      let quote = quotes? quotes : {};

      let taxReturnChecklist =  adminChecklist && adminChecklist.checklistitems ?  _.filter(adminChecklist.checklistitems,(ac) => {
        return ac.tax_return_id === taxReturn.id;
      }) : [];

      return <BillingStatusRow taxReturn={taxReturn} quote={quote} statuses={statuses} taxReturnAdminChecklist={taxReturnChecklist} submitFunction={this.updateTaxReturnStatus} uploadItemFunction={this.uploadItem} downloadItemFunction={this.downloadItem} deleteItemFunction={this.deleteItem}  ></BillingStatusRow>
    });
      
    return (<div >{tableRows}</div>);
  }

  render() {
    //todo, figure out what "No documents added to this package" means
    //todo, pass in data to table
    const { taxReturns, taxReturn, quotes, adminChecklist, taxReturnStatuses} = this.props;
    return (
      <main class="grid-container row">
        <Sidebar activeScreen="billingStatus" userId={this.props.params.userId}/>
        <section class="col-sm-8 col-lg-9">
          <h1></h1>
          <h2></h2>
          {this.renderBillingStatusTable(taxReturns, quotes, adminChecklist, taxReturnStatuses)}
        </section>
      </main>
    )
  }
}
