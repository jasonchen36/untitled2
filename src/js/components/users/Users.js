import React from "react";
import { connect } from "react-redux";

import { Link } from "react-router";

import { fetchUsers,fetchTaxPros, deleteUser, updateSearchTerms } from "../../actions/usersActions";
import _ from "lodash";

import { renderTaxProSelectionOptions } from "../helpers/RenderTaxProsSelection";

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
    if(this.searchTermsNotInQuery(nextProps.userSearchTerms,nextProps.location.query)) {
      let objectQuery = {};

      _.each(nextProps.userSearchTerms,(ust) => {
        objectQuery[ust.key] = ust.val;
      });

      this.props.router.push({pathname:'/users',query:objectQuery});
    }
  }

  searchTermsNotInQuery(searchTerms, query) {
    const queryKeys = _.keys(query);

    if((searchTerms && searchTerms.length>0 && !query) ||
      ((!searchTerms || searchTerms.length==0) && queryKeys && queryKeys.length>0)
    ) { 
      return true;
    }

    const isNotSame = _.some(searchTerms,(st) => {
      return (typeof query[st.key] ==='undefined') || query[st.key] !== st.val;
    });

    const queryKeysNotInSearchTerms = _.some(queryKeys, (k) => {
        return !_.some(searchTerms,(st) => { return st.key === k});
    });

    return isNotSame ||  queryKeysNotInSearchTerms;
  }

  /// Handlers
  handleFetchUsers() {
    this.props.dispatch(fetchUsers())
  };

  deleteUser(userName,userId) {
    if(confirm("are you sure you want to delete '"+userName+"'?")) {
      this.props.dispatch(deleteUser(userId));
    } else {
      console.log('canceled delete');
    }
  };

  handleRowClick(e) {
    const action = e.target.dataset.userAction;
    const userId = e.target.dataset.userId;
    const userName = e.target.dataset.userName;

    if(action  && action==="delete" && userId) {
      this.deleteUser(userName, userId);

    }
    
  }

  handleSortByLastName(e) {
    e.preventDefault();
    const oldSearchTerms = this.props.userSearchTerms;
    const newQueryParam = {key:"orderBy",val:"lastName"}
    this.props.dispatch(updateSearchTerms(oldSearchTerms,[{key:"orderBy",val:"lastName"}]));
  };

  handleSortByLastUpdated(e) {
    e.preventDefault();

    const oldSearchTerms = this.props.userSearchTerms;

    this.props.dispatch(updateSearchTerms(oldSearchTerms,[{key:"orderBy",val:"lastUpdated"}]));
  };

  renderUsersRow(user, taxPros){
    var taxPro = <td></td>

    if(user.taxpro_id) {
      var selectedTaxPro = _.find(taxPros,(tp) => { return tp.id===user.taxpro_id;  });

      if(selectedTaxPro) {
        taxPro = <td>
          <Link to={`/users/${selectedTaxPro.id}/personal-profile`}>
            {selectedTaxPro.first_name} {selectedTaxPro.last_name}
          </Link>
        </td>
      }
    }


    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>
          <Link to={`/users/${user.id}/personal-profile`}>{user.first_name} {user.last_name}</Link>
        </td>
        <td>{user.status}</td>
        <td>{user.role}</td>
        <td>
          <a key={user.id} data-user-name={user.first_name + (user.last_name ? " " : "") + user.last_name} data-user-action={"delete"} data-user-id={user.id}>delete</a>        
      </td>
        {taxPro}
        <td>{user.updated_at}</td>
      </tr>
    );
  }



  handleTaxProSelected(e) {
    e.preventDefault();
    const selected=  e.target.value;
    const oldSearchTerms = this.props.userSearchTerms;
    const newSearchTerm = {key:"taxPro",val:selected};

    if (_.parseInt(selected)<=0) {
      newSearchTerm.removeTerm=true;
    }

    this.props.dispatch(updateSearchTerms(oldSearchTerms,[newSearchTerm]));
  }

  renderTableFilters(taxPros){
    //todo, populate taxpros and status from db
    //todo, add event handlers to filters
    return (
      <div id="users-table-filters" class="text-right">
        <label class="col">Filter by:</label>
        <input class="col" type="text" placeholder="User Name"/>
        <select class="col" onChange={this.handleTaxProSelected.bind(this)}>
          {renderTaxProSelectionOptions(taxPros)}
        </select>
        <select class="col">
          <option disabled defaultValue>Select Status</option>
        </select>
      </div>
    );
  }

  renderUsersTable(users,loginuser,taxPros){
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
      const usersRows = users.map(user =>this.renderUsersRow(user,taxPros));
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
          <tbody onClick={this.handleRowClick.bind(this)}>
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
          {this.renderUsersTable(users, loginuser, taxPros)}
        </section>
      </main>
    )
  }
}
