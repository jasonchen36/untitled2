import React from "react";
import { IndexLink, Link } from "react-router";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }


/// Nav for all pages
  render() {
    const { name, location, loggedIn } = this.props;
    const { collapsed } = this.state;
    const navClass = collapsed ? "collapse" : "";

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top top-bar" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li >
               {name}{loggedIn} 
              </li>
              <li >
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Login</IndexLink>
              </li>
              <li >
                <Link to="users" onClick={this.toggleCollapse.bind(this)}>Users</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

