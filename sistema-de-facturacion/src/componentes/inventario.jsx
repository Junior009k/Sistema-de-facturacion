import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  './inventario.css'
import { collection, query, getDocs,doc,addDoc,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebase";

 
let item=[]   //este elemento es para almacenar los datos que se cargan en formato html tag
let a=0;      //esta variable, me auxiliar en algunas partes



  
function Inventario() {
  
  //=====================================================CRUD INVENTARIO START===========================================//
//Create:Crea los campos  
const Agregar=(nombre,descripcion, precio)=>
{
  
  //validacion de los campos
 if(nombre!=="" && descripcion!=="" && precio!=="")
 {
    //metodo de firestore que agrega los datos a la tabla producto
    addDoc(collection(db, "Producto"), 
    {
    id:a,
    nombre: nombre,
    descripcion: descripcion,
    precio:precio
  });
  //metodo de bootstrap , se encarga de desplega la alerta
  Swal.fire(
    'Good job!',
    'El producto ha sido agregado',
    'success'
  )

  item=[]
  cargarDatos();
 }
  

}

//Read: este el que lee los datos de la base de datos y carga la informacion
const cargarDatos=()=>
{
  //declaro mi query
  const consulta = query(collection(db, "Producto"));
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
      array=[...array ,<div className='item' key={(doc.id + "3")}>{doc.data().descripcion}</div>]
      array=[...array ,<div className='item' key={(doc.id + "4")}>{doc.data().precio}</div>]
      array=[...array ,<div className='item' key={(doc.id + "5")}><button  className="botonC" value={doc.id} onClick={(e)=>{actualizar(e,doc.data().id,doc.data().nombre,doc.data().descripcion,doc.data().precio)}} >Actualizar</button>|<button className="botonC E" value={doc.id} onClick={(e)=>eliminar(e,doc.data().nombre)}>Eliminar</button></div>]
      ++i;
    });
    a=i+1;
    //en vez de retornar el item, el me va a establecer el valor del item;
    setItemE(array);
  });
 
  
}

//Update: actualiza los datos de la tabla inventario
const actualizar=(e,id,nombre, descripcion, precio)=>
{
  //alerta de bootstrap, lo utilizo como si fuera un modal, en teoria lo es
   Swal.fire({
    title: '<strong>Actualizar</u></strong>',
    icon: 'info',
    html:
      'nombre <input type="text" id="nombre"  value='+nombre+'></input><br> '+//aqui obtengo los datos a modificar
      'descripcion<input type="text" id="descripcion"  value='+descripcion+'></input> <br>'+//aqui obtengo los datos a modificar
      'precio<input type="text" id="precio" value='+precio+'></input> ',//aqui obtengo los datos a modificar
      confirmButtonText: 'Actualizar',
      denyButtonText: `no Actualizar`,
    }).then((result) => {
      if (result.isConfirmed) 
      {   
        nombre=document.getElementById('nombre').value// guardo los datos ya que al cerrar el modal estos se pierden
        descripcion=document.getElementById('descripcion').value// guardo los datos ya que al cerrar el modal estos se pierden
        precio=document.getElementById('precio').value// guardo los datos ya que al cerrar el modal estos se pierden
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
            const actualizacionRef = doc(db, "Producto", e.target.value);

            item=[]
            cargarDatos();
            updateDoc(actualizacionRef, 
            {
            nombre:nombre,
            descripcion:descripcion,
            precio:precio,
             });
             
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
      deleteDoc(doc(db,'Producto', e.target.value))
      Swal.fire(
        'El campo ha sido borrado',
        'success'
      )
      item=[]
      cargarDatos();
    }
  })
}

//=====================================================CRUD INVENTARIO END=============================================//

  const [show, setShow] = useState(false);
  const [itemE, setItemE] = useState([]);
  const [nombre, setNombre] = useState(false);
  const [descripcion, setDescripcion] = useState(false);
  const [precio, setPrecio] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(()=>
  {
    //esta es la accion que ejecutara el  effecto
    cargarDatos();
  }, [])
    return (
      <div className="inventario">
          inventario
          <div className="Barra2">              fecha</div>
          <div className="container-i" id="tabla">
            <div className="item"> ID</div>
            <div className="item"> nombre </div>
            <div className="item"> descripcion </div>
            <div className="item"> precio</div>
            <div className="item"> </div>
            {itemE}
            
          </div>
          <Button value={a} className="button btn btn-outline-danger" variant="primary" onClick={(e)=>{handleShow();}}>Agregar Producto</Button>
          <Button value={a} className="button btn btn-outline-danger" variant="primary" onClick={(e)=>{setItemE(item)}}>Recargar</Button>
          
          
          <Modal  show={show} onHide={handleClose}>
          <Modal.Header closeButton>c
          <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body className="container-Modal">
            nombre<input type="text" onChange={(e)=>{setNombre(e.target.value)}}></input>
            descripcion<input type="text" onChange={(e)=>{setDescripcion(e.target.value)}}></input>
            precio<input type="text" onChange={(e)=>{setPrecio(e.target.value)}}></input>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cerrar
          </Button>
          <Button variant="primary" onClick={()=>{Agregar(nombre, descripcion, precio);handleClose()}}>
            Guardar
          </Button>
          </Modal.Footer>
          </Modal>
      </div>
    );
  }
  
  export default Inventario;