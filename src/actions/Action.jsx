import React, { Component } from 'react';
import {
  Button,
  Card,
  CardTitle,
  CardBlock
} from 'reactstrap';
import Timeline from './../stats/Timeline';
import moment from 'moment';

const TimePoint = (props) => {
  return (<span key={props.id} className="timePoint" style={{ display: 'block' }}>
    {moment(props.time).format("dddd, MMM DD hh:mm a")}
  </span>)
}

export default class Action extends Component {
  constructor(props) {
    super(props);
    this.state = { startDelete: false }
  }
  componentWillMount = () => {
    const weekAgo = moment().startOf('week');
    this.props.show(this.props.id, weekAgo);
  }
  confirmDelete() {
    this.setState({ startDelete: true })
  }
  deleteConfirmed() {
    this.props.delete(this.props.id);
  }
  render() {
    const deleteElements = this.state.startDelete
      ? (<div className="deleteBlock">Are you sure you want to delete this item?  You will not be able to recover the data.
              <br />
        <Button color="default" onClick={() => this.cancelDelete()}>Cancel</Button>
        <Button color="danger" onClick={() => this.deleteConfirmed()}>Yes, I don't need it any more</Button>
      </div>)
      : <div className="deleteBlock"></div>

    // const timelineData = this.props.times.map(t => {
    //   return { index: t.id, timestamp: t.timestamp };
    // });

    //console.log(timelineData);

    //style={{ display: (this.props.isShown ? 'visible' : 'none') }}
    return (
      <Card>
        <CardTitle>{this.props.text}</CardTitle>
        <CardBlock>
          {deleteElements}

          <Button color="primary" onClick={() => this.props.actOn(this.props.id)}>Act</Button>
          <Button color="danger" onClick={() => this.confirmDelete()}>Delete</Button>
          {/* <Button color="default" onClick={() => this.props.show(this.props.id, weekAgo)}>Week View</Button> */}
          <div >
            <h4>Week of {moment().startOf('week').format('MMM DD YYYY')}</h4>
            <div>Total in view: {this.props.times.length}</div>
            <div className="timesList">

              {
                this.props.times.map(t =>
                  <TimePoint key={t.id} id={t.id} time={t.timestamp} />
                )}
            </div>
          </div>
        </CardBlock>
      </Card >
    );
  }
}
