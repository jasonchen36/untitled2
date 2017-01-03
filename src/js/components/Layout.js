import React from "react"
import { connect } from "react-redux"

// Actions
import { createLoginuser } from "../actions/loginuserActions";
import { fetchLoginuser } from "../actions/loginuserActions";

import Nav from "./layout/Nav";
import Footer from "./layout/Footer";

// Store info needed
@connect((store) => {
  return {
    loginuser: store.loginuser.loginuser
  };
})

export default class Layout extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchLoginuser())
  }

  render() {
    const { location,loginuser } = this.props;
 
    return <div>
      <div>
        <Nav location={location} name={loginuser?loginuser.name:null} loggedIn={typeof loginuser ==="undefined"} />
      </div>
      <div class="main-body" >
        {this.props.children}
      </div>
      <Footer/>
    </div>;
  }
}
