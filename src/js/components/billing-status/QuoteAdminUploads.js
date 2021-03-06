import React from "react"
import { IndexLink, Link } from "react-router";

import { createLoginuser } from "../../actions/loginuserActions"
import { renderErrors } from "../helpers/RenderErrors";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";
import { initUpdateState, renderUpdateButton, updateState } from "../helpers/RenderUpdateButton";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.handleDeleteItem.bind(this);
    this.downloadItem = this.handleDownloadItem.bind(this);
    this.uploadItem = this.handleUploadItem.bind(this);
    this.uploadItemSelected = this.handleUploadItemSelected.bind(this);
    this.uploadedFile = {value: undefined};
    this.documents = {value:[]};
    this.checklistName = {value:null};
    this.quoteId = {value:null};
    this.updateState = {value:null};
  }

  componentWillReceiveProps(nextProps) {
    let {checklist,taxReturn} = nextProps;
    let {oldChecklist} = this.props;
    let docs = checklist && checklist.documents ? checklist.documents : [];

    this.documents.value = docs;
    this.quoteId.value = nextProps.quote ? nextProps.quote.id: null;
    this.checklistName.value = nextProps.checklist ? nextProps.checklist.name: null;
    this.updateState.value = updateState(nextProps.updating, nextProps.updated);
  };


  handleUploadItem(e) {
    e.preventDefault();    
    let { quoteId,  taxReturnId, checklistId, checklistName } = e.target.dataset;

    //quoteId, taxReturnId, checklistId,uploadFile
    this.props.uploadItemFunction(quoteId, taxReturnId, checklistId, this.uploadedFile);
  }

  handleUploadItemSelected(e) {
    this.uploadedFile = e.target.files && e.target.files.length>0 ? e.target.files[0] : undefined;
  }

  handleDownloadItem(e) {
    let { quoteId, documentId, checklistName,documentName } = e.target.dataset;

    this.props.downloadItemFunction(quoteId, documentId, documentName);
  }

  handleDeleteItem(e) {
    let {documentId, documentName} = e.currentTarget.dataset;
    this.props.deleteItemFunction(this.quoteId.value, documentId, documentName);
  }

   renderDownloadItemHeader(quote,checklist,docs, taxReturn) {
    if(docs && docs.length>0) {
      return <div class="tax-item-header border-bottom-dark-grey">
        {taxReturn.first_name} - {checklist.name}
      </div>
    } else {
      return <div class="tax-item-header greyed-out border-bottom-dark-grey">
          {taxReturn.first_name} - {checklist.name}
      </div>
    }
  }

  renderDownloadItems(quote,checklist,docs) {
    if(docs && docs.length>0) {
      let doc = docs[0];
 
      return _.map(docs, (doc) => {
        return this.renderDownloadItem(quote,checklist,doc);
      });
    } else {
      return <div class="tax-item-no-items greyed-out">
       No Items 
      </div>
    }
  }

  renderDownloadItem(quote,checklist,doc) {
      return <div class="download-item-row-container border-bottom-dark-grey">
        <a class="tax-item f--futura-book" data-quote-id={quote.id} data-document-id={doc.documentId} data-checklist-id={checklist.checklist_item_id} data-document-name={doc.name} data-checklist-name={checklist.name} onClick={this.downloadItem}>
         {doc.name}
        </a>
        <a class="tax-item-trash-container" data-quote-id={quote.id} data-document-id={doc.documentId} data-checklist-name={checklist.name} data-document-name={doc.name} onClick={this.deleteItem}>
          <div class="tax-item-trash">
            <i class="fa fa-trash-o"></i>
          </div>
        </a>
      </div>
  }

  renderUpdateItem(quote,checklist,docs) {

    return   <form data-quote-id={quote.id} data-tax-return-id={checklist.tax_return_id}  data-checklist-name={checklist.name} data-checklist-id={checklist.checklist_item_id}  onSubmit={this.uploadItem}>
      <input type="file" name="fileUpload" data-quote-id={quote.id} data-tax-return-id={checklist.tax_return_id} data-checklist-id={checklist.checklist_item_id} data-checklist-name={checklist.name}  onChange={this.uploadItemSelected} />
      <div class="button-upload-container">
        <i class="fa fa-paperclip" aria-hidden="true"></i>{ renderUpdateButton(this.updateState,"Upload File", "Uploading", "Uploaded", "button-upload") }
      </div>
    </form>
  }

 
  renderItem(quote,checklist,taxReturn) {
   
    let docs = checklist && checklist.documents ? checklist.documents : [];
    return <div>
      { this.renderDownloadItemHeader(quote,checklist,docs,taxReturn) }
      { this.renderDownloadItems(quote,checklist,docs) }
      { this.renderUpdateItem(quote,checklist,docs) }
         </div>
  };


  render() {
    const { quote, taxReturn, errors, checklist } = this.props;
    
    // functions
    // this.props.downloadDocumentFunction
    // this.props.uploadDocumentFunction
    // this.props.deleteDocumentFunction

    return ( <div>
      { this.renderItem(quote, checklist, taxReturn) }
      </div>
    );
  };
}

