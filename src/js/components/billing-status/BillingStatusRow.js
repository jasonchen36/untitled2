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
      return <div></div>
    } else {
      return <div class="status-direct-deposit">Direct Deposit</div>
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


  renderBillingStatusRow(taxReturn, quote, statuses, taxReturnAdminDownloads, submitFunction, uploadItemFunction, downloadItemFunction, deleteItemFunction) {
    const quoteId = quote.id;

    const showDetails = (sd, detailId) => {
      return _.some(sd.value,(detail) => { return detail===detailId; });
    };

    const adminUploads = _.map(taxReturnAdminDownloads, (download) => {
        
          return <QuoteAdminUploads key={download.id} quote={quote} taxReturn={taxReturn} document={download} uploadItemFunction={uploadItemFunction} downloadItemFunction={downloadItemFunction} deleteItemFunction={deleteItemFunction} />
    });

    return (
      <div data-quote-id={quote.id} >
        <div data-quote-id={quote.id} onClick={this.toggleDetails}>
          <div class="status-name">
            {taxReturn.first_name}{taxReturn.last_name ? ' ' : ''}{taxReturn.last_name} - { quote.text }
          </div>
          <div class="status-dollar">
            ${quote.value}
          </div>
          <div class="status">
            Status: { taxReturn && taxReturn.status ? taxReturn.status.name : 'no status'}
          </div>
          { this.renderDirectDeposit(false) }
        </div>
        <hr />
        <div class={this.showDetails.value ? "show" : "hide" } >
          <QuoteDetails quote={quote} taxReturn={taxReturn} statuses={statuses} submitFunction={submitFunction} />
          { adminUploads }
          <hr/>    
        </div>
      </div>
    );
  }

  render() {
    //todo, figure out what "No documents added to this package" means
    //todo, pass in data to table
    const { taxReturn, quote, statuses, submitFunction, uploadItemFunction, downloadItemFunction, deleteItemFunction, taxReturnAdminDownloads } = this.props;
   
    return <div>
      {this.renderBillingStatusRow(taxReturn,quote, statuses, taxReturnAdminDownloads, submitFunction, uploadItemFunction, downloadItemFunction, deleteItemFunction)}
    </div>
  }
}
