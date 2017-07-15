import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './fire';

class NewActionForm extends Component {
  constructor(props) {
    super(props);
  }

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
        <input type="submit" />
      </form>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { actions: [] };
  }
  componentWillMount = () => {
    let actionsRef = fire.database().ref('actions').orderByKey().limitToLast(100);
    actionsRef.on('child_added', snapshot => {
      /* Update React state when action is added at Firebase Database */
      let action = { text: snapshot.val(), id: snapshot.key };
      this.setState({ actions: [action].concat(this.state.actions) });

    });
  }
  addAction(value) {
    fire.database().ref('actions').push(value);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
        </p>
        <NewActionForm onAdd={this.addAction} />

        <ul>
          { /* Render the list of actions */
            this.state.actions.map(action => <li key={action.id}>{action.text}</li>)
          }
        </ul>
      </div>
    );
  }
}

export default App;
