import { combineReducers } from "redux"

// For time travel debugging (getting routing into redux)
import { routerReducer } from 'react-router-redux'


// Insert all the reducers, which contain state for our app
import accounts from "./accountsReducer"
import users from "./usersReducer"
import loginuser from "./loginuserReducer"
import messages from "./messagesReducer"
import notes from "./notesReducer"
import quotes from "./quotesReducer"
import checklists from "./checklistsReducer"

export default combineReducers({
  users,
  accounts,
  loginuser,
  messages,
  notes,
  quotes,
  checklists,
  routing: routerReducer
});
