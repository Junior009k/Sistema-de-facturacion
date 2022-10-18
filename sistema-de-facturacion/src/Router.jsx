import './App.css';
import App from './App';
//import Barramenu from './componentes/barraMenu';
import {BrowserRouter as Router,Route} from "react-router-dom";
import facturacion from './componentes/facturacion';
import cliente from './componentes/cliente';
import  empleado from './componentes/empleado';
import  inventario from './componentes/inventario';

function Rutas() {
  return (
    <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/facturacion" component={facturacion} />
        <Route exact path="/cliente" component={cliente} />
        <Route exact path="/empleado" component={empleado} />
        <Route exact path="/inventario" component={inventario} />
     </Router>
  );
}

export default Rutas;
