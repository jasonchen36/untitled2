import React from "react"
import { connect } from "react-redux"

import { Link  } from "react-router"

import PersonalProfileView from "./view";


export default class PersonalProfile extends React.Component {
    render() {
        return <PersonalProfileView/>
    }
}