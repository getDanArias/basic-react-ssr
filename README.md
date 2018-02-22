# Basic React Server Side Rendering

Render React in the server using `ReactDOM.renderToString` in Node.js and Express. 

### What You Need

* Basic concepts of React
* Basic concepts NodeJS and Express
* Any version of `node` installed
* Any version `yarn` or `npm` installed.
 
### Make it

We are going to build a basic web server using Node.js and Express. Express is a simple yet powerful Node.js web application framework that let us rapidly build robust web applications.

## Initializing the Node.js Project

Create a folder named `basic-react-ssr`. This is going to be our project folder - where all of our project files will be stored. 

Make `basic-react-ssr` your current directory and then execute the following command to create a `package.json` file to manage our project dependencies:

```bash
npm init
```

or

```bash
yarn init
```

Answer the questions as you see fit. 

Once `package.json` is created, let's go ahead and create `server.js` within the folder. This will be the entry point to our server application.

## Installing Express

To make the Express package available in our Node.js application, install the package using the following command:

```bash
npm install express --save
```

or

```bash
yarn add express
```

## Creating a Basic Server

Open up `server.js` and import the Express package by adding the following on top:

```javascript
const express = require('express');
```

Let's start by creating a function that logs information about each request in the console:

```javascript
const logger = (req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
};
```

`logger` is what we call _middleware_ in Express. _Middleware functions_ are functions that have access to the `request` object (req), the `response` object (res), and the next middleware function in the application-request cycle. The next middleware function is commonly denoted with the variable name `next`. 

We are using `next();` here because `logger` doesn't end the request-response cycle - it has to pass control to the next function; otherwise, the request will be left hanging unattended.

Our next middleware function is a function named `sayHello` that sends a response to the client:

```javascript
const sayHello = (req, res) =>
  res.status(200).send(`<h1>Hello from the Server Side</h1>`);
```

`sayHello` finishes the request-response cycle. 

So far, we've encapsulated each step on its own function - which is a great architectural move to create modularity. However, we now need to chain them together and be used by an instance of `express`:

```javascript
const app = express()
  .use(logger)
  .use(sayHello);
```

To use Express, we always need to create an instance of `express` to have access to the `express` module's methods. Through `use`, we've basically registered `logger` and `sayHello` with Express as a functional pipeline. Express will automatically inject request and response arguments to each of these functions as arguments. 

When a request occurs, each middleware function in the pipeline is invoked in the order in which they are chained. The chain invocation happens till a response is sent - which ends the request-response cycle. 

What is left for us to do is to get the Express server up and running. Let's get our `app` to listen to requests coming from `port 3000`:

```javascript
app.listen(3000, () =>
  console.log(`Express app running at 'http://localhost:3000'`)
);
```

Finally, let's run it by issuing the following command in your terminal:

```bash
node server.js
```

