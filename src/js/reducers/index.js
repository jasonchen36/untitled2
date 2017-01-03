import { combineReducers } from "redux"

// For time travel debugging (getting routing into redux)
import { routerReducer } from 'react-router-redux'


// Insert all the reducers, which contain state for our app
import users from "./usersReducer"
import loginuser from "./loginuserReducer"

export default combineReducers({
  users,
  loginuser,
  routing: routerReducer
});
