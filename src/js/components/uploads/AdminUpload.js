import React from "react"
import { IndexLink, Link } from "react-router";

import { createLoginuser } from "../../actions/loginuserActions"
import { renderErrors } from "../helpers/RenderErrors";
import { renderTaxReturnStatusSelectionOptions } from "../helpers/RenderTaxReturnStatusSelection";
import { initUpdateState, renderUpdateButton, updateState } from "../helpers/RenderUpdateButton";

import  QuoteChecklistItemList from "./QuoteChecklistItemList";


export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.uploadItem = this.handleUploadItem.bind(this);
    this.uploadItemSelected = this.handleUploadItemSelected.bind(this);
    this.uploadedFile = {value: undefined};
    this.selectedChecklist = {value:null};
    this.quoteId = {value:null};
    this.updateState = {value:null};
    this.onChecklistItemChosen = this.handleOnChecklistItemChosen.bind(this);
    this.selectedChecklistItem= {value:null};

  }

  componentWillReceiveProps(nextProps) {
    let {checklistItems} = nextProps;
    let {oldChecklistItems} = this.props;
    this.checklistItems = checklistItems;
    if(this.checklistItems && this.selectedChecklistItem.value) {
      if(!_.some(checklistItems,(ci) => { return ci.checklist_item_id===this.selectedChecklistItem.value.checklist_item_id; })) {
        this.selectedChecklistItem.value = null;
      }
    } else if (!this.checklistItems) {
      this.selectedChecklistItem.value=null;
    }

    this.quoteId.value = nextProps.quote ? nextProps.quote.id: null;

     const taxReturnId = this.selectedChecklistItem.value ? this.selectedChecklistItem.value.tax_return_id : null;
     const checklistItemId = this.selectedChecklistItem.value ? this.selectedChecklistItem.value.checklist_item_id : null;


    const updating = _.some(nextProps.updating,(u) => { return u.checklistId === checklistItemId && (
    (!u.taxReturnId && !taxReturnId) ||
    u.taxReturnId === taxReturnId
    ); } );
    const updated = _.some(nextProps.updated,(u) => { return u.checklistId === checklistItemId && (
     (!u.taxReturnId && !taxReturnId) ||
    u.taxReturnId === taxReturnId
    ); });

    this.updateState.value = updateState(updating, updated);
  };

  handleUploadItem(e) {
    e.preventDefault();    
      if(!this.selectedChecklistItem.value) {
        alert('please select a checklist item');
      } else {
      const checklistId = this.selectedChecklistItem.value.checklist_item_id;
      const taxReturnId = this.selectedChecklistItem.value.tax_return_id;
      const quoteId = this.quoteId.value;
    this.props.uploadItemFunction(quoteId, taxReturnId, checklistId, this.uploadedFile);
      }
  }

  handleUploadItemSelected(e) {
    this.uploadedFile = e.target.files && e.target.files.length>0 ? e.target.files[0] : undefined;
  }

  renderUpdateItem(quote, checklistItem) {

    const taxReturnId = checklistItem ? checklistItem.tax_return_id : null;
    const checklistItemName = checklistItem ? checklistItem.name : null;
    const checklistItemId = checklistItem ? checklistItem.checklist_item_id : null;
      return <form data-quote-id={quote.id} data-tax-return-id={taxReturnId}  data-checklist-name={checklistItemName} data-checklist-id={checklistItemId}  onSubmit={this.uploadItem}>
        <input type="file" name="fileUpload" data-quote-id={quote.id} data-tax-return-id={taxReturnId} data-checklist-id={checklistItemId} data-checklist-name={checklistItemName}  onChange={this.uploadItemSelected} />
        { renderUpdateButton(this.updateState,"Upload", "Uploading", "Uploaded") }
      </form>
  }

  handleOnChecklistItemChosen(value) {
    this.selectedChecklistItem.value = _.find(this.checklistItems,(ci) => {
      return ci.checklist_item_id===_.parseInt(value);
    });

    this.setState({value:this.selectedChecklistItem});
  }
 
  renderSelectChecklistItems(checklistItems) {
    if(!checklistItems) {
      return <div>Loading Checklists</div>
    }

    const selectedValue = this.selectedChecklistItem.value ? this.selectedChecklistItem.value.checklist_item_id : -1;
    
    return <div>
      <QuoteChecklistItemList checklist={checklistItems} chosenValue={selectedValue} defaultTextValue={"Choose checklist item"} onChosenHandler={this.onChecklistItemChosen} />
    </div>
  }

  renderItem(quote,checklistItems,selectedChecklistItem) {
    if(!quote || !checklistItems) {
      return <div>
        No Quote
      </div>
    } else {
   
      return <div>
        { this.renderUpdateItem(quote, selectedChecklistItem) }
        { this.renderSelectChecklistItems(checklistItems)}
           </div>
    }
  }

  render() {
    const { quote, errors, checklistItems } = this.props;
    
    // functions
    // this.props.uploadItemFunction

    const selectedChecklistItem = this.selectedChecklistItem.value;

    return ( <div>
      { this.renderItem(quote, checklistItems,selectedChecklistItem) }
      </div>
    );
  };
}

