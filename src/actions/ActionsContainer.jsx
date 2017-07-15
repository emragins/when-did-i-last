import React, { Component } from 'react';
import NewActionForm from './NewActionForm';
import Action from './Action';

export default class ActionsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showActionsFor: [],
      actions: [],
      actionsTaken: [],
    };
  }
  componentWillMount = () => {
    this.props.store.watchActions(
      (err, action) => this.setState({ actions: [action].concat(this.state.actions) }),
      (err, action) => this.setState({ actions: this.state.actions.filter(a => a.text != action.text) })
    );
  }
  addAction(value) {
    this.props.store.addAction(value);
  }
  doAction(id) {
    this.props.store.doAction(id);
  }
  deleteAction(id) {
    this.props.store.deleteAction(id);
  }
  showActionsTaken = (id) => {
    this.setState({ showActionsFor: [id].concat(this.state.showActionsFor) });
    this.props.store.watchActionsTakenFor(id, (err, x) =>
      this.setState({ actionsTaken: [x].concat(this.state.actionsTaken) }));
  }

  hideActionsTaken = (id) => {
    this.setState({ showActionsFor: this.state.showActionsFor.filter(x => x != id) });

    this.props.store.stopWatchingActionsTakenFor(id);
  }

  render() {
    return (
      <div className="actionsContainer">
        <NewActionForm onAdd={this.addAction.bind(this)} />

        <div>
          { /* Render the list of actions */
            this.state.actions.map(action => {

              const isShown = this.state.showActionsFor.findIndex(x => x == action.id) > -1;
              let times = isShown
                ? this.state.actionsTaken.filter(x => x.actionId == action.id)
                : []

              return <Action key={action.id} id={action.id} text={action.text}
                actOn={this.doAction.bind(this)}
                delete={this.deleteAction.bind(this)}
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