import { combineReducers } from "redux"

// For time travel debugging (getting routing into redux)
import { routerReducer } from 'react-router-redux'


// Insert all the reducers, which contain state for our app
import users from "./usersReducer"
import loginuser from "./loginuserReducer"
import messages from "./messagesReducer"


export default combineReducers({
  users,
  loginuser,
  messages,
  routing: routerReducer
});
