import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"
import moment from "moment"
import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUser } from "../../actions/usersActions";
import { fetchNotes, markAsDone, createNote } from "../../actions/notesActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        user: store.users.user,
        notes: store.notes.notes,
        noteSent: store.notes.noteSent,
        error: store.notes.error
    };
})

export default class Notes extends React.Component {

    constructor() {
        super();
        this.sendNote = this.handleSendNote.bind(this);
        this.clickDone = this.handleClickDone.bind(this);         
    }

    componentWillMount() {
        const userId = this.props.params.userId;
        this.props.dispatch(fetchNotes(userId));      
    };

    componentWillReceiveProps(nextProps) {
       this.clearNoteFieldsOnNoteSent(nextProps.noteSent,this.props.noteSent);

     };

       /// update all the form with the values from the user (prop)
    clearNoteFieldsOnNoteSent(noteSentStatus,noteSentPreviousStatus) {
        if (noteSentStatus===true && noteSentPreviousStatus===false) {
            this.note_text.value= '';
        }
    };


    handleSendNote(e) {
        const message = this.note_text.value;
        let {  userId } = e.currentTarget.dataset;
        
        e.preventDefault();
         this.props.dispatch(createNote(userId, message));
    };

    handleClickDone(e) {
      let { noteId, userId, done } = e.currentTarget.dataset;
      done = parseInt(done)===0 ? true : false;

      this.props.dispatch(markAsDone(userId, noteId, done));
    }

    renderSendNote(userId) {
        return (
            <form class="standard-form">
                <textarea rows="5" ref={(input) => {this.note_text = input;}} type="text" placeholder="Compose Note"/>
                <button id={userId} data-user-id={userId} onClick={this.sendNote}>Add Note</button>
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
                    {moment(data.create_at).format('YYYY-MM-DD HH:mm')}
                </td>
                <td>
                    {data.note}
                </td>
                <td class="text-center">
                    <input name="isDone" data-user-id={data.user_id} data-note-id={data.id} checked={data.done} data-done={data.done} onChange={this.clickDone} type="checkbox" />
                </td>
            </tr>
        );
    }

    renderNotesTable(data){
        if(!data || data.length===0) {
          return <div> No Notes.</div>
        }

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
                        Note
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
      const { notes } = this.props;
      const userId = this.props.params.userId;

      const orderedNotes = _.orderBy(notes,['create_at','id'],['desc','desc'])
      return (
          <main class="grid-container row">
              <Sidebar activeScreen="notes" userId={userId}/>
              <section class="col-sm-8 col-lg-9">
                  <h1>Notes</h1>
                  {this.renderSendNote(userId)}
                  {this.renderNotesTable(orderedNotes)}
              </section>
          </main>
      )
    }
}
