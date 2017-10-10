import firebase from 'firebase';
import fire from './fire';
import moment from 'moment';

let userId = 'anon';
export default class Store {
  constructor() {
    this.dbRefs = {};

    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        userId = u.uid;

        // ...
      } else {
        userId = 'anon'
        // User is signed out.
        // ...
      }
    })
  }



  watchActions(onAdd, onRemove) {
    console.log('loading actions');
    
    let actionsRef = fire.database().ref(`${userId}/actions`).orderByKey().limitToLast(100);
    actionsRef.on('child_added', snapshot => {
      /* Update React state when action is added at Firebase Database */
      let action = { text: snapshot.val(), id: snapshot.key };
      onAdd(null, action)
    });
    actionsRef.on('child_removed', snapshot => {
      /* Update React state when action is added at Firebase Database */
      let action = { text: snapshot.val(), id: snapshot.key };
      onRemove(null, action)
    });

  }

  addAction(value) {
    fire.database().ref(`${userId}/actions`).push(value); //, err => console.log(err.message));
  }

  doAction(id) {
    let ref = fire.database().ref(`${userId}/actionsTaken`).child(id);
    ref.push({ timestamp: firebase.database.ServerValue.TIMESTAMP });
  }
  deleteAction(id) {
    fire.database().ref(`${userId}/actions/${id}`).remove(); //, err => console.log(err.message));
    fire.database().ref(`${userId}/actionsTaken/${id}`).remove();

  }

  /**
   * 
   * @param {string} actionId action id
   * @param {int} pageSize 
   * @param {string} startAtKey key to start at, or undefined
   * @param {function} callback what to do with record when retrieved from store
   */
  showActionsTakenFor(actionId, fromMoment, toMoment, callback) {

    toMoment = toMoment || moment().endOf('week');

    let actionsTakenRef = fire.database().ref(`${userId}/actionsTaken/${actionId}`);

    let query = actionsTakenRef.orderByChild('timestamp').startAt(fromMoment.valueOf()).endAt(toMoment.valueOf());
    // if (startAtKey)
    //   query = query.startAt(startAtKey);

    console.log(`loading actions taken for ${actionId} (debug url: ${query.toString()})`);
    
    query.on('child_added', snapshot => {
      /* Update React state when action is added at Firebase Database */
      let x = { timestamp: snapshot.val().timestamp, actionId: actionId, id: snapshot.key };
      console.log(x);
      callback(null, x);
    });


  }

  stopWatchingActionsTakenFor(id) {
    // because the data is still in our state, it doesn't really help us to stop...
    // at least for now, because when it re-starts, then it re-adds same keys to the state.
    // doesn't make sense to delete just to re-pull from the server

    // const refKey = 'actionsTaken' + id.substr(1);
    // this.dbRefs[refKey].off('child_added');
    // this.dbRefs[refKey] = undefined;
  }
}