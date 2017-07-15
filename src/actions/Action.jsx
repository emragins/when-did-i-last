import React, { Component } from 'react';
import {
  Button,
  Card,
  CardTitle,
  CardBlock
} from 'reactstrap';

const TimePoint = (props) => {
  return (<span key={props.id} className="timePoint" style={{ display: 'block' }}>
    {props.time.format()}
  </span>)
}

export default class Action extends Component {
  constructor(props) {
    super(props);
    this.state = { startDelete: false }
  }
  confirmDelete() {
    this.setState({ startDelete: true })
  }
  deleteConfirmed() {
    this.props.delete(this.props.id);
  }
  render() {
    const deleteElements = this.state.startDelete
      ? (<div>Are you sure you want to delete this item?  You will not be able to recover the data.
              <br />
        <Button color="default" onClick={() => this.cancelDelete()}>Cancel</Button>
        <Button color="danger" onClick={() => this.deleteConfirmed()}>Yes, I don't need it any more</Button>
      </div>)
      : <div></div>
    return (
      <Card>
        <CardTitle>{this.props.text}</CardTitle>
        <CardBlock>
          {deleteElements}

          <Button color="primary" onClick={() => this.props.actOn(this.props.id)}>Act</Button>
          <Button color="danger" onClick={() => this.confirmDelete()}>Delete</Button>
          <Button color="default" onClick={() => !this.props.isShown ?
            this.props.show(this.props.id)
            : this.props.hide(this.props.id)}>{!this.props.isShown ? 'Show' : 'Hide'}</Button>
          <div className="timesList">
            {
              this.props.times.map(t =>
                <TimePoint id={t.id} time={t.time} />
              )}
          </div>
        </CardBlock>
      </Card >
    );
  }
}
