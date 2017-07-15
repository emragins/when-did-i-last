import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Store from './store';
import ActionsContainer from './actions/ActionsContainer';
import AuthBlock, { SignInOut } from './Auth';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button
} from 'reactstrap';

const Instructions = () => (
  <div className="instructions">
    This app will let you track when you took an action.
    <ul>
      <li>Add an action with the text box</li>
      <li>Then click "Act" to indicate that you've taken that action</li>
    </ul>
  </div>
);


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
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarToggler right onClick={this.toggle} />
          <NavbarBrand href="/">When Did I Last...</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <SignInOut />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container>
          <Row>
            <Col>
              <h1>When Did I Last...</h1>
              <Instructions />
              <AuthBlock store={this.state.store}>
                <ActionsContainer store={this.state.store} />
              </AuthBlock>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

App.childContextTypes = {
  store: React.PropTypes.object,
}
export default App;
