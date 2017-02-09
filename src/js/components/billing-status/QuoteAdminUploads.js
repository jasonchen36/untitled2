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
    this.uploadItemSelected = this.handleUploadItemSelected.bind(this);
    this.uploadedFile = {value: undefined};

  }

  componentWillReceiveProps(nextProps) {
  };
  

  handleUploadItem(e) {
    e.preventDefault();    
    let { quoteId,  taxReturnId, checklistId, docName } = e.target.dataset;

    //quoteId, taxReturnId, checklistId,uploadFile
    this.props.uploadItemFunction(quoteId, taxReturnId, checklistId, this.uploadedFile);
  }

  handleUploadItemSelected(e) {
//    e.preventDefault();    
    let { quoteId, docId, docName } = e.target.dataset;
    this.uploadedFile = e.target.files && e.target.files.length>0 ? e.target.files[0] : undefined;
  //  this.props.uploadItemFunction(quoteId, docId, docName, this.uploadedFile);
  }

  handleDownloadItem(e) {
    let { quoteId, docId, docName } = e.target.dataset;
    this.props.downloadItemFunction(quoteId, docId, docName);
  }

  handleDeleteItem(e) {
    let { quoteId, docId } = e.target.dataset;
    this.props.deleteItemFunction(quoteId, docId);
  }


//  <a class="tax-item" data-quote-id={quote.id} data-doc-id={doc.id}  data-doc-name={doc.name} onClick={this.uploadItem}>           
  //      Upload
    //  </a>

    // TODO: use the real checklistId

  renderDownloadItem(quote,doc,taxReturn) {
    return <div>
      <a class="tax-item" data-quote-id={quote.id} data-doc-id={doc.id} data-checklist-id={doc.checklist_id} data-doc-name={doc.name} onClick={this.downloadItem}>  
       [{doc.name}]  
      </a>
      <form data-quote-id={quote.id} data-doc-id={doc.id} data-tax-return-id={taxReturn.id}  data-doc-name={doc.name} data-checklist-id={doc.checklist_id}  onSubmit={this.uploadItem}>
        <input type="file" name="fileUpload" data-quote-id={quote.id}  data-tax-return-id={taxReturn.id} data-checklist-id={doc.checklist_id}  onChange={this.uploadItemSelected} />
        <button data-tax-return-id={taxReturn.id} class="button" type="submit">Upload</button>
      </form>
          <a class="tax-item" data-quote-id={quote.id} data-doc-id={doc.id} data-doc-name={doc.name} onClick={this.deleteItem}>          
         <i class="fa fa-trash-o"></i>
      </a>
    </div>
  };


  render() {
    const { quote, taxReturn, errors, document } = this.props;
    
    // functions
    // this.props.downloadDocumentFunction
    // this.props.uploadDocumentFunction
    // this.props.deleteDocumentFunction

    return ( <div>
      { this.renderDownloadItem(quote, document, taxReturn) }
      </div>
    );
  };
}

