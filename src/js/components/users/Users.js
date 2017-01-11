import React from "react";
import { connect } from "react-redux";

import { Link } from "react-router";

import { fetchUsers,fetchTaxPros, deleteUser, updateSearchTerms } from "../../actions/usersActions";
import _ from "lodash";

@connect((store) => {
  return {
    loginuser: store.loginuser.loginuser,
    loginuserFetched: store.loginuser.fetched,
    users: store.users.users,
    userSearchTerms: store.users.userSearchTerms,
    taxPros: store.users.taxPros
  };
})

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.sortByLastName = this.handleSortByLastName.bind(this);
    this.sortByLastUpdated = this.handleSortByLastUpdated.bind(this);
    this.fetchUsers = this.handleFetchUsers.bind(this);
   // this.deleteUser = this.handleDeleteUser.bind(this);
  }


  componentWillMount() {
    this.props.dispatch(fetchUsers());
    this.props.dispatch(fetchTaxPros());
    

    const newProps = this.props;
    const { loginuser } = newProps;

    // TODO: move to a support function
    // redirect if not logged in
    if(!loginuser || !loginuser.id) {
      newProps.router.push('/');
    } else {
    }
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.userSearchTerms && nextProps.userSearchTerms.length>0 && this.searchTermsNotInQuery(nextProps.userSearchTerms,nextProps.location.query)) {

      let objectQuery = {};

      _.each(nextProps.userSearchTerms,(ust) => {
        objectQuery[ust.key] = ust.val;
      });
      const newQueries= _.merge(nextProps.location.query,objectQuery);
    this.props.router.push({pathname:'/users',query:newQueries});
    } else {
    }
  }

  searchTermsNotInQuery(searchTerms, query) {
    let isSame = true;
    if(searchTerms && searchTerms.length>0 && !query) {  return true; }

    isSame = _.some(searchTerms,(st) => {
      return (typeof query[st.key] ==='undefined') || query[st.key] !== st.val;
    });

    return isSame;
  }

  /// Handlers
  handleFetchUsers() {
    userSearchTerms
    this.props.dispatch(fetchUsers())
  };

  deleteUser(user) {
    if(confirm("are you sure you want to delete '"+user.fullName+"'?")) {
      this.props.dispatch(deleteUser(user.id));
    } else {
      console.log('canceled delete');
    }
  };

  handleSortByLastName(e) {
    e.preventDefault();
    const oldSearchTerms = this.props.userSearchTerms;
    const newQueryParam = {key:"orderBy",val:"lastName"}
    this.props.dispatch(updateSearchTerms(oldSearchTerms,[{key:"orderBy",val:"lastName"}]));
  };

  handleSortByLastUpdated(e) {
    e.preventDefault();
    const oldSearchTerms = this.props.userSearchTerms;
//    this.props.dispatch(fetchUsers());
    this.props.dispatch(updateSearchTerms(oldSearchTerms,[{key:"orderBy",val:"lastUpdated"}]));
    
  };

  renderUsersRow(user){
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>
          <Link to={`/users/${user.id}/personal-profile`}>{user.first_name} {user.last_name}</Link>
        </td>
        <td>{user.status}</td>
        <td>{user.role}</td>
        <td>
          <a href="#" key={user.id} onClick={this.deleteUser.bind(this,user)}>delete</a>
        </td>
        <td>todo</td>
        <td>{user.updated_at}</td>
      </tr>
    );
  }

  renderTaxProSelection(taxPros) {
    const defaultSelection = <option key="-1" disabled>TaxPros</option>;
    
    if(!taxPros) {
      return defaultSelection;
    }

    const renderedTaxPros= taxPros.map((taxPro) => {
      return (<option key={taxPro.id}>
        {taxPro.first_name}{ taxPro.last_name? ' '+taxPro.last_name:''}
      </option> );
    });

    return _.concat([defaultSelection],renderedTaxPros);
  }

  renderTableFilters(taxPros){
    //todo, populate taxpros and status from db
    //todo, add event handlers to filters
    return (
      <div id="users-table-filters" class="text-right">
        <label class="col">Filter by:</label>
        <input class="col" type="text" placeholder="User Name"/>
        <select class="col">
          {this.renderTaxProSelection(taxPros)}
        </select>
        <select class="col">
          <option disabled defaultValue>Select Status</option>
        </select>
      </div>
    );
  }

  renderUsersTable(users,loginuser){
    if(loginuser && loginuser.role==='Customer') {
      return ( <div>Sorry, you currently don't have permission to Access Users.  If you are a Tax Pro, please ask your Admin to change your role. </div> );

    } else if(!loginuser) {
      return ( <div>Please Log in</div> );
    }

    if (!users) {
      //todo, redirect to login screen if no user session
      return ( <div></div> );
    } else if (!users.length) {
      return (
        <button onClick={this.fetchUsers.bind(this)}>load users</button>
      );
    } else {
      const usersRows = users.map(user =>this.renderUsersRow(user));
      return (
        <table class="standard-table">
          <thead>
          <tr>
            <th>#</th>
            <th><a onClick={this.sortByLastName} >Name</a></th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
            <th>TaxPro</th>
            <th><a onClick={this.sortByLastUpdated}>Last User Update</a></th>
          </tr>
          </thead>
          <tbody>
          {usersRows}
          </tbody>
        </table>
      );
    }
  }

  render() {
    const { users, loginuser, taxPros } = this.props;
    return (
      <main class="grid-container row">
        <section class="col-sm-12">
          <h1>Users</h1>
          {this.renderTableFilters(taxPros)}
          {this.renderUsersTable(users, loginuser)}
        </section>
      </main>
    )
  }
}
