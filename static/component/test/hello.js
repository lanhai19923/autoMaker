var React = require('react');
var Hello = React.createClass({
	render: function() {
		return <h1>Hello {this.props.name}!</h1>
	}
})
exports.Hello = Hello;