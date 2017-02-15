import React from "react"
import _ from "lodash";

import { connect } from "react-redux"
import { Link } from "react-router"

import QuoteDetails from "./QuoteDetails"
import QuoteAdminUploads from "./QuoteAdminUploads"

export default class Layout extends React.Component {
  constructor() {
    super();
    this.toggleDetails = this.handleToggleDetails.bind(this);
    this.showDetails ={value:false};
  }

  renderDirectDeposit(hasDirectDeposit) {
    if(!hasDirectDeposit) {
      return <div class="status-container"></div>
    } else {
      return <div class="status-container">
              <i class="fa fa-check-circle" aria-hidden="true"></i>
              <div class="status-direct-deposit f--futura-book">Direct Deposit</div>
            </div>;
    }
  }

  handleToggleDetails(e) {
    const { quoteId } = e.target.dataset;
    const id = quoteId;

    this.showDetails.value = this.showDetails.value === false ? true: false;

    // Refresh 
    this.setState({
      value: this.showDetails
    });
  }


  renderBillingStatusRow(taxReturn, quote, statuses, taxReturnAdminChecklist, submitFunction, uploadItemFunction, downloadItemFunction, deleteItemFunction, checklistUpdating, checklistUpdated, taxReturnUpdated, taxReturnUpdating) {
    const quoteId = quote.id;

    const showDetails = (sd, detailId) => {
      return _.some(sd.value,(detail) => { return detail===detailId; });
    };

    const adminUploads = _.map(taxReturnAdminChecklist, (checklist) => {
      let updating = _.some(checklistUpdating, (u) => {
        return u.checklistId === checklist.checklist_item_id && u.taxReturnId === taxReturn.id });
      let updated = _.some(checklistUpdated,(u) => { return u.checklistId === checklist.checklist_item_id && u.taxReturnId === taxReturn.id });

      return <QuoteAdminUploads key={checklist.checklist_item_id} quote={quote} taxReturn={taxReturn} checklist={checklist} uploadItemFunction={uploadItemFunction} downloadItemFunction={downloadItemFunction} deleteItemFunction={deleteItemFunction} updating={updating} updated={updated} />
    });

    const directDepositStatus = _.map(quote.quoteLineItems, (lineItems) =>{
        if(lineItems.tax_return_id == taxReturn.id){
          if(lineItems.checkbox == 1){
                return this.renderDirectDeposit(true);
            } else {
                return this.renderDirectDeposit(false);
            }
        }
    });

    return (
      <div data-quote-id={quoteId} >
        <div data-quote-id={quoteId} onClick={this.toggleDetails}>
          <div class="status-container">
            <div class="status-name f--futura-book">
              {taxReturn.first_name}{taxReturn.last_name ? ' ' : ''}{taxReturn.last_name}
            </div>
            <div class="status f--futura-book">
              STATUS: <span class="status-value">{ taxReturn && taxReturn.status ? taxReturn.status.name : 'no status'}</span>
            </div>
          </div>
          { directDepositStatus }
          <div class="status-dollar">
            <div class={taxReturn.refund < 0 ? "font-red" : ""}>
              {taxReturn.refund < 0 ? "-" + "$" + Math.abs(taxReturn.refund) : "" + "$" + Math.abs(taxReturn.refund)}
            </div>
          </div>
        </div>
        <hr />
        <div class={this.showDetails.value ? "show" : "hide" } >
          <QuoteDetails quote={quote} taxReturn={taxReturn} statuses={statuses} submitFunction={submitFunction} updated={taxReturnUpdated} updating={taxReturnUpdating} />
          { adminUploads }
          <hr/>    
        </div>
      </div>
    );
  }

  render() {
    //todo, figure out what "No documents added to this package" means
    //todo, pass in data to table
    const { taxReturn, quote, statuses, submitFunction, uploadItemFunction, downloadItemFunction, deleteItemFunction, taxReturnAdminChecklist, checklistUpdating, checklistUpdated, taxReturnUpdated, taxReturnUpdating } = this.props;
   
    return <div>
      {this.renderBillingStatusRow(taxReturn,quote, statuses, taxReturnAdminChecklist, submitFunction, uploadItemFunction, downloadItemFunction, deleteItemFunction, checklistUpdating, checklistUpdated, taxReturnUpdated, taxReturnUpdating)}
    </div>
  }
}
