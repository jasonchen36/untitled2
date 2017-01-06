import React from "react"
import { connect } from "react-redux"

import { createLoginuser } from "../../actions/loginuserActions"

import RegisterPresentation from "./Register.Presentation"

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        error: store.loginuser.error
    };
})

export default class Layout extends React.Component {
  constructor() {
    super();
    this.createUser = this.handleCreateLoginuser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const wasNotLoggedIn = !this.props.loginuser.id;
    const isLoggedIn = !(!nextProps.loginuser.id);
    if(wasNotLoggedIn && isLoggedIn) {
        this.props.router.push('/users');
    }
  }

  /// Handlers
  handleCreateLoginuser(data) {
    this.props.dispatch(createLoginuser(data));
  }

  render() {
    const { loginuser, error } = this.props;

    return (
      <main class="grid-container row">
        <RegisterPresentation handleCreateLoginuser={this.createUser} loginuser={loginuser} error={error} />
      </main>
    );
  };
}

