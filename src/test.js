
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';

function App (props: any) {
  return (
    <div>Hello World!</div>
  );
}

ReactDOMServer.renderToString(<App />);
