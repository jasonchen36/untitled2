import React from "react"
import { connect } from "react-redux"

import { baseWEBUrl } from "../../config.js"

import { createLoginuser,loginLoginuser, fetchLoginuser, logoutLoginuser } from "../../actions/loginuserActions"

@connect((store) => {
    return {
        loginuser: store.loginuser.loginuser,
        error: store.loginuser.error
    };
})

export default class Layout extends React.Component {
    componentWillMount() {
        this.props.dispatch(fetchLoginuser())
    }

    componentWillReceiveProps(nextProps) {
        const wasNotLoggedIn = !this.props.loginuser.id;
        const isLoggedIn = !(!nextProps.loginuser.id);
        if(wasNotLoggedIn && isLoggedIn) {
            this.props.router.push('/users');
        }
    }


    /// Handlers
    createLoginuser() {
        this.props.dispatch(createLoginuser())
    }

    logoutLoginuser(e) {
        this.props.dispatch(logoutLoginuser())
    }

    loginLoginuser(e) {
        e.preventDefault();
        let loginData = {
            email: this.email.value,
            password: this.password.value
        };
        this.props.dispatch(loginLoginuser(loginData))
    }


    render() {

        // TODO: move this to a helper class
        const addFullNameForUser = (user) => {
            if (user.name) {
                user.fullName = user.name;
            }
            else if(user.first_name && user.last_name) {
                user.fullName= user.first_name + ' ' + user.last_name;
            } else if (user.first_name) {
                user.fullName = user.first_name;

            } else {
                user.fullName = user.last_name;
            }

            return user;
        };

        let { loginuser, error } = this.props;
        loginuser = addFullNameForUser(loginuser);
        const name=<h1>{loginuser.fullName}</h1>;
        let createUserButtons='';

        function ErrorBlock(props) {
            if(props.error) {
                let message='';

                if(props.error.status===400) {
                    message ='Failed to login. Please make sure your credentials are correct.';
                } else if (props.error.status===401) {
                    message ='Please Log in';
                }else {
                    message = 'Failed to login. Please try again later. If you continue to have problems, please contact support.';
                }

                return <div className="errors">{message}</div>;
            } else {
                return <div></div>
            }
        }

        if (!loginuser.id) {
            createUserButtons =<div>
                <form role="form">
                    <div className="form-group">
                        <input ref={(input) => { this.email = input; }} type="email"  placeholder="Email" />
                        <input ref={(input) => {this.password = input;}} type="password"  placeholder="Password" />
                    </div>
                    <button onClick={this.loginLoginuser.bind(this)} class="button">login user</button>
                </form>
                <button onClick={this.createLoginuser.bind(this)} class="button grey">create user</button>
                <ErrorBlock error={error} />
                <div>
                    Forgot password? <a href={baseWEBUrl+"/reset"}>Click Here</a>
                </div>
            </div>;
        } else {
            createUserButtons =<div>
                <button onClick={this.logoutLoginuser.bind(this)}>logout user</button>
            </div>;
        }

        return (
            <main class="grid-container row">
                <section class="col-sm-12">{name}{createUserButtons}</section>
            </main>
        );
    };
}
