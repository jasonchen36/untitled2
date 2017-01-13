// The reducer for state involving handling users (viewing all users in the app, or details for an individual user)

export default function reducer(state={
    users: null,
    taxPros: null,
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
        return {...state, users:null};
      }
      case "FETCH_USERS": {
        return {...state, fetching: true};
      }
      case "FETCH_USERS_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_USERS_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          users: action.payload.data,
          userSearchTerms:action.payload.searchTerms
        };
      }
      case "SEARCH_TERMS_UPDATED": {
        return {
          ...state,
          userSearchTerms:action.payload
        };
      }
      // Taxpro events
      case "FETCH_TAXPROS_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_TAXPROS_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          taxPros: action.payload.data
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
        }
      }
    }

    return state;
};
