import React, { Component } from 'react';
import Authentication from './Authentication';
import {
  Button
} from 'reactstrap';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      pending: false,
    }
    this.auth = new Authentication(u =>
      this.setState({ user: u, pending: false }),
      () => this.setState({ user: undefined })
    );


  }
  onPendingSignIn() {
    this.setState({ pending: true });
  }

  render() {
    if (!this.state.user && !this.state.pending)
      return (
        <Button color="default" onClick={() => this.auth.initiateSignIn(this.onPendingSignIn)}>
          Sign in with Google!
        </Button>
      )
    else if (this.state.pending)
      return (<div>...Waiting for server... </div>)
    else
      return (
        <div>
          <div className="greeting">Hello, {this.state.user.displayName}!</div>
          {this.props.children}
        </div>
      );

  }
}
