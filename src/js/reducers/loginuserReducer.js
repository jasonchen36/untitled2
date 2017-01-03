// The Reducer for the current loginuser (the user of admin currently logged in).
// Responsible for logging, logging out, etc.

export default function reducer(state={
    loginuser: {
      id: null,
      name: null,
      type: null,
    },
    fetching: false,
    fetched: false,
    authenticated: localStorage.getItem('auth_token') ? true : false,
    error: null,
  }, action) {
    // The events that will change state for login
    switch (action.type) {
      case "LOGOUT_LOGINUSER_FULFILLED": {
        return {...state,
          loginuser: {
            id:null,
            name:null,
            type:null
          },
          fetching:false,
          authenticated:action.authenticated
        }
      }
      case "LOGIN_LOGINUSER": {
        return {...state,fetching:true}
      }
      case "FETCH_LOGINUSER": {
        return {...state, fetching: true}
      }
      case "LOGIN_LOGINUSER_REJECTED":
      case "FETCH_LOGINUSER_REJECTED": {
        return {...state, fetching: false, loginuser:{id:null, name:null, type:null}, error: action.payload}
      }
      case "LOGIN_LOGINUSER_FULFILLED": {
        return {...state,
          authenticated:action.authenticated}
      }
      case "FETCH_LOGINUSER_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          authenticated:true,
          loginuser: action.payload,
        }
      }
      case "SET_LOGINUSER_NAME": {
        return {
          ...state,
          loginuser: {...state.loginuser, name: action.payload},
        }
      }
      case "SET_LOGINUSER_TYPE": {
        return {
          ...state,
          loginuser: {...state.loginuser, type: action.payload},
        }
      }
    }

    return state;
}
