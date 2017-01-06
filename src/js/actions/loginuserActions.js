import * as base from "./baseActions";

/// Fetch data for logged in user
export function fetchLoginuser() {
  return function(dispatch) {
    base.get("/users/me")
      .then((response) => {
        dispatch({
          type: "FETCH_LOGINUSER_FULFILLED",
          payload: response.data });
      })
      .catch((err) => {
        dispatch({type:"FETCH_LOGINUSER_REJECTED", payload:err});
      });
  };
};

/// Login
/// data = { email:"login email", password: "login pass" }
export function loginLoginuser(data) {
  const email = data.email;
  const password = data.password;

   return function(dispatch) {
    base.post("/login",{
     email:email,
     password:password
    })
      .then((response) => {
        localStorage.setItem('auth_token', response.data.token);
        dispatch({type: "LOGIN_LOGINUSER_FULFILLED", authenticated:true,payload:  response.data});
        return base.get("/users/me");
      })
      .then((response) => {
        dispatch({type: "FETCH_LOGINUSER_FULFILLED",payload:response.data});

      })
      .catch((err) => {
        dispatch({type: "LOGIN_LOGINUSER_REJECTED", payload: err});
      })
  };
};

/// logout user
export function logoutLoginuser() {
   return dispatch => {
    dispatch({
      type: "LOGOUT_LOGINUSER_REQUEST"
    });
    localStorage.removeItem('auth_token');
    dispatch({
      type: "LOGOUT_LOGINUSER_FULFILLED",
      authenticated:false
    });
     dispatch({
      type: "CLEAR_USERS"
    });

  };
};

// create login user
// data : { email: "email@email.com", first_name: "Bob", last_name:"Sagat", password:"password" }
export function createLoginuser(data) {
  return function(dispatch) {
     //TODO: pass create user variables
    base.post("/users",
      data
     )
      .then((response) => {
        localStorage.setItem('auth_token', response.data.token);
        dispatch({type: "CREATE_LOGINUSER_FULFILLED", authenticated:true,payload:  response.data});
        return base.get("/users/me");
      })
      .then((response) => {
        dispatch({type: "FETCH_LOGINUSER_FULFILLED",payload:response.data});

      })
      .catch((err) => {
        dispatch({type: "CREATE_LOGINUSER_REJECTED", payload: err});
      });
  };
}

