import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"
import { applyMiddleware, createStore, combineReducers } from "redux"

// The files that contain all the state for the app
import reducer from "./reducers"

const middleware = applyMiddleware(promise(), thunk, logger())

// The store for our app (redux)
// All the state is kept in reducers, and combined into this store for the app
export default createStore(reducer, middleware)
