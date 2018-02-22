const React = require('react');

exports.HelloWorld = (props) => (
	React.createElement('h1', null, `Hello from the Server Side, ${props.name}`)
);