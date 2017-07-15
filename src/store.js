import firebase from 'firebase';
import fire from './fire';
import moment from 'moment';

let uid = 'anon';
export default class Store {
  constructor() {
    this.dbRefs = {};

    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        uid = u.uid;

        // ...
      } else {
        uid = 'anon'
        // User is signed out.
        // ...
      }
    })
  }



  watchActions(onAdd, onRemove) {
    let actionsRef = fire.database().ref(`${uid}/actions`).orderByKey().limitToLast(100);
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
    fire.database().ref(`${uid}/actions`).push(value); //, err => console.log(err.message));
  }

  doAction(id) {
    let ref = fire.database().ref(`${uid}/actionsTaken`).child(id);
    ref.push({ timestamp: firebase.database.ServerValue.TIMESTAMP });
  }
  deleteAction(id) {
    fire.database().ref(`${uid}/actions/${id}`).remove(); //, err => console.log(err.message));
    fire.database().ref(`${uid}/actionsTaken/${id}`).remove();

    // stop our listener.. don't know if we need to or not
    const refKey = 'actionsTaken' + id.substr(1);
    this.dbRefs[refKey] && this.dbRefs[refKey].off('child_added');
    this.dbRefs[refKey] = undefined;
  }

  watchActionsTakenFor(id, callback) {

    const refKey = 'actionsTaken' + id.substr(1);
    if (this.dbRefs[refKey]) return;


    let actionsTakenRef = fire.database().ref(`${uid}/actionsTaken/${id}`).orderByKey().limitToLast(50);
    actionsTakenRef.on('child_added', snapshot => {
      /* Update React state when action is added at Firebase Database */
      let x = { time: moment(snapshot.val().time), actionId: id, id: snapshot.key };
      callback(null, x);
    });

    this.dbRefs[refKey] = actionsTakenRef;
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