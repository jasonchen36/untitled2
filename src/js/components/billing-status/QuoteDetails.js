import React from "react"
import { IndexLink, Link } from "react-router";

import { createLoginuser } from "../../actions/loginuserActions"
import { renderErrors } from "../helpers/RenderErrors";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.handleDeleteItem.bind(this);
    this.downloadItem = this.handleDownloadItem.bind(this);
    this.uploadItem = this.handleUploadItem.bind(this);
    this.statusSelected = this.handleStatusSelected.bind(this);
    this.submitChanges = this.handleSubmitChanges.bind(this);
    this.clickInputChange = this.handleClickInputChange.bind(this);

    this.selectedStatus = {value:5};
    this.quoteValue = {value:0};
    this.quoteDetails = {value:''};
  }

  componentWillReceiveProps(nextProps) {
    const { taxReturn, quote } = nextProps;

    if(taxReturn && taxReturn.status) {
      this.selectedStatus.value = taxReturn.status.id;
    } else {
      this.selectedStatus.value = quote.value;
    }

    this.quoteValue.value = quote.value; 
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
      status_id: this.selectedStatus.value,
      value: this.quoteValue.value,
      details: this.quoteDetails.value
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
         <i class="fa fa-trash-o"></i>
      </a>
    </div>
  };


  renderQuoteDetails(quote, taxReturn, statuses, errors) {
    const inputId = (text,id) => {
      return text + '-' + id;
    }

    const id = quote.id;

    return (
      <div data-id={quote.id}> 
        <form>
          <label for={inputId("status",id)}>Status:</label>
          <select class="col" name="selectedStatus" onChange={this.clickInputChange} value={this.selectedStatus.value}>
            {renderTaxReturnStatusSelectionOptions(statuses)}        
          </select>

          <label for={inputId("return",id)}>Return: </label>
          $<input id={inputId("return",id)} type="number" name="quoteValue" placeholder="return" value={this.quoteValue.value} onChange={this.clickInputChange} />

          <label for={inputId("details",id)}>Details:</label>
          <textarea rows="3" id={inputId("details",id)} name="quoteDetails" placeholder="details" value={this.quoteDetails.value} onChange={this.clickInputChange}  />

          <button id={inputId("submit",id)} data-tax-return-id={taxReturn.id} class="button" type="submit" onClick={this.submitChanges}>Save</button>
        </form>
        {renderErrors(errors)}
      </div>
    )
  }

  render() {
    const { quote, taxReturn, statuses, errors } = this.props;

    return (
      <main class="grid-container row">
        { this.renderQuoteDetails(quote, taxReturn, statuses,errors) }
      </main>
    );
  };
}

