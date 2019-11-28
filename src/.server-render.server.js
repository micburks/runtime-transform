import ReactDOMServer from 'react-dom/server.js';
export default function (App) {
  return `
<body>
  <div id="root">${ReactDOMServer.renderToString(App)}</div>
  <script type="module" src="main.js"></script>
</body>
`;
}