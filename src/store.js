import fire from './fire';
import moment from 'moment';

export default class Store {
  constructor() {
    this.dbRefs = {};


  }
  
  watchActions(onAdd, onRemove) {
    let actionsRef = fire.database().ref('actions').orderByKey().limitToLast(100);
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
    fire.database().ref('actions').push(value); //, err => console.log(err.message));
  }

  doAction(id) {
    let ref = fire.database().ref('actionsTaken').child(id);
    ref.push({ time: moment().format() });
  }

  watchActionsTakenFor(id, callback) {

    const refKey = 'actionsTaken' + id.substr(1);
    if (this.dbRefs[refKey]) return;


    let actionsTakenRef = fire.database().ref('actionsTaken/' + id).orderByKey().limitToLast(50);
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