
import ReactDOM from 'react-dom';

export default function (App) {
  const domElement = document.getElementById('root');

  return ReactDOM.hydrate
    ? ReactDOM.hydrate(App, domElement)
    : ReactDOM.render(App, domElement);
}
