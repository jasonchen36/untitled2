import React from "react";
import { connect } from "react-redux";

import { Link  } from "react-router";
import moment from "moment";
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn, fetchChecklist } from "../../actions/accountsActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        quoteChecklist: store.accounts.quoteChecklist
    };
})

export default class Uploads extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.props.dispatch(fetchUser(this.props.params.userId));
    };

    componentWillReceiveProps(nextProps) {
        let quoteId = nextProps.account && nextProps.account.quotes && nextProps.account.quotes.length>0 ? nextProps.account.quotes[0].id : -1;

        if(!nextProps.quoteChecklist)
        {
          console.log('nextcheck',nextProps.quoteChecklist);
           this.props.dispatch(fetchChecklist(21));
        } else {

          console.log('foundcheck',nextProps.quoteChecklist);
        }
    };

    getDummyData(){
        return [
            {
                id: 1,
                url: '',
                name: 'Document 0',
                date: 'Feb 2, 2016 3:37:50 PM',
                size: '5.0 MB'
            },
            {
                id: 2,
                url: '',
                name: 'Document 1',
                date: 'Feb 2, 2016 3:39:27 PM',
                size: '4.9 MB'
            }
        ]
    }

    renderUploadEntry( data,key){
        //todo, add handler to delete icon
        return (
            <div key={key} class="row uploads-row">
                <div class="col-sm-10">
                    <p>
                        {key}. <span class="fa-anchor-container"><i class="fa fa-file-o"></i></span>
                        <a href={data.url}>{data.name}</a> (Uploaded {moment(data.createdAt).format('YYYY-MM-DD HH:mm')})
                    </p>
                </div>
                <div class="col-sm-2 position-relative">
                    <a class="uploads-button-delete">
                        <i class="fa fa-trash-o"></i>
                    </a>
                </div>
            </div>
        );
    }


    renderUploads(uploads){

            return uploads.map((upload,key) => {
              return this.renderUploadEntry(upload,key)
            });
         }

    render() {
        //todo, pass in uploads to render
        const { taxReturns, taxReturn,quoteChecklist} = this.props;

        console.log('quote checklist',quoteChecklist);
        let checkListItems = quoteChecklist && quoteChecklist.checklistitems ? quoteChecklist.checklistitems : [];

        let checklistDocuments = _.reduce(checkListItems,(result,value,key) => {
          let documents = _.map(value.documents,(doc) => {
            return _.merge({checklistName:value.name},doc);
          });

          result = _.concat(result,documents);
          return result;
        },{});

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
