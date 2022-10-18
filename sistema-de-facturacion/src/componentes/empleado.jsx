import './cliente.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  './inventario.css'
import { collection, query, getDocs,doc,addDoc,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebase";

//===============================
let a=0;      //esta variable, me auxiliar en algunas partes

  let nombre=''
  let apellido=''



function Empleado() {
    //=====================================================CRUD Empleado START===========================================//
//Create:Crea los campos  
const Agregar=(nombre,apellido)=>
{
  a=a+1;
  //validacion de los campos
  if(nombre!=="" && apellido!=="" )
  {
    //metodo de firestore que agrega los datos a la tabla producto
    addDoc(collection(db, "empleado"), 
    {
      id:a,
      nombre: nombre,
      apellido: apellido,
    });
    cargarDatos();
  //metodo de bootstrap , se encarga de desplega la alerta
    Swal.fire(
      'Good job!',
      'El empleado ha sido agregado',
      'success'
    )
  }
  
}

//Read: este el que lee los datos de la base de datos y carga la informacion
const cargarDatos=()=>
  {
    //declaro mi query
    const consulta = query(collection(db, "empleado"));
    //esta es la que se encargara de ejecutar el query como si fuera una promesas
    const querySnapshot = getDocs(consulta);
    let array=[];
  querySnapshot.then((querySnapshot) => 
  {
    let i=0;//variable para identificar el ultimo elemento
    querySnapshot.forEach((doc) => 
    {
      //agregamos los datos al arreglo para dezplegarlo en la tabla
      array=[...array ,<div className='item' key={(doc.id + "1")}type="text">{doc.data().id}</div>]
      array=[...array ,<div className='item' key={(doc.id + "2")}>{doc.data().nombre}</div>]
      array=[...array ,<div className='item' key={(doc.id + "3")}>{doc.data().apellido}</div>]
      array=[...array ,<div className='item' key={(doc.id + "4")}><button  className="botonC" value={doc.id} onClick={(e)=>{actualizar(e,doc.data().id,doc.data().nombre,doc.data().apellido)}} >Actualizar</button>|<button className="botonC E" value={doc.id} onClick={(e)=>eliminar(e,doc.data().nombre)}>Eliminar</button></div>]
      ++i;
    });
    a=i+1;
    //en vez de retornar el item, el me va a establecer el valor del item;
    setItemE(array);
    });
  }
  
//Update: actualiza los datos de la tabla inventario
  const actualizar=(e,id,nombre,apellido)=>
  {
    //alerta de bootstrap, lo utilizo como si fuera un modal, en teoria lo es
     Swal.fire({
      title: '<strong>Actualizar</u></strong>',
      icon: 'info',
      html:
        'nombre <input type="text" id="nombre"  value='+nombre+'></input><br> '+//aqui obtengo los datos a modificar
        'apellido<input type="text" id="apellido"  value='+apellido+'></input> <br>',//aqui obtengo los datos a modificar
        confirmButtonText: 'Actualizar',
        denyButtonText: `no Actualizar`,
      }).then((result) => {
        if (result.isConfirmed) 
        {   
          nombre=document.getElementById('nombre').value// guardo los datos ya que al cerrar el modal estos se pierden
          apellido=document.getElementById('apellido').value// guardo los datos ya que al cerrar el modal estos se pierden
          Swal.fire({
            title: 'Estas seguro de actualizar?',
            text: "",
            icon: 'Advertencia',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si,Actualizalo!'
          }).then((result) => {
            if (result.isConfirmed) 
            {
              //funcion de firebase que me permite actualizar la tabla
              //e.target,value toma como referencia al boton que le di
              const actualizacionRef = doc(db, "empleado", e.target.value);

              updateDoc(actualizacionRef, 
              {
                nombre:nombre,
                apellido:apellido,
              });
              cargarDatos();
              Swal.fire(
                'El campo ha sido actualizado',
                'success'
              )
            }
          })
          
          
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
  }
//DELETE: elimina los datos de la tabla inventario
  const eliminar=(e,nombre)=>
  {
    Swal.fire({
      title: 'Estas seguro de eliminar '+nombre+'?',
      text: "Tu accion no sera reversible",
      icon: 'Advertencia',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Borralo!'
    }).then((result) => {
      if (result.isConfirmed) 
      {
        deleteDoc(doc(db,'empleado', e.target.value))
        Swal.fire(
          'El campo ha sido borrado',
          'success'
        )
        cargarDatos();
      }
    })
  }
 
//=====================================================CRUD Empleado END=============================================//
  
    const [itemE, setItemE] = useState(false);
    const [show, setShow] = useState(false);
    const [nombre, setNombre] = useState(false);
    const [apellido, setApellido] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(()=>
    {
      cargarDatos()
    }, [])
    return (
      
      <div className="empleados">
          empleado
          <div className="Barra2">              fecha</div>
          <div className="container-ce">
            <div className="item"> ID</div>
            <div className="item"> nombre </div>
            <div className="item"> apellido </div>
            <div className="item"></div>
            {itemE}
            
          </div>
          <Button value={a} className="button" variant="primary" onClick={(e)=>{handleShow();}}>Agregar empleado</Button>

          <Modal  show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Agregar Empleado</Modal.Title>
          </Modal.Header>
          <Modal.Body className="container-Modal">
            nombre<input type="text" onChange={(e)=>{setNombre(e.target.value)}}></input>
            apellido<input type="text" onChange={(e)=>{setApellido(e.target.value)}}></input>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cerrar
          </Button>
          <Button variant="primary" onClick={()=>{Agregar(nombre, apellido);handleClose()}}>
            Guardar
          </Button>
          </Modal.Footer>
          </Modal>
      </div>
    );
  }
  
  export default Empleado;