import d3 from 'd3';
import React, { Component } from 'react';
import { Chart, Yaxis, Xaxis } from 'react-d3-core';
// require `react-d3-basic` for Line chart component.
import { ScatterPlot } from 'react-d3-basic';
import moment from 'moment';

var width = 700,
  height = 300,
  margins = { left: 100, right: 100, top: 50, bottom: 50 },
  title = "User sample",
  // chart series,
  // field: is what field your data want to be selected
  // name: the name of the field that display in legend
  // color: what color is the line

  // y-axis!
  chartSeries = [
    {
      field: 'timestamp',
      name: 'Time',
      color: '#ff7f0e',
      symbolSize: 6,
      symbol: 'diamond'
    }
  ];

// your x accessor
const format = d3.time.format.iso; //.format("%Y-%m-%d");

const x = d => {
  console.log(d.timestamp)
  return format.parse(moment(d.timestamp).toISOString());
}
const xScale = 'time';

var axisTimeFormat = d3.time.format.multi([
  [".%L", function (d) { return d.getMilliseconds(); }],
  [":%S", function (d) { return d.getSeconds(); }],
  ["%H:%M", function (d) { return d.getMinutes(); }],
  ["%H:%M", function (d) { return d.getHours(); }],
  ["%a %d", function (d) { return d.getDay() && d.getDate() != 1; }],
  ["%b %d", function (d) { return d.getDate() != 1; }],
  ["%B", function (d) { return d.getMonth(); }],
  ["%Y", function () { return true; }]
]);

const y = d => {
  console.log(d)
  return format.parse(moment(d).toISOString());
}
const yScale = 'time';

var yAxis = d3.svg.axis()
  // .scale(y)
  .orient("left")
  .tickFormat(axisTimeFormat);

export default class Timeline extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Chart
          data={this.props.data}
          margins={margins}
          title={title}
          width={width}
          height={height}
          chartSeries={chartSeries}
        >
          <Xaxis x={x}
            xScale="time"
            xLabel="Day"
          />
          <Yaxis y={y}
            yDomain={d3.extent(this.props.data, d => y(d).getHours())}
            yScale="time"
            tickFormat={axisTimeFormat}
            yLabel="Hour"
          />
        </Chart>
      </div>
    )
  }
}