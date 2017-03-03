import React from "react"
import _ from "lodash";

import { updateState, initUpdateState, renderUpdateButton } from "../helpers/RenderUpdateButton";

import { renderErrors } from "../helpers/RenderErrors";

export default class InvoiceSendBillToClient extends React.Component {

  constructor() {
    super();

    this.updateState = {value:initUpdateState()};

    this.submit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
  };

  componentWillReceiveProps(nextProps) {
    this.updateState.value = updateState(nextProps.updating, nextProps.updated);
  };

  handleSubmit(e) {
    e.preventDefault();

    const { quoteId } = this.props;

    this.props.submitHandler(quoteId);
  }

  render() {
      //todo, figure out what "No documents added to this package" means
      //todo, pass in data to table
      const { submitHandler, quoteId, updating, updated, error } = this.props;
      return  <form onSubmit={this.submit}>
        { renderUpdateButton(this.updateState,"Send Bill To Client", "Sending Bill to Client", "Bill Sent") }
        { renderErrors(error)}
      </form>
  }
}
