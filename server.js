const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const HelloWorld = require('./Hello').HelloWorld;

const html =
	ReactDOMServer
		.renderToString(React.createElement(HelloWorld, {name: `Adele`}));

const logger = (req, res, next) => {
	console.log(`${req.method} request for '${req.url}'`);
	next();
};

const sendHTMLPage = (req, res) => {
	res.status(200).send(`
    <!DOCTYPE html>
        <head>
            <title>React Server Side App</title>
        </head>
        <body>
            <div id="react-container">${html}</div>
        </body>
    </html>
  `)
};

const app = express()
	.use(logger)
	.use(sendHTMLPage);

app.listen(3000, () =>
	console.log(`Express app running at 'http://localhost:3000'`)
);