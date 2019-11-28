import ReactDOM from "https://dev.jspm.io/react-dom";
export default function (App) {
  const domElement = document.getElementById('root');
  return ReactDOM.hydrate ? ReactDOM.hydrate(App, domElement) : ReactDOM.render(App, domElement);
}