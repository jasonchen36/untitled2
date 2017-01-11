import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUserMessages, sendMessage } from "../../actions/messagesActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        user: store.users.user,
        messages: store.messages.messages,
        messageSent: store.messages.messageSent,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn
    };
})

export default class Messages extends React.Component {
    constructor() {
        super();
        this.sendMessage = this.handleSendMessage.bind(this);
    }

    componentWillMount() {
        const props = this.props;
        const { loginuser } = props;
        if(!loginuser || !loginuser.id) {
            props.router.push('/');
        } else {
        }

        const userId = this.props.params.userId;
        this.props.dispatch(fetchUserMessages(userId));
    };

    componentWillReceiveProps(nextProps) {
      this.clearMessageFieldsOnMessageSent(nextProps.messageSent,this.props.messageSent);
    };

    /// update all the form with the values from the user (prop)
    clearMessageFieldsOnMessageSent(messageSentStatus,messageSentPreviousStatus) {
      if (messageSentStatus===true && messageSentPreviousStatus===false) {
        this.message_subject.value = '';
        this.message_text.value= '';
      }
    };

    /// Handlers
    fetchMessages(userId) {
        this.props.dispatch(fetchUserMessages(userId))
    };

    handleSendMessage(e) {
        const updatedValues = {
            subject: this.message_subject.value,
            body: this.message_text.value
        };

        let { id } = e.target;

        e.preventDefault();

        this.props.dispatch(sendMessage(id, updatedValues));
    };

    renderMessageIcon(isFromUser){
        if (!isFromUser){
            return (
                <div class="col-sm-3 message-icon-container">
                    <div class="i--icon-message-taxplan"></div>
                </div>
            )
        }
    }

    renderMessageEntry(message){
        const isFromUser = message.client_id === message.from_id;
        const messageContainerClass = 'col-sm-9 message-container';
        const messageClass = isFromUser?messageContainerClass+' user':messageContainerClass+' taxplan';
        return (
            <div class="row" key={message.id}>
                {this.renderMessageIcon(isFromUser)}
                <div class={messageClass}>
                    <p>
                        From: {message.fromname}
                    </p>
                    <p>
                        Subject: {message.subject}
                    </p>
                    <p>
                        Date: {message.date}
                    </p>
                    <p class="message-body">
                        Body:
                    </p>
                    <p>
                        {message.body}
                    </p>
                </div>
            </div>
        );
    }

    renderSendMessage(userId) {
      return (
        <form class="standard-form">
          <input ref={(input) => {this.message_subject = input;}}  type="text" placeholder="Message Subject" />
          <textarea rows="5" ref={(input) => {this.message_text = input;}} type="text" placeholder="Compose Messages"/>
          <button id={userId} onClick={this.sendMessage}>Send</button>
        </form>
      );
    }

    renderMessages(messages){
        if (messages){
            //reverse array to show most recent messages first
            return messages.reverse().map(message => this.renderMessageEntry(message));
        }
    }

    render() {
        const { messages, taxReturns, taxReturn } = this.props;
        const userId = this.props.params.userId;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="messages" userId={userId}/>
                <section class="col-sm-8">
                    <UserOptionsHeader taxReturns={taxReturns} activeTaxReturn={taxReturn}/>
                    <h1>Messages</h1>
                    {this.renderSendMessage(userId)}
                    <div class="grid-container">
                        {this.renderMessages(messages)}
                    </div>
                </section>
            </main>
        )
    }
}
