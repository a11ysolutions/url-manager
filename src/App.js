import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import "primereact/resources/primereact.min.css";                 
import "primeicons/primeicons.css";       
import UrlManager from './components/urlManager';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Manager - Prueba Técnica</h1>
        <p>Gestor de URLs basado en árbol con filtrado y selección</p>
      </header>
      <main>
        <UrlManager />
      </main>
    </div>
  );
}

export default App;
