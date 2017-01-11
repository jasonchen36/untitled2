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

    renderUploadEntry(index, data){
        //todo, add handler to delete icon
        return (
            <div class="row uploads-row">
                <div class="col-sm-10">
                    <p>
                        {index}. <a href={data.url}>{data.name}</a> (Uploaded {data.date}) - ({data.size})
                    </p>
                </div>
                <div class="col-sm-2">
                    <a>
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
                        {this.renderUploads([])}
                    </div>
                </section>
            </main>
        )
    }
}