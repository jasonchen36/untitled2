// The reducer for state involving handling users (viewing all users in the app, or details for an individual user)

export default function reducer(state={
    users: null,
    usersCount:null,
    usersPerPage:20,
    usersPage:1,
    taxPros: null,
    taxProsCount:null,
    userSearchTerms:[{key:"orderBy",val:"lastUpdated"}],
    searchChanged:false,
    user: null,
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      // Users events
      case "CLEAR_USERS": {
        return {...state, users:null, usersCount:null, usersPage:1};
      }
      case "FETCH_USERS": {
        return {...state, fetching: true};
      }
      case "FETCH_USERS_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_USERS_FULFILLED": {
        const users = action.payload.data.users;
        const usersCount = action.payload.data.count;

        return {
          ...state,
          fetching: false,
          fetched: true,
          users: users,
          usersCount: usersCount,
          userSearchTerms:action.payload.searchTerms
        };
      }
      case "SEARCH_TERMS_UPDATED": {
        const searchTerms = action.payload;

        let usersPageTerm = _.find(searchTerms,(st) => { return st.key==='page';});
        let usersPage = state.usersPage;
        
        if(usersPageTerm) {
          usersPage = _.parseInt(usersPageTerm.val);
        }

        return {
          ...state,

          userSearchTerms:action.payload,
          usersPage:usersPage
        };
      }
      // Taxpro events
      case "FETCH_TAXPROS_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_TAXPROS_FULFILLED": {
        const taxPros = action.payload.data.users;
        const taxProsCount = action.payload.data.count;

        return {
          ...state,
          fetching: false,
          fetched: true,
          taxPros: taxPros,
          taxProsCount: taxProsCount
        };
      }
      // User events
      case "FETCH_USER": {
        return {...state, fetching: true};
      }
      case "FETCH_USER_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          user: action.payload
        };
      }
      case "ADD_USER": {
        return {
          ...state,
          users: [...state.users, action.payload],
        }
      }
      case "UPDATE_USER": {
        const { id, text } = action.payload
        const newUsers = [...state.users]
        const userToUpdate = newUsers.findIndex(user => user.id === id)
        newUsers[userToUpdate] = action.payload;

        return {
          ...state,
          users: newUsers,
        }
      }
      case "DELETE_USER_FULFILLED": {
        return {
          ...state,
          users: state.users.filter(user => user.id.toString() !== action.payload.toString()),
          usersCount:state.usersCount-1
        }
      }
    }

    return state;
};