Alternatively, you may use `nodemon` which automatically restarts the application for you when there are any changes. Check it out [here](https://github.com/remy/nodemon).

```bash
nodemon server.js
```

To test the server, use your favorite method (Postman, browser, curl) to send a `GET` request to `localhost` on port `3000` &mdash; in the browser, visit `http://localhost:3000`. Depending on the method that we use, we will see either a string being returned as response:

```html
<h1>Hello from the Server Side</h1>
```

or the browser page will render the HTML for us. 

We've done it! We've created a basic server using Node.js and Express! 

We now need to bring React into the picture.


## Introducing React to Node and Express

We don't want to simply send the representation of an HTML element as a string, we want to do more interesting, and far more complex, stuff using React. To start, we need to install a few packages to bring React into our server. For brevity, I am going to use `yarn` but you are welcome to also use `npm`.

Let's add `react` which is a package that contains React isomorphic code.

```bash
yarn add react
```

Let's add `react-dom` which will contain a `server` module that allows us to render React components into static markup: 

```bash
yarn add react-dom
```

In our application, we are going to use everything available in the `react` package while only using `renderToString` from a module within `react-dom` &mdash; the `react-dom/server` module.

```javascript
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const logger = (req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
};

const sayHello = (req, res) =>
  res.status(200).send(`<h1>Hello from the Server Side</h1>`);

const app = express()
  .use(logger)
  .use(sayHello);

app.listen(3000, () =>
  console.log(`Express app running at 'http://localhost:3000'`)
);
```

Alright, we have the packages that we need in place. What we are missing is a React Component to render. Let's create one next!

## Creating a React Component in the Server

We are bringing a frontend technology right into the heart of the backend. It is a pretty amazing feat, but also one that needs to be performed with care. We do not have all the elements that we have in the frontend available in the backend. 

Some of us may be used to building components using JSX. I personally love JSX. However, using JSX in the Node.js layer implies creating extra complexity in our code. We'd need to transpile the JSX into JavaScript that can be understood by Node.js. As you can imagine this involves introducing tools such as Webpack and Babel to our project. My style is to keep things as simple as possible; therefore, I am going to show you how to accomplish using React in the server side without having to use JSX to avoid all that tooling overhead. In another recipe, I will show you how to use Node, React and JSX together. 

We are going to create a different file under the `basic-react-ssr` folder called `Hello.js`. This file is going to host the code for our React component. However, we are not going to build it as we traditionally build React components in the frontend. We have to wrap our React component in a Node module so that we can import it in other modules:

```javascript
// Hello.js
const React = require('react');

exports.HelloWorld = (props) => ();
```

We are creating a stateless component that we can represent through a pure function. We have replaced the traditional:

```javascript
export const HelloWorld
```

with 

```javascript
exports.HelloWorld
```

`exports.` is a shortcut that we can use in Node to add elements to the `exports` property of the local `module` object that references the current Node module &mdash; basically the file that we are working on. `module.exports` is used to define what a module actually exports and it is the object that is returned when we import a module through `require()`. 

We add `HelloWorld` as an export of our current module and we can now import it through `require('./Hello').HelloWorld` into any other module that may need it.

Let's flesh out our `HelloWorld` component without using JSX. Referring to [React Without JSX]("https://reactjs.org/docs/react-without-jsx.html") as a guide, we can take a component built with JSX such `HelloWorld`,

```javascript
exports.HelloWorld = (props) => (
	<h1>Hello from the Server Side, ${props.name}</h1>
);
``` 

where each JSX element is just syntactic sugar for calling `React.createElement(component, props, ...children)`, and build it using pure JavaScript:

```javascript
exports.HelloWorld = (props) => (
	React.createElement('h1', null, `Hello from the Server Side, ${props.name}`)
);
```

It surely involves more code and the visual presentation is not as readable as the XML-based syntax of JSX, but this simple JavaScript alternative frees us from having to deal with complex tooling. We could simplify the JavaScript code by using [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers); but for now, let's use the complete syntax.

The component is ready, now it's time to import it into `server.js`.

```javascript
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const HelloWorld = require('./Hello').HelloWorld;

const logger = (req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
};

const sayHello = (req, res) =>
  res.status(200).send(`<h1>Hello from the Server Side</h1>`);

const app = express()
  .use(logger)
  .use(sayHello);

app.listen(3000, () =>
  console.log(`Express app running at 'http://localhost:3000'`)
);
```

What we want to do next is to use our React component as part of a server response. Notice how `sayHello` sends HTML back as a response wrapped in a string. This is the nature of our template responses from the server; therefore, we somehow need to also wrap our React component in a string in order to be able to send it as a response or combine it with other HTML strings. 

This is not a difficult task! We can easily do this by using a function available within the module we imported into `ReactDOMServer`. That function is `renderToString` and, as the name indicates, it renders a component into a string. 

```javascript
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

const sayHello = (req, res) =>
  res.status(200).send(`<h1>Hello from the Server Side</h1>`);

const app = express()
  .use(logger)
  .use(sayHello);

app.listen(3000, () =>
  console.log(`Express app running at 'http://localhost:3000'`)
);
```

We create a `HelloWorld` component in `server.js` the same way that we created an `h1` component in `Hello.js` - using `React.createElement`. As the second argument of `React.createElement`, we pass an object with the properties we want the `HelloWorld` component to have. If we did not need to pass any properties, we'd simply pass `null` instead. We store the result of this function in the constant `html`. Let's now use `html` as a response from the server.

We are going to replace `sayHello` with another function, `sendHTMLPage` which sends a valid HTML file template as a response:

```javascript
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
```

Notice how we are just injecting `html` into the string response sent by `sendHTMLPage`. This is very easy to do as we are creating the HTML template through a JavaScript multi-line template literal - two different things! An HTML template refers to HTML code used to render the DOM; whereas, a JavaScript multi-line template literal simply refers to JavaScript string literals that allow embedded expressions.

Let's go ahead and send a request to port `3000` again. This time we get a different kind of response:

```html
<!DOCTYPE html>
<head>
    <title>React Server Side App</title>
</head>
<body>
    <div id="react-container">
        <h1 data-reactroot="">Hello from the Server Side, Adele</h1>
    </div>
</body>
</html>
```

On the browser, we get:

```
Hello from the Server Side, Adele
```

Just like that we have successfully integrated React into our Node.js layer without having to rely on any other third party tooling and without incurring overhead from a complex build process. 

### Enjoy!

This is the gist on how to use React in the server side. It pretty much boils down to:

* Use plain JavaScript to create React Components
* Wrap React component classes or functions as properties of `module.exports`
* Import components into another Node module just like you would any Node module.
* Render components using `renderToString` as imported from `react-dom/server`. 
* Build HTML templates through JavaScript template literals.
* Send the built HTML templates as responses from the server.

Now you are ready to explore further more the power of using React in the server side. Try composing stateless components from a stateful one to create a more complex user interface. 

Happy Coding! 