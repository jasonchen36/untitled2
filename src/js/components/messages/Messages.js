import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import Sidebar from "../layout/Sidebar";

import { fetchUserMessages } from "../../actions/messagesActions";

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        loginuserFetched: store.loginuser.fetched,
        user: store.users.user,
        messages: store.messages.messages
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


    /// Handlers
    fetchMessages(userId) {
        this.props.dispatch(fetchUserMessages(userId))
    };

    handleSendMessage(e) {
        let updatedValues = {
            message: this.message_text.value
        };

        let { id } = e.target;

        e.preventDefault();

        this.props.dispatch(sendMessage(id, updatedValues));
    };

    getMessageIcon(isFromUser){
        if (!isFromUser){
            return (
                <div class="col-sm-3 message-icon-container">
                    <div class="i--icon-message-taxplan"></div>
                </div>
            )
        }
    }

    getMessageEntry(message){
        const isFromUser = message.client_id === message.from_id;
        const messageContainerClass = 'col-sm-9 message-container';
        const messageClass = isFromUser?messageContainerClass+' user':messageContainerClass+' taxplan';
        return (
            <div class="row" key={message.id}>
                {this.getMessageIcon(isFromUser)}
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


    getMessages(){
        const { messages } = this.props;
        if (messages){
            //reverse array to show most recent messages first
            return messages.reverse().map(message => this.getMessageEntry(message));
        }
    }

    render() {
        return (
            <main class="grid-container row">
                <Sidebar activeScreen="messages" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <h1>Messages</h1>
                    <textarea rows="5" ref={(input) => {this.message_text = input;}} type="text" placeholder="Compose Messages"/>
                    <button>Send</button>
                    <div class="grid-container">
                        {this.getMessages()}
                    </div>
                </section>
            </main>
        )
    }
}
