// dependencies
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import { syncHistoryWithStore } from 'react-router-redux';

// Entrypoint for css. (using sass)
import '../scss/app.scss';

import Layout from "./components/Layout";

// Page components.  Should we move this to a pages folder?
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Users from "./components/users/Users";
import AccountProfile from "./components/account-profile/AccountProfile";
import PersonalProfile from "./components/personal-profile/PersonalProfile";
import TaxProfile from "./components/tax-profile/TaxProfile";
import Uploads from "./components/uploads/Uploads";
import Checklist from "./components/checklist/Checklist";
import Messages from "./components/messages/Messages";
import Notes from "./components/notes/Notes";
import BillingStatus from "./components/billing-status/BillingStatus";

// The Redux store file
import store from "./store";

// For history and pages to work with redux
const history = syncHistoryWithStore(browserHistory, store);

// React app insertion
const app = document.getElementById('app');

// react router - client side routing
ReactDOM.render(<Provider store={store}>
    <Router history={history}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Login}></IndexRoute>
            <Route path="register" name="register" component={Register}></Route>
            <Route path="users" name="users" component={Users}></Route>
            <Route path="users/:userId/account-profile" name="account-profile" component={AccountProfile}></Route>
            <Route path="users/:userId/personal-profile" name="personal-profile" component={PersonalProfile}></Route>
            <Route path="users/:userId/tax-profile" name="tax-profile" component={TaxProfile}></Route>
            <Route path="users/:userId/uploads" name="uploads" component={Uploads}></Route>
            <Route path="users/:userId/checklist" name="checklist" component={Checklist}></Route>
            <Route path="users/:userId/messages" name="messages" component={Messages}></Route>
            <Route path="users/:userId/notes" name="notes" component={Notes}></Route>
            <Route path="users/:userId/billing-status" name="billing-status" component={BillingStatus}></Route>
        </Route>
    </Router>
</Provider>, app);
