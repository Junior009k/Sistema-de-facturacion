import './App.css';
//import Barramenu from './componentes/barraMenu';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './componentes/home';
import Facturacion from './componentes/facturacion';
import Cliente from './componentes/cliente';
import  Empleado from './componentes/empleado';
import  Inventario from './componentes/inventario';
import Barramenu from './componentes/barraMenu';

function App() {
  return (
    
  <div className="App">
    
    <BrowserRouter>,
    
    <Barramenu/>
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/facturacion" element={<Facturacion/>} />
        <Route path="/cliente" element={<Cliente/>} />
        <Route path="/empleado" element={<Empleado/>} />
        <Route path="/inventario" element={<Inventario/>} />
    </Routes>
    </BrowserRouter>,
  </div>
      
  );
}

export default App;
