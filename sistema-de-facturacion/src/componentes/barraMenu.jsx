//import React, { useState} from 'react';
import './barraMenu.css';
import {Link} from "react-router-dom";

//vamos a preparar nuestra barra 
function Barramenu() {
  return (
    <div className="Barramenu">
      <Link to="/" className='box'>Inicio</Link>
      <Link to="/facturacion" className='box'>Facturacion</Link>
      <Link to="/cliente" className='box'>cliente</Link>
      <Link to="/empleado" className='box'>empleados</Link>
      <Link to="/inventario" className='box'>inventarios</Link>
    </div>
  );
}

export default Barramenu;