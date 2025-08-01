import './App.css';
import UrlManager from './components/urlManager';
import { appOptions, clientsOptions, templatesOptions, editionsOptions } from './utils/appOptions';

function App() {
  return (
    <div className="App">
      <h2>Gestor de URLs</h2>
      <UrlManager
        appOptions={appOptions || []}
        clientsOptions={clientsOptions || []}
        templatesOptions={templatesOptions || []}
        editionsOptions={editionsOptions || []}
      />
    </div>
  );
}
export default App;
