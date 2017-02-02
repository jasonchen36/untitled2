// The reducer for state involving handling users (viewing all users in the app, or details for an individual user)

export default function reducer(state={
    messages: null,
    message: null,
    messageSent:false,
    user:null,
    fetching: false,
    fetched: false,
    sendError: null,
    messagesError:null,
    error:null
  }, action) {
    switch (action.type) {
      // Users events
      case "SEND_MESSAGE_FULFILLED": {
        return {...state, fetching: true, messageSent:true, error:null, sendError:null};
      }
      case "SEND_MESSAGE_REJECTED": {
        return { ...state,
              sendError:action.payload,
              error:action.payload
        }
      }
      case "FETCH_USER_MESSAGES_REJECTED": {
        return {...state, fetching: false, messagesError: action.payload, error: action.payload, messageSent:false};
      }
      case "FETCH_USER_MESSAGES_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          messages: action.payload,
          messageSent: false,
          messagesError: null,
          error:null
        };
      }
    }

    return state;
};
