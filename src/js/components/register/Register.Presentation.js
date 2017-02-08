import React from "react"
import { IndexLink, Link } from "react-router";

import { createLoginuser } from "../../actions/loginuserActions"
import { renderErrors } from "../helpers/RenderErrors";


export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.createUser = this.handleCreateLoginuser.bind(this);
    }

    /// Handlers
    handleCreateLoginuser(e) {
        e.preventDefault();
        let createUserData = {
            email: this.email.value,
            first_name: this.firstName.value,
            last_name: this.lastName.value,
            password: this.password.value
        };

        this.props.handleCreateLoginuser(createUserData);
    }

    getErrorBlock(props) {
        if(props && prop) {
            let message='';

            if(props.error.status===400) {
                message ='Failed to register. Please make sure your credentials are correct.';
            }

            return <div className="errors">{message}</div>;
        } else {
            return <div></div>
        }
    }

    renderUserForm(loginuser,error){
        if (!loginuser.id) {
            return (
                <section class="col-sm-6 col-sm-offset-3">
                    <form id="register-form" class="standard-form standard-form-padding">
                        <label for="register-first-name">First Name</label>
                        <input id="register-first-name" ref={(input) => {this.firstName = input;}} type="text"  placeholder="First Name" />
                        <label for="register-last-name">Last Name</label>
                        <input id="register-last-name" ref={(input) => {this.lastName= input;}} type="text"  placeholder="Last Name" />
                        <label for="register-email">Email/Username</label>
                        <input id="register-email" ref={(input) => { this.email = input; }} type="email"  placeholder="Email/Username" />
                        <label for="register-password">Password</label>
                        <input id="register-password" ref={(input) => {this.password = input;}} type="password"  placeholder="Password" />
                        <button id="register-submit" onClick={this.createUser} class="button" type="submit">Register</button>
                    </form>
                    {renderErrors(error)}                                    
                    <div class="text-center">
                        <p>Already Have an account? <IndexLink to={"/"}>Login here »</IndexLink></p>
                    </div>
                </section>
            );
        } else {
            return (
                <section class="col-sm-6 col-sm-offset-3">
                    You are currenty logged in
                    <Link to={"/login"}>Go to Account</Link>
                </section>
            );
        }
    }

    render() {
        const { loginuser, error } = this.props;

        return (
            <main class="grid-container row">
                { this.renderUserForm(loginuser, error) }
            </main>
        );
    };
}

