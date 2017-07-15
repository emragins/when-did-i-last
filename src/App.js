import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './fire';
import moment from 'moment';

class Action extends Component {

  render() {
    return (
      <div> {this.props.text}
        <button onClick={() => this.props.actOn(this.props.id)}>Act</button>
        <button onClick={() => !this.props.isShown ?
          this.props.show(this.props.id)
          : this.props.hide(this.props.id)}>{!this.props.isShown ? 'Show' : 'Hide'}</button>
        <div className="timesList">
          {
            this.props.times.map(t =>
              <span key={t.id} className="timePoint" style={{ display: 'block' }}>
                {t.time.format()}
              </span>
            )}
        </div>
      </div >
    );
  }
}

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
        <input type="submit" value="Add New Action" />
      </form>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions: [],
      actionsTaken: [],
      showActionsFor: []
    };
    this.dbRefs = {};
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
  doAction(id) {
    let ref = fire.database().ref('actionsTaken').child(id);
    ref.push({ time: moment().format() });
  }
  showActionsTaken = (id) => {
    const refKey = 'actionsTaken' + id.substr(1);
    if (this.dbRefs[refKey]) return;

    this.setState({ showActionsFor: [id].concat(this.state.showActionsFor) });
    let actionsTakenRef = fire.database().ref('actionsTaken/' + id).orderByKey().limitToLast(50);
    actionsTakenRef.on('child_added', snapshot => {
      /* Update React state when action is added at Firebase Database */
      let x = { time: moment(snapshot.val().time), actionId: id, id: snapshot.key };
      this.setState({ actionsTaken: [x].concat(this.state.actionsTaken) });
    });

    this.dbRefs[refKey] = actionsTakenRef;
  }
  hideActionsTaken = (id) => {
    this.setState({ showActionsFor: this.state.showActionsFor.filter(x => x != id) });

    const refKey = 'actionsTaken' + id.substr(1);
    this.dbRefs[refKey].off('child_added');
    this.dbRefs[refKey] = undefined;
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

        <div>
          { /* Render the list of actions */
            this.state.actions.map(action => {

              const isShown = this.state.showActionsFor.findIndex(x => x == action.id) > -1;
              let times = isShown
                ? this.state.actionsTaken.filter(x => x.actionId == action.id)
                : []

              return <Action key={action.id} id={action.id} text={action.text} actOn={this.doAction}
                times={times}
                isShown={isShown}
                show={this.showActionsTaken.bind(this)}
                hide={this.hideActionsTaken.bind(this)}
              />

            })
          }
        </div>
      </div>
    );
  }
}

export default App;
