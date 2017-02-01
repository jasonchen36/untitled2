import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";
import UserOptionsHeader from "../layout/UserOptionsHeader";

import { fetchUserMessages, sendMessage } from "../../actions/messagesActions";
import { fetchUser } from "../../actions/usersActions";
import { fetchAccount, fetchTaxReturn } from "../../actions/accountsActions";

import { renderErrors } from "../helpers/RenderErrors";


@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        user: store.users.user,
        messages: store.messages.messages,
        messageSent: store.messages.messageSent,
        taxReturns:store.accounts.taxReturns,
        taxReturn:store.accounts.taxReturn,
        error:store.message.error,
        sendError: store.messages.sendError,
        messagesError: store.messages.messagesError
    };
})

export default class Messages extends React.Component {

    constructor() {
        super();
        this.sendMessage = this.handleSendMessage.bind(this);
    }

    componentWillMount() {
        const userId = this.props.params.userId;
        // this.props.dispatch(fetchUser(this.props.params.userId));
        this.props.dispatch(fetchUserMessages(userId));
    };

    componentWillReceiveProps(nextProps) {
        this.clearMessageFieldsOnMessageSent(nextProps.messageSent,this.props.messageSent);
    };

    /// update all the form with the values from the user (prop)
    clearMessageFieldsOnMessageSent(messageSentStatus,messageSentPreviousStatus) {
        if (messageSentStatus===true && messageSentPreviousStatus===false) {
            this.message_text.value= '';
        }
    };

    /// Handlers
    fetchMessages(userId) {
        this.props.dispatch(fetchUserMessages(userId))
    };

    handleSendMessage(e) {
        const updatedValues = {
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
                        Date: {message.date}
                    </p>
                    <p class="message-body">
                        Message:
                    </p>
                    <p>
                        {message.body}
                    </p>
                </div>
            </div>
        );
    }

    renderSendMessage(userId, sendError) {
        return (
            <form class="standard-form">
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
        const { messages, taxReturns, taxReturn, sendError, messagesError,error } = this.props;
        const userId = this.props.params.userId;
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="messages" userId={userId}/>
                <section class="col-sm-8 col-lg-9">
                    <h1>Messages</h1>
                    {this.renderSendMessage(userId)}
                    
                    <div class="grid-container">
                        {renderErrors(error)}                
                        {this.renderMessages(messages)}
                    </div>
                </section>
            </main>
        )
    }
}
