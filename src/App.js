import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Store from './store';
import Authentication from './Authentication';
import ActionsContainer from './actions/ActionsContainer';


const Instructions = () => (
  <div className="instructions">
    This app will let you track when you took an action.
    <ul>
      <li>Add an action with the text box</li>
      <li>Then click "Act" to indicate that you've taken that action</li>
    </ul>
  </div>
);


// ActionsContainer.contextTypes = {
//   store: React.PropTypes.object,
// }

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
    this.auth = new Authentication(u => this.setState({ user: u }),
      () => this.setState({ user: undefined })
    );
  }

  render() {
    if (!this.state.user)
      return (
        <button onClick={this.auth.initiateSignIn}>Sign in!</button>
      )
    else
      return (
        <div>
          <div className="greeting">Hello, {this.state.user.displayName}!</div>
          {this.props.children}
        </div>
      );

  }

}


class App extends Component {
  constructor(props) {
    super(props);
    let store = new Store();
    this.state = {
      store: store,
    };
  }

  getChildContext() {
    return this.store;
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Instructions />
        <Auth store={this.state.store}>
          <ActionsContainer store={this.state.store} />
        </Auth>
      </div>
    );
  }
}

App.childContextTypes = {
  store: React.PropTypes.object,
}
export default App;
