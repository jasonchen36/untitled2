import React from "react"

import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";

export default class Layout extends React.Component {
    render() {
        return <div>
            <Header/>
            <main class="grid-container row">
                <Sidebar/>
                {this.props.children}
            </main>
            <Footer/>
        </div>;
    }
}
