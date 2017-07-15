import React, { Component } from 'react';

export default class NewActionForm extends Component {
  onAdd = (e) => {
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the action to Firebase */
    this.props.onAdd(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input

  }

  render() {
    return (
      <form onSubmit={this.onAdd.bind(this)}>
        <input type="text" ref={el => this.inputEl = el} />
        <input type="submit" value="Add New Action" />
      </form>
    )
  }
}
