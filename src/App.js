import logo from './logo.svg';
import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import "primereact/resources/primereact.min.css";                 
import "primeicons/primeicons.css";       
import UrlManager from './components/urlManager';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>URL Manager - Prueba Técnica</h1>
      </header>
      <main>
        <UrlManager />
      </main>
    </div>
  );
}

export default App;
