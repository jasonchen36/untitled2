import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser
    };
})

export default class Notes extends React.Component {

    constructor() {
        super();
        this.sendNote = this.handleSendNote.bind(this);
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
        return (
            <tr>
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
                <td>
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
        //todo, pass in list of other users to userOptionsHeader
        //todo, pass in data to table
        const { loginuser} = this.props;
        const userId = this.props.params.userId;

        return (
            <main class="grid-container row">
                <Sidebar activeScreen="notes" userId={userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader usersList={[loginuser]} activeUser={loginuser}/>
                    <h1>Notes</h1>
                    {this.renderSendNote(userId)}
                    {this.renderNotesTable([])}
                </section>
            </main>
        )
    }
}