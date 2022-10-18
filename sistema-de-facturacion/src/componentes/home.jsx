import  './Facturacion.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState ,useEffect} from 'react';
import  './inventario.css'
import { collection, query, getDocs,doc,addDoc,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function Home() {


  useEffect(()=>{

    cargarDatosFactura()
  },[])

const cargarDatosFactura=()=>
{
  //declaro mi query
  const consulta = query(collection(db, "factura"));
  //esta es la que se encargara de ejecutar el query como si fuera una promesas
  const querySnapshot = getDocs(consulta);
  querySnapshot.then((querySnapshot) => 
  {
    let array=[]
    //cargamos los datoss de nuestra factura
    querySnapshot.forEach((doc) => 
    {
      
      array=[...array ,<div className='item' key={(doc.id + "1")}type="text">{doc.data().id}</div>]
      array=[...array ,<div className='item' key={(doc.id + "4")}>{doc.data().fecha}</div>]
      array=[...array ,<div className='item' key={(doc.id + "2")}>{doc.data().cliente}</div>]
      array=[...array ,<div className='item' key={(doc.id + "3")}>{doc.data().empleado}</div>]
      array=[...array ,<div className='item' key={(doc.id + "4")}>{"RD$" + doc.data().total}</div>]   
      
    });

    setItem(array)
  });
}
const [item, setItem] = useState(false);
    return (
      <div className="home">
          Bienvenido al menu de facturacion

          Mi Factura 
          
          <div className='container'>
            
            <div className='item' type="text">{"#"}</div>
            <div className='item' >{"fecha: "}</div>
            <div className='item' >{"Cliente: "}</div>
            <div className='item' >{"Empleado: "}</div>
            <div className='item' >{"Total"}</div> 
          {item}
          </div>
      </div>
    );
  }
  
  export default Home;