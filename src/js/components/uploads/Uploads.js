import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class Uploads extends React.Component {

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

    renderUploadEntry(index, data){
        //todo, add handler to delete icon
        return (
            <div key={data.id} class="row uploads-row">
                <div class="col-sm-10">
                    <p>
                        {index}. <span class="fa-anchor-container"><i class="fa fa-file-o"></i></span>
                        <a href={data.url}>{data.name}</a> (Uploaded {data.date}) - ({data.size})
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

    renderUploads(data){
        if (data){
            //todo, pass in correct index
            return data.map(row =>this.renderUploadEntry(1, row));
        }
    }

    render() {
        //todo, pass in uploads to render
        const { taxReturns, taxReturn} = this.props;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="uploads" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>TAXitem Uploads</h1>
                    <div class="grid-container">
                        {this.renderUploads(this.getDummyData())}
                    </div>
                </section>
            </main>
        )
    }
}