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


    render() {

      const { params,messages } = this.props;
      const userId = params.userId;
      const renderMessages = (msgs) => {
        if(!msgs) {
          return '';
        } else {
          return msgs.map((message) => {
            return <li>
                from:{message.fromname}
                  <br/>
                  subject:{message.subject}
                  <br/>
                  body:{message.body}
                </li>
          });
        }
      };

      const mappedMessages = renderMessages(messages);

        return (
            <main class="grid-container row">
                <Sidebar activeScreen="messages" userId={this.props.params.userId}/>
                <section class="col-sm-8">
                    <h1>Messages</h1>
                    <div>
                       <input ref={(input) => {this.message_text = input;}} type="text"  placeholder="Message"  />
                       <button >send message </button>
                    </div>
                    other messages
                    <ul>
                      {mappedMessages}
                    </ul>
                </section>
            </main>
        )
    }
}
