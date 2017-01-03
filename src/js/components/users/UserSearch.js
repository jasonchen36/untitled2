import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import { fetchUsers, deleteUser } from "../../actions/usersActions"

@connect((store) => {
  return {
    users: store.users.users,
  };
})

export default class UserSearch extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchUsers())
  };

  /// Handlers
  searchUsers(e) {
    e.preventDefault();
    this.props.dispatch(fetchUsers(this.searchTerms))
  }

  render() {
    return <div>
      <input ref={(input) => { this.searchTerms = input; }} type="text"  placeholder="Search" />
          <button onClick={this.searchUsers.bind(this)}>search</button>
      </div>
    }

  }
}
