import "./App.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import UrlManager from "./components/UrlManager.jsx";
function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Gestor de URLs</h2>
      <UrlManager />
    </div>
  );
}

export default App;
