import React from "react";

import Sidebar from "../layout/Sidebar";

// Footer for all pages
export default class PersonalProfileLayout extends React.Component {
    render() {
        return (
            <main class="grid-container row">
                <Sidebar/>
                <section class="col-sm-8">
                    <h1>Personal Profile</h1>
                </section>
            </main>
        );
    }
}
