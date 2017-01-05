/// Actions for viewing and managing users

import * as base from "./baseActions";

/// Fetch a list of users, optionally with search Terms
export function fetchMessages(id) {
  return function(dispatch) {
    let searchUrl = "messages";
    
    base.get(searchUrl)
      .then((response) => {
        let payload = response.data;
        if(response.data && response.data.messages) {
          payload = response.data.messages;
        }

        dispatch({type: "FETCH_MESSAGES_FULFILLED", payload:  payload});
      })
      .catch((err) => {
        dispatch({type: "FETCH_MESSAGES_REJECTED", payload: err});
      });
  };
};


/// Fetch a list of users, optionally with search Terms
export function fetchUserMessages(id) {
  return function(dispatch) {
    let searchUrl = "messages/admin/"+id;
    
    base.get(searchUrl)
      .then((response) => {
        let payload = response.data;
        if(response.data && response.data.messages) {
          payload = response.data.messages;
        }

        dispatch({type: "FETCH_USER_MESSAGES_FULFILLED", payload: payload});
      })
      .catch((err) => {
        dispatch({type: "FETCH_USER_MESSAGES_REJECTED", payload: err});
      });
  };
};

/// Fetch user details by id
export function sendMessage(data) {

  return function(dispatch) {
    base.post("/messages",data)
      .then((response) => {
        dispatch( { type: "SEND_MESSAGE_FULFILLED", payload: response.data});
      });
  };
};

