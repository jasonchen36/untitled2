// The reducer for state involving handling users (viewing all users in the app, or details for an individual user)

export default function reducer(state={
    messages: null,
    message: null,
    user:null,
    fetching: false,
    fetched: false,
    error: null,
  }, action) {
    switch (action.type) {
      // Users events
      case "SEND_MESSAGE_FULFILLED": {
        return {...state, fetching: true};
      }
      case "FETCH_USER_MESSAGES_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
        case "FETCH_MESSAGES_REJECTED": {
        return {...state, fetching: false, error: action.payload};
      }
      case "FETCH_MESSAGES_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          messages: action.payload,
        };
      }
      case "FETCH_USER_MESSAGES_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          messages: action.payload,
        };
      }
    }

    return state;
};
