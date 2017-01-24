import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class Notes extends React.Component {

    constructor() {
        super();
        this.sendNote = this.handleSendNote.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(fetchUser(this.props.params.userId));
    };

    componentWillReceiveProps(nextProps) {
        //todo, stuck in infinite loop getting account
        // if(nextProps.user && nextProps.user.account_id && (!nextProps.account || nextProps.account.accountId!=nextProps.user.account_id)) {
        //     this.props.dispatch(fetchAccount(nextProps.user.account_id));
        // }
        //
        // if(nextProps.taxReturns && !nextProps.taxReturn && nextProps.taxReturns.length>0) {
        //     this.props.dispatch(fetchTaxReturn(nextProps.taxReturns[0].id));
        // }
        //
        // if (nextProps.taxReturn && this.props.taxReturn) {
        //     // Update the form with Props if a previous user was loaded
        //     // this.updateLocalProps(nextProps.taxReturn);
        // } else {
        //     // If no previous user was loaded, then default Values will handle loading the form
        // }
    };

    getDummyData(){
        return [
            {
                id: 1,
                date: '1/5/17 4:11 PM',
                user: 'TAXplan Canada',
                notes: 'Frank test',
                done: false
            },
            {
                id: 2,
                date: '1/6/17 4:12 PM',
                user: 'TAXplan Canada',
                notes: 'Frank test2',
                done: true
            },
            {
                id: 3,
                date: '1/7/17 4:13 PM',
                user: 'TAXplan Canada',
                notes: 'Frank test3',
                done: false
            }
        ]
    }

    handleSendNote(e) {
        const updatedValues = {
            body: this.note_text.value
        };

        let { id } = e.target;

        e.preventDefault();
//todo, send note to api
        // this.props.dispatch(sendMessage(id, updatedValues));
    };

    renderSendNote(userId) {
        return (
            <form class="standard-form">
                <textarea rows="5" ref={(input) => {this.note_text = input;}} type="text" placeholder="Compose Note"/>
                <button id={userId} onClick={this.sendNote}>Add Note</button>
            </form>
        );
    }

    renderNotesRow(data){
        //todo, add handler to checkbox toggle
        //todo, add logic for checkbox selected or not
        return (
            <tr key={data.id}>
                <td>
                    {data.id}
                </td>
                <td>
                    {data.date}
                </td>
                <td>
                    {data.user}
                </td>
                <td>
                    {data.notes}
                </td>
                <td class="text-center">
                    <input type="checkbox" />
                </td>
            </tr>
        );
    }

    renderNotesTable(data){
        const tableRows = data.map(row =>this.renderNotesRow(row));
        return (
            <table class="standard-table">
                <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Date/Time
                    </th>
                    <th>
                        User
                    </th>
                    <th>
                        Notes
                    </th>
                    <th>
                        Done
                    </th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </table>
        );
    }

    render() {
        //todo, pass in data to table
        const { taxReturns, taxReturn} = this.props;
        const userId = this.props.params.userId;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="notes" userId={userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1>Notes</h1>
                    {this.renderSendNote(userId)}
                    {this.renderNotesTable(this.getDummyData())}
                </section>
            </main>
        )
    }
}
