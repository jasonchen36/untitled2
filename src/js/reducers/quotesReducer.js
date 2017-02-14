// The reducer for state involving handling taxreturns (viewing all users in the app, or details for an individual user)
import _ from "lodash";
import { updateListWithObjectById } from "./lib/reducerHelpers";

export default function reducer(state={
    quotes:null,
    fetching: false,
    fetched: false,
    updating: false,
    updated: false,
    error: null,
  }, action) {
    switch (action.type) {
      // Users events
      case "REFRESH_UPDATE_STATE": {
        return {...state, 
          updating: false,
          updated: false,
          error:null
        };
      }
      case "ADD_ADMIN_LINE_ITEM_REJECTED": {
        return { ...state,
          updating: false,
          updated:false,
          error:action.payload
        }
      }
      case "ADDING_ADMIN_LINE_ITEM": {
        return {...state, 
          updating: true,
          updated: false,
          error:null
        };
      }
      case "ADD_ADMIN_LINE_ITEM_SUCCEEDED": {
        return {...state, 
          updating: false,
          updated: true
        };
      }
      case "FETCH_QUOTE_FULFILLED": {
        return {...state, fetching: false, error:null, fetch: true, quotes:action.payload};
      }
      case "FETCH_QUOTE_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
    }

    return state;
};

