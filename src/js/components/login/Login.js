import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router";



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

    getErrorBlock(props) {
        //todo, error not populating
        if(props && props.hasOwnProperty('error')) {
            let message='';

            if(props.error.status===400) {
                message ='Failed to login. Please make sure your credentials are correct.';
            } else if (props.error.status===401) {
                message ='Please Log in';
            }else {
                message = 'Failed to login. Please try again later. If you continue to have problems, please contact support.';
            }

            return <div class="error">{message}</div>;
        }
    }

    renderUserForm(){
        const { loginuser, error } = this.props;
        if (!loginuser.id) {
            return (
                <section class="col-sm-6 col-sm-offset-3">
                    <form id="login-form" class="standard-form standard-form-padding">
                        <label for="login-email">Email/Username</label>
                        <input id="login-email" ref={(input) => { this.email = input; }} type="email"  placeholder="Email/Username" />
                        <label for="login-password">Password</label>
                        <input id="login-password" ref={(input) => {this.password = input;}} type="password"  placeholder="Password" />
                        <button id="login-submit" onClick={this.loginLoginuser.bind(this)} class="button" type="submit">Sign In</button>
                    </form>
                    {this.getErrorBlock(error)}
                    <div class="text-center">
                        <p>Don't have an account? <Link to={"/register"}>Sign up here »</Link></p>
                        <p>Forgot password? <a href={baseWEBUrl+"/reset"}>Reset password here »</a></p>
                    </div>
                </section>
            );
        } else {
            return (
                <section class="col-sm-6 col-sm-offset-3">
                    <button onClick={this.logoutLoginuser.bind(this)}>Logout</button>
                </section>
            );
        }
    }


    render() {
        return (
            <main class="grid-container row">
                { this.renderUserForm() }
            </main>
        );
    };
}
