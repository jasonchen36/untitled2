/// Actions for viewing and managing users

import * as base from "./lib/baseActions";

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

const getUserMessages = (dispatch, id) => {
 let searchUrl = "admin/users/"+id+"/messages";
    
  return base.get(searchUrl)
    .then((response) => {
      let payload = response.data;
      if(response.data && response.data.messages) {
        payload = response.data.messages;
      }

      return payload;
    })
    .then((payload) => {
      dispatch({type: "FETCH_USER_MESSAGES_FULFILLED", payload: payload});
    })
    .catch((err) => {
      dispatch({type: "FETCH_USER_MESSAGES_REJECTED", payload: err});
    });
};

/// Fetch a list of users, optionally with search Terms
export function fetchUserMessages(id) {
  return function(dispatch) {
    getUserMessages(dispatch, id)
  };
};

/// Fetch user details by id
/// id=3
/// we don't need subject
/// data = { subject: "Hello World", body: "How are you doing?" }
export function sendMessage(id,data) {
  const messageData = {
      client: id,
      subject: data.subject,
      body: data.body
  };

  return function(dispatch) {
    base.post("/messages",messageData)
      .then((response) => {
        dispatch( { type: "SEND_MESSAGE_FULFILLED", payload: response.data});
        
      })
      .catch((err) => {
        dispatch({type:"SEND_MESSAGE_REJECTED",payload: err});
        throw err;
      })
      .then((payload) => {
        return getUserMessages(dispatch, id);
      })
      .catch((err) => {
        // end catch err  
      });
  };
};

