import React, { Component } from 'react';

export default class Action extends Component {

  render() {
    return (
      <div> {this.props.text}
        <button onClick={() => this.props.actOn(this.props.id)}>Act</button>
        <button onClick={() => !this.props.isShown ?
          this.props.show(this.props.id)
          : this.props.hide(this.props.id)}>{!this.props.isShown ? 'Show' : 'Hide'}</button>
        <div className="timesList">
          {
            this.props.times.map(t =>
              <span key={t.id} className="timePoint" style={{ display: 'block' }}>
                {t.time.format()}
              </span>
            )}
        </div>
      </div >
    );
  }
}
