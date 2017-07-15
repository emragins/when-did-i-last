import React, { Component } from 'react';
import Authentication from './Authentication';
import {
  Button
} from 'reactstrap';

export default class AuthBlock extends Component {
  constructor(props) {
    super(props);
    this.state = { authed: false };

    this.auth = new Authentication(u =>
      this.setState({ authed: true })
      , () => this.setState({ authed: false })
    );

  }

  render() {
    return !this.state.authed
      ? <div>Please sign in to continue...</div>
      : <div>{this.props.children}</div>
  }
}


export class SignInOut extends Component {
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
    if (this.state.pending)
      return (<span>Waiting on Server...</span>)
    if (!this.state.user)
      return (
        <Button color="default" onClick={() => this.auth.initiateSignIn(this.onPendingSignIn)}>
          Sign in with Google!
        </Button>
      )
    else
      return (
        <span>
          <span className="greeting">Hello, {this.state.user.displayName}</span>
          <Button color="default" onClick={() => this.auth.initiateSignOut()}>Sign Out</Button>
        </span>
      )


  }
}
