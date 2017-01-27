import React from "react";
import { connect } from "react-redux";

import { Link  } from "react-router";
import moment from "moment";
import Sidebar from "../layout/Sidebar";

import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn, fetchChecklist, clearChecklist } from "../../actions/accountsActions";
import { directDownloadChecklistItems, deleteDocument, viewedDocument } from "../../actions/uploadsActions";
import { saveBlob } from "../../lib/saveBlob";
import { loadAccountIfNeeded, loadChecklistIfNeeded } from "../loaders/loadUser";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        taxReturnDetailsFetched: store.accounts.taxReturnDetailsFetched,
        account: store.accounts.account,
        quoteChecklist: store.accounts.quoteChecklist,
        quoteChecklistFetched: store.accounts.quoteChecklistFetched,
        quoteChecklistFetching: store.accounts.quoteChecklistFetching 
    };
})

export default class Uploads extends React.Component {

    constructor() {
        super();
        this.clickDownloadItem = this.handleClickDownloadItem.bind(this);
        this.clickDeleteItem = this.handleClickDeleteItem.bind(this);
        this.clickViewed = this.handleClickViewed.bind(this); 
    }

    componentWillMount() {
        this.props.dispatch(fetchUser(this.props.params.userId));
    };

    componentWillReceiveProps(nextProps) {
      loadAccountIfNeeded(nextProps, this.props);
      loadChecklistIfNeeded(nextProps, this.props);
    };

    handleClickDownloadItem(e) {
      let { name, url, documentId, quoteId } = e.currentTarget.dataset;
     
      directDownloadChecklistItems(quoteId,documentId)
        .then((response) => {
          const data = response.data;
          const fileName = name;

          saveBlob(fileName, response);
        });
    }

    handleClickDeleteItem(e) {
      let { documentId, quoteId, documentName } = e.currentTarget.dataset;
       
       if(confirm("are you sure you want to delete document '"+documentName+"'?")) {
        this.props.dispatch(deleteDocument(quoteId,documentId));
      } else {
      }
    }

    handleClickViewed(e) {
      let { documentId, quoteId, viewed } = e.currentTarget.dataset;
      console.log('click viewed', viewed);

      this.props.dispatch(viewedDocument(quoteId, documentId, viewed));
    }

    renderUploadEntry( data,key){
        //todo, add handler to delete icon
        return (
            <div key={key} class="row uploads-row">
                <div class="col-sm-10">
                                  
                    <p>
                    <input name="isViewed"  data-quote-id={data.quoteId} data-document-id={data.documentId}  type="checkbox" checked={data.viewedByTaxPro} data-viewed={data.viewedByTaxPro} onChange={this.clickViewed} />
                        {key+1}. <span class="fa-anchor-container"><i class="fa fa-file-o"></i></span>
                        <a data-name={data.name} data-url={data.url} data-quote-id={data.quoteId} data-document-id={data.documentId}  onClick={this.clickDownloadItem}>{data.checklistName} ({data.firstName}{data.lastName ? ' ' : ''}{data.lastName}) - {data.name}</a> (Uploaded {moment(data.createdAt).format('YYYY-MM-DD HH:mm')})
                    </p>
                </div>
                <div class="col-sm-2 position-relative">
                    <a class="uploads-button-delete" data-quote-id={data.quoteId} data-document-id={data.documentId} data-document-name={data.name} onClick={this.clickDeleteItem}>
                        <i class="fa fa-trash-o"></i>
                    </a>
                </div>
            </div>
        );
    }


    renderUploads(uploads){
      if(!uploads || uploads.length==0) {
        return <div> No Uploads </div>
      }

      return uploads.map((upload,key) => {
            return this.renderUploadEntry(upload,key)
          });
    }

    render() {
        //todo, pass in uploads to render
        const { taxReturns, taxReturn,quoteChecklist} = this.props;

        let checkListItems = quoteChecklist && quoteChecklist.checklistitems ? quoteChecklist.checklistitems : [];

        let checklistDocuments = _.reduce(checkListItems,(result,value,key) => {
          let documents = _.map(value.documents,(doc) => {
            return _.merge({checklistName:value.name},doc);
          });

          result = _.concat(result,documents);
          return result;
        },[]);

        let additionalDocuments = _.map(quoteChecklist && quoteChecklist.additionalDocuments ? quoteChecklist.additionalDocuments : [],(ad) => {
          return _.merge({checklistName:'Additional Documents',checkListItemId:-1},ad);
        });

        checklistDocuments = _.concat(checklistDocuments, additionalDocuments);

        return (
            <main class="grid-container row">
                <Sidebar activeScreen="uploads" userId={this.props.params.userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1>TAXitem Uploads</h1>
                    <div class="grid-container">
                        {this.renderUploads(checklistDocuments)}
                    </div>
                </section>
            </main>
        )
    }
}
