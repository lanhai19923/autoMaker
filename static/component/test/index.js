require('./hello.scss');
var React = require('react');
var ReactDOM = require('react-dom');
var Hello = require('./hello').Hello;
ReactDOM.render(<Hello name="Nate" />, document.getElementById("hello"));