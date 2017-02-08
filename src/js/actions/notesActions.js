/// Actions for viewing and managing users

import * as base from "./lib/baseActions";

/// Fetch a list of users, optionally with search Terms
export function fetchNotes(userId) {
  return function(dispatch) {
    
    getNotes(userId)
        .then((payload) => {
        dispatch({type: "FETCH_NOTES_FULFILLED", payload:  payload});
      })
      .catch((err) => {
        dispatch({type: "FETCH_NOTES_REJECTED", payload: err});
      });
  };
};

const getNotes = function(userId) {
  let url = "admin/users/"+userId+"/notes";
  return base.get(url)
    .then((response) => {
      let payload = response.data;

      if(response.data && response.data.notes) {
        payload = response.data.notes;
      }

      return payload;
    });
};

export function createNote(userId,message){
  return function(dispatch) {
    let url = "admin/users/"+userId+"/notes";
    let body = {"message":message};

    return base.post(url,body)
      .then((response) => {
        let payload = response.data;
        dispatch({type: "CREATE_NOTE_FULFILLED", payload: payload});
      })
      .catch((err) => {
        dispatch({type: "CREATE_NOTE_REJECTED", payload: err});
      });
  };
};

export function deleteNote(userId,noteId) {
  return function(dispatch) {
    let url = "admin/users/"+userId+"/notes/"+noteId;

    return base.del(url)
      .then((response) => {
        dispatch({type:"DELETE_NOTE_FULFILLED", payload: {userId:userId, noteId:noteId}});
      })
      .catch((err) => {
        dispatch({type:"DELETE_NOTE_REJECTED", payload: err});
      });
  };
};

export function markAsDone(userId, noteId, done) {
  return function(dispatch) {
  
    let url = "admin/users/"+userId+"/notes/"+noteId + "/done";
    let body = {"done": done};

    return base.put(url, body)
      .then((response) => {
        dispatch({type:"MARK_NOTE_AS_DONE_FULFILLED", payload: response.data});
      })
      .catch((err) => {
        dispatch({type:"MARK_NOTE_AS_DONE_REJECTED", payload: err});
      });
  };
};
