import React from "react"
import { IndexLink, Link } from "react-router";

import { createLoginuser } from "../../actions/loginuserActions"
import { renderErrors } from "../helpers/RenderErrors";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";
import { initUpdateState, renderUpdateButton, updateState } from "../helpers/RenderUpdateButton";
import { renderSelectionOptions } from "../helpers/LayoutHelpers";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.handleDeleteItem.bind(this);
    this.downloadItem = this.handleDownloadItem.bind(this);
    this.uploadItem = this.handleUploadItem.bind(this);
    this.statusSelected = this.handleStatusSelected.bind(this);
    this.submitChanges = this.handleSubmitChanges.bind(this);
    this.clickInputChange = this.handleClickInputChange.bind(this);

    this.selectedStatus = {value:-1};
    this.taxReturnRefund = {value:0};
    this.taxReturnDetails = {value:''};
    this.updateState = {value:null};    
  }

  componentWillReceiveProps(nextProps) {
    const { taxReturn, quote } = nextProps;

    if(taxReturn && taxReturn.status) {
      this.selectedStatus.value = taxReturn.status.id;
    } else {
      this.selectedStatus.value = 0;
    }

    this.taxReturnRefund.value = taxReturn.refund; 
    this.taxReturnDetails.value = taxReturn.details;
    this.updateState.value = updateState(nextProps.updating, nextProps.updated);
    
  };
  

  handleUploadItem(e) {
    let { quoteId } = e.target.dataset;
  }

  handleDownloadItem(e) {
    let { quoteId } = e.target.dataset;
  }

  handleDeleteItem(e) {
    let { quoteId } = e.target.dataset;
  }

  handleStatusSelected(e) {
    e.preventDefault();
    const selected=  e.target.value;
  }

  handleSubmitChanges(e) {
    e.preventDefault();

    //TODO: submit correctly
    let data = {
      statusId: this.selectedStatus.value,
      refund: this.taxReturnRefund.value,
      details: this.taxReturnDetails.value
    };

    let { taxReturnId } = e.target.dataset;


    this.props.submitFunction(taxReturnId, data);
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

  renderDownloadTaxSummary(data) {
    return <div>
      <a class="tax-summary" data-quote-id={data.id}  data-document-name={data.name} onClick={this.downloadItem}>           
        Tax Summary
      </a>
      <a class="tax-summary" data-quote-id={data.id} data-document-name={data.name} onClick={this.uploadItem}>           
        Upload
      </a>
      <a class="tax-summary" data-quote-id={data.id} data-document-name={data.name} onClick={this.deleteItem}>
        <div class="tax-item-trash">
          <i class="fa fa-trash-o"></i>
        </div>
      </a>
    </div>
  };

  renderStatus(taxReturn, statuses) {
    let filteredStatuses = _.filter(statuses, (s) => {

      return  s.id===taxReturn.status.id || 
        _.some(taxReturn.statusChanges,(sc) => {
          return s.id===sc.end_status_id 
        });
    });

    filteredStatuses = _.map(filteredStatuses, 
      (fs) => {
        return {
          id: fs.id,
          val: fs.name
        };
    });

    return <select class="col picker-details-status" name="selectedStatus" onChange={this.clickInputChange} value={this.selectedStatus.value}>
      {renderSelectionOptions(filteredStatuses, "select status")}        
    </select>
  }

  renderQuoteDetails(quote, taxReturn, statuses, errors) {
    const inputId = (text,id) => {
      return text + '-' + id;
    }

    const id = quote.id;
   

    return (
      <div data-id={quote.id} class="full-width">
        <form id={inputId("form",id)} data-tax-return-id={taxReturn.id} onSubmit={this.submitChanges}>
          <label for={inputId("status",id)}>STATUS:</label>
          { this.renderStatus(taxReturn,statuses) }

          <input id={inputId("return",id)} class="textfield-tax-refund" type="number" name="taxReturnRefund" placeholder="return" value={this.taxReturnRefund.value} onChange={this.clickInputChange} />
          <div class="quote-details-container">
            <label for={inputId("details",id)}>DETAILS:</label>
            <textarea rows="3" id={inputId("details",id)} name="taxReturnDetails" placeholder="Details" value={this.taxReturnDetails.value} onChange={this.clickInputChange}  />
          </div>
          { renderUpdateButton(this.updateState,"Save", "Saving", "Saved", "button-save") }
        </form>
        {renderErrors(errors)}
      </div>
    )
  }

  render() {
    const { quote, taxReturn, statuses, errors } = this.props;

    return (
      <main class="grid-container row  no-padding">
        { this.renderQuoteDetails(quote, taxReturn, statuses,errors) }
      </main>
    );
  };
}

