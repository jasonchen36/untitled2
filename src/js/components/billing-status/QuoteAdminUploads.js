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
    this.documents = {value:[]};
    this.checklistName = {value:null};
    this.quoteId = {value:null};
    
  }

  componentWillReceiveProps(nextProps) {
    let {checklist} = nextProps;
    let {oldChecklist} = this.props;
    let docs = checklist && checklist.documents ? checklist.documents : [];

    this.documents.value = docs;
    this.quoteId.value = nextProps.quote ? nextProps.quote.id: null;
    this.checklistName.value = nextProps.checklist ? nextProps.checklist.name: null;
  };


  handleUploadItem(e) {
    e.preventDefault();    
    let { quoteId,  taxReturnId, checklistId, checklistName } = e.target.dataset;

    let docs = _.cloneDeep(this.documents.value);

    //quoteId, taxReturnId, checklistId,uploadFile
    this.props.uploadItemFunction(quoteId, taxReturnId, checklistId, this.uploadedFile, docs);
  }

  handleUploadItemSelected(e) {
    this.uploadedFile = e.target.files && e.target.files.length>0 ? e.target.files[0] : undefined;
  }

  handleDownloadItem(e) {
    let { quoteId, documentId, checklistName } = e.target.dataset;
    this.props.downloadItemFunction(quoteId, documentId, checklistName);
  }

  handleDeleteItem(e) {
    let docs = _.cloneDeep(this.documents.value);
    this.props.deleteItemFunction(this.quoteId.value, docs, this.checklistName.value);
  }

  renderDownloadItem(quote,checklist,docs) {
    if(docs && docs.length>0) {
      let doc = docs[0];
 

      return  <a class="tax-item" data-quote-id={quote.id} data-document-id={doc.documentId} data-checklist-id={checklist.checklist_item_id} data-checklist-name={checklist.name} onClick={this.downloadItem}>  
       [{checklist.name}]  
      </a>
    } else {
      return <div class="tax-item greyed-out">
       [{checklist.name}]  
      </div>
    }

  }

  renderUpdateItem(quote,checklist,docs) {

    return   <form data-quote-id={quote.id} data-tax-return-id={checklist.tax_return_id}  data-checklist-name={checklist.name} data-checklist-id={checklist.checklist_item_id}  onSubmit={this.uploadItem}>
      <input type="file" name="fileUpload" data-quote-id={quote.id} data-tax-return-id={checklist.tax_return_id} data-checklist-id={checklist.checklist_item_id} data-checklist-name={checklist.name}  onChange={this.uploadItemSelected} />
      <button data-tax-return-id={checklist.tax_return_id} className={"button"} type="submit">Upload</button>
    </form>
  }

 
  renderDeleteItem(quote,checklist,docs) {
    if(docs && docs.length>0) {
      return <a class="tax-item" data-quote-id={quote.id} data-checklist-name={checklist.name} onClick={this.deleteItem}>          
         <i class="fa fa-trash-o"></i>D
      </a>
    } else {
      return <div class="tax-item">
         <i class="fa greyed-out fa-trash-o"></i>nD
      </div>

    }
  }

  renderItem(quote,checklist,taxReturn) {
   
    let docs = checklist && checklist.documents ? checklist.documents : [];

    return <div>
      { this.renderDownloadItem(quote,checklist,docs) }
      { this.renderUpdateItem(quote,checklist,docs) }
      {  this.renderDeleteItem(quote,checklist,docs) }
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

