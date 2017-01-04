import React from "react"

import Header from "./layout/Header";
import Footer from "./layout/Footer";

export default class Layout extends React.Component {
    render() {
        return <div>
            <Header/>
            <main class="grid-container row">
                {this.props.children}
            </main>
            <Footer/>
        </div>;
    }
}
