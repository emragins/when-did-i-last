import React, { Component } from 'react';
import NewActionForm from './NewActionForm';
import Action from './Action';
import Transformations from './actionReducers';
import moment from 'moment';

export default class ActionsContainer extends Component {//

  constructor(props) {
    super(props);
    this.state = {
      showActionsFor: [],
      actions: {
        allIds: ['a123'],
        byId: {
          a123: {
            id: 'a123',
            name: '_fake',
            timeIds: ['t123'],
            isShown: false,
            total: 20,
            currentWeek: moment().startOf('week'),
          }
        }
      },
      times: {
        byId: {
          t123: {
            id: 't123',
            time: moment(),
            actionId: 'a123',
          }
        },
        allIds: ['t123']
      },
    };
  }
  componentWillMount = () => {
    this.props.store.watchActions(
      (err, action) => this.setState(Transformations.addAction(action)), // this.setState({ actions: [action].concat(this.state.actions) }),
      (err, action) => this.setState(Transformations.removeAction(action)) //this.setState({ actions: this.state.actions.filter(a => a.text !== action.text) })
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

  showActionsTaken = (id, fromMoment, toMoment) => {

    this.setState(Transformations.setDatesShown(id, fromMoment, toMoment)); //{ showActionsFor: [id].concat(this.state.showActionsFor) });

    this.props.store.showActionsTakenFor(id, fromMoment, toMoment, (err, x) => {
      //console.log('adding action', x);
      this.setState(Transformations.addTimeToAction(id, x));

      //this.setState({ actionsTaken: [x].concat(this.state.actionsTaken) })
    });
  }

  hideActionsTaken = (id) => {
    this.setState({ showActionsFor: this.state.showActionsFor.filter(x => x !== id) });

    this.props.store.stopWatchingActionsTakenFor(id);
  }

  render() {
    console.log(this.state.actions)

    return (
      <div className="actionsContainer">
        <NewActionForm onAdd={this.addAction.bind(this)} />


        <div>
          { /* Render the list of actions */
            this.state.actions.allIds.map(id => {
              const action = this.state.actions.byId[id];

              // const isShown = this.state.showActionsFor.findIndex(x => x === action.id) > -1;
              // let times = isShown
              //   ? this.state.actionsTaken.filter(x => x.actionId === action.id)
              //   : []

              return <Action key={action.id} id={action.id}
                actOn={this.doAction.bind(this)}
                delete={this.deleteAction.bind(this)}
                show={this.showActionsTaken.bind(this)}
                hide={this.hideActionsTaken.bind(this)}
                action={action}
                times={action.timeIds.map(t => this.state.times.byId[t])}

              />

            })
          }
        </div>
      </div>
    );
  }
}