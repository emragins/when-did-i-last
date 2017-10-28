import React, { Component } from 'react';
import NewActionForm from './NewActionForm';
import Action from './Action';
import moment from 'moment';
import dotProp from 'dot-prop-immutable';

class TransformationsClass {

  /**
   * 
   * @param {object} action {text, id}
   */
  addAction(action) {
    // // Add todo:
    // state = dotProp.set(state, 'todos', list => [...list, { text: 'cleanup', complete: false }])
    // // or with destructuring assignment
    // state = { ...state, todos: [...state.todos, { text: 'cleanup', complete: false }] };
    // //=>  { todos: [{text: 'cleanup', complete: false}] }

    action.timeIds = [];

    var newAction = {
      id: action.id,
      name: action.text,
      timeIds: [],
      isShown: false,
      total: 0,
      currentWeek: moment().startOf('week')
    }

    return (state) => {
      state = dotProp.set(state, `actions.byId.${newAction.id}`, newAction);
      state = dotProp.set(state, `actions.allIds`, x => [...x, newAction.id]);
      return state;
    }
  }

  /**
   * 
   * @param {object} action {text, id}
   */
  removeAction(action) {

    return (state) => {

      let timesToRemove = state.actions.byId[action.id].timeIds;

      // remove action
      state = dotProp.delete(state, `actions.byId.${action.id}`);

      // remove index
      let index = state.actions.allIds.indexOf(action.id);
      state = dotProp.set(state, `actions.allIds`, [
        ...state.actions.allIds.slice(0, index),
        ...state.actions.allIds.slice(index + 1)
      ]);

      // remove times
      timesToRemove.map(tid => state = dotProp.delete(state, `times.byId.${tid}`));

      // remove ids from allIds that are contained in timesToRemove
      var s = state.times.allIds.filter(tid => timesToRemove.indexOf(tid) < 0);
      state = dotProp.set(state, 'times.allIds', s);

      return state;
    }
  }

  /**
   * 
   * @param {string} id actionId
   * @param {object} time {id, timestamp }
   */
  addTimeToAction(id, time) {
    return (state, currentProps) => {
      var action = state.actions.byId[id];
      // add timeId to action
      action.timeIds = action.timeIds.concat(time.id);
      time.actionId = action.id;

      // add timeId to action
      state = dotProp.set(state, `actions.byId.${id}`, action);
      // add time to times
      state = dotProp.set(state, 'times.allIds', state.times.allIds.concat(time.id));
      state = dotProp.set(state, `times.byId.${time.id}`, time);

      return state;

      //   return {
      //     ...state,
      //     actions: {
      //       ...state.actions,
      //       // replace this action
      //       byId: {
      //         ...state.actions.byId,
      //         [id]: action,
      //       },
      //       // add action to all -- NOT THIS TASK!
      //       //allIds: state.actions.allIds.concat(id),
      //     },
      //     times: {
      //       ...state.times,
      //       // add time
      //       byId: {
      //       ...state.times.byId,
      //         [time.id]: time,
      //       },
      //       allIds: state.times.allIds.concat(time.id),
      //     }
      //   };
    }
  }

  setDatesShown(id, fromMoment, toMoment) {
    return (state) => {
      
    }
  }
}

const Transformations = new TransformationsClass();

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