// The reducer for state involving handling users (viewing all users in the app, or details for an individual user)
import _ from "lodash";

export default function reducer(state={
    notes: null,
    fetching: false,
    fetched: false,
    creating: false,
    created: false,
    error: null
  }, action) {
    switch (action.type) {
      // Users events
      case "FETCH_NOTES_FULFILLED": {
        return {...state, fetching: false, fetched:true, error:null, notes:action.payload};
      }
      case "FETCH_NOTES_REJECTED": {
        return { ...state,
              fetching:false,
              fetched:false,
              error: action.payload
        }
      }
      case "CREATE_NOTE_FULFILLED": {
        let notes = _.cloneDeep( state.notes);
        notes.push(action.payload);
        return {...state, fetching: false, fetched:true, error:null, notes:notes};
      }
      case "CREATE_NOTE_REJECTED": {
        return { ...state,
              fetching:false,
              fetched:false,
              error: action.payload
        }
      }
      case "DELETE_NOTES_FULFILLED": {
        let noteId = action.payload.noteId;
        let notes = _.filter(_.cloneDeep( state.notes),(n) => {
          return n.id !== noteId;
        });
        return {...state, fetching: false, fetched:true, error:null, notes:notes};
      }
      case "DELETE_NOTES_REJECTED": {
        return { ...state,
          fetching:false,
          fetched:false,
          error: action.payload
        }
      }
      case "MARK_NOTE_AS_DONE_FULFILLED": {
        const note = action.payload;
        let notes = _.cloneDeep(state.notes);
        const noteToUpdate = notes.findIndex((n) => { return n.id===note.id });
        notes[noteToUpdate] = note;

        return {...state, fetching: false, fetched:true, error:null, notes:notes};
      }
      case "MARK_NOTE_AS_DONE_REJECTED": {
        return { ...state,
          fetching:false,
          fetched:false,
          error: action.payload
        }
      }
    }

    return state;
};
