import  './Facturacion.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import React, { useState ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import  './inventario.css'
import { collection, query, getDocs,doc,addDoc,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let itemProducto=[]   // esta variable servira para cargar el producto
let itemCliente=[]    // esta variable servira para cargar el Cliente
let itemEmpleado=[]   // esta variable servira para cargar el Empleado
let item=[]           //este elemento es para almacenar los datos que se cargan en formato html tag
let a=0;              //esta variable, me auxiliar en algunas partes
let pk_Factura=0;
let fk_Factura=0;          
let idFactura=0;      //esta variable, sera la que me ayudara a identificar en cual factura es que estamos trabajando
let total=0;       // total sera la sumatoria de todos los monto
let precio=0;         // variable auxiliar


function Facturacion() {

  //=====================================================CRUD DETALLEFACTURA START===========================================//
//Create:Crea los campos  
const agregarDetalleFactura=(producto,p,cantidad,fk_Factura)=>
{ 

  a=a+1;
  let precio=p
  idFactura=idFactura + 1;
  let monto= precio * cantidad;
  //esta funcionando
  console.log(producto + " precio" + p + "  cantidad" + cantidad + " monto" + monto)
  //validacion de los campos
 if(producto!=="" && cantidad!=="" && monto!=="")
 {
    //metodo de firestore que agrega los datos a la tabla producto
    addDoc(collection(db, "detalleFactura"), 
    {
    id:a,
    producto: producto,
    cantidad: cantidad,
    monto:monto,
    fk_Factura:fk_Factura
  });
  //metodo de bootstrap , se encarga de desplega la alerta
  Swal.fire(
    'Good job!',
    'El producto ha sido agregado',
    'success'
  )
  cargarDatosDetalleFactura();
  cargarDatosProducto()// esto lo hare para poder construir los detalles de la factura 
  cargarDatosCliente()// esto lo hare para poder seleccionar el cliente con el que este trabajando
  cargarDatosEmpleado()
 }
  

}

//Read: este el que lee los datos de la base de datos y carga la informacion
const cargarDatosDetalleFactura=()=>
{
  //declaro mi query
  const consulta = query(collection(db, "detalleFactura"));
  total=0;
  //esta es la que se encargara de ejecutar el query como si fuera una promesas
  const querySnapshot = getDocs(consulta)
  querySnapshot.then((querySnapshot) => 
  {
    let i=0;//variable para identificar el ultimo elemento
    let array=[];
    //vamos hacer que solo me cargue los datos si fk_id =pk
    querySnapshot.forEach((doc) => 
    {
      //agregamos los datos al arreglo para dezplegarlo en la tabla
      if(pk_Factura==doc.data().fk_Factura)
      {
      array=[...array,( <div className='item' key={doc.id + "1"} type="text">{doc.data().id}</div>)]
      array=[...array,( <div className='item' key={doc.id + "2"}>{doc.data().producto}</div>)]
      array=[...array,( <div className='item' key={doc.id + "3"}>{doc.data().cantidad}</div>)]
      array=[...array,( <div className='item' key={doc.id + "4"}>{doc.data().monto}</div>)]
      array=[...array,( <div className='item' key={doc.id + "5"}><button  className="botonC" value={doc.id} onClick={(e)=>{actualizar(e,doc.data().id,doc.data().producto,doc.data().cantidad,doc.data().monto)}} >Actualizar</button>|<button className="botonC E" value={doc.id} onClick={(e)=>eliminar(e,doc.data().producto)}>Eliminar</button></div>)]
      ++i;
      total=total+doc.data().monto;
    }
      
      
    });
    a=i+1;
    console.log("el total a pagar =Rd$" + total)
    setItemDF(array)
  });
 
  
}

//Update: actualiza los datos de la tabla inventario
const actualizar=(e,id,producto, cantidad,monto)=>
{
  precio=monto/cantidad
  //alerta de bootstrap, lo utilizo como si fuera un modal, en teoria lo es
   Swal.fire({
    title: '<strong>Actualizar</u></strong>',
    icon: 'info',
    html:
      'producto <input type="text" id="producto"  value='+producto+'></input><br> '+//aqui obtengo los datos a modificar
      'cantidad<input type="text" id="cantidad"  value='+cantidad+'></input> <br>',//aqui obtengo los datos a modificar
      confirmButtonText: 'Actualizar',
      denyButtonText: `no Actualizar`,
    }).then((result) => {
      if (result.isConfirmed) 
      {   
        producto=document.getElementById('producto').value// guardo los datos ya que al cerrar el modal estos se pierden
        cantidad=document.getElementById('cantidad').value// guardo los datos ya que al cerrar el modal estos se pierden
        monto=precio*cantidad;
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
            const actualizacionRef = doc(db, "detalleFactura", e.target.value);

            updateDoc(actualizacionRef, {
            producto:producto,
            cantidad:cantidad,
            monto:monto,
        });
            Swal.fire(
              'El campo ha sido actualizado',
              'success'
            )
            cargarDatosDetalleFactura();
            cargarDatosProducto()// esto lo hare para poder construir los detalles de la factura 
            cargarDatosCliente()// esto lo hare para poder seleccionar el cliente con el que este trabajando
            cargarDatosEmpleado()
            
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
      deleteDoc(doc(db,'detalleFactura', e.target.value))
      Swal.fire(
        'El campo ha sido borrado',
        'success'
      )
      cargarDatosDetalleFactura();
      cargarDatosProducto()// esto lo hare para poder construir los detalles de la factura 
      cargarDatosCliente()// esto lo hare para poder seleccionar el cliente con el que este trabajando
      cargarDatosEmpleado()
    }
  })
}

//=====================================================CRUD DETALLEFACTURACION END=============================================//
//=====================================================CRUD FACTURA START===========================================//
//Create:Crea los campos /
const agregarFactura=(pk_Factura,cliente,empleado,total)=>
{
  //vamos agregarle una fecha
  let fecha=new Date();
  fecha=fecha.toLocaleString();
  //validacion de los campos, funciona
    console.log(pk_Factura+ " " + cliente+ " " + empleado+ " " + total)
    console.log(fecha)
    //metodo de firestore que agrega los datos a la tabla producto
    addDoc(collection(db, "factura"), 
    {
      id:pk_Factura,
      cliente: cliente,
      empleado: empleado,
      total:total,
      fecha:fecha
     });
  //metodo de bootstrap , se encarga de desplega la alerta
  Swal.fire(
    'Good job!',
    'El producto ha sido agregado',
    'success'
  )
  //cargarDatos();
  cargarDatosFactura();
  cargarDatosDetalleFactura()

}

//Read: este el que lee los datos de la base de datos y carga la informacion
//solo cargaremos los datos para saber con cual factura es que vamos a trabajar
const cargarDatosFactura=()=>
{
  //declaro mi query
  const consulta = query(collection(db, "factura"));
  //esta es la que se encargara de ejecutar el query como si fuera una promesas
  const querySnapshot = getDocs(consulta);
  querySnapshot.then((querySnapshot) => 
  {
    querySnapshot.forEach((doc) => 
    {
      ++pk_Factura;
    });
    if(pk_Factura==0){pk_Factura=1;}
    console.log("Estamos trabajando con la factura #" + pk_Factura)
  });
 
  
}

//Update: actualiza los datos de la tabla inventario
const actualizarFactura=(e,id,nombre, descripcion, precio)=>
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
          confirmButtonText: 'Si,Borralo!'
        }).then((result) => {
          if (result.isConfirmed) 
          {
            //funcion de firebase que me permite actualizar la tabla
            //e.target,value toma como referencia al boton que le di
            const actualizacionRef = doc(db, "Producto", e.target.value);

            updateDoc(actualizacionRef, {
            nombre:nombre,
            descripcion:descripcion,
            precio:precio,
        });
            Swal.fire(
              'El campo ha sido actualizado',
              'success'
            )
           // item=[]
            //cargarDatos();
            
          }
        })
        
        
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
}
//DELETE: elimina los datos de la tabla inventario
const eliminarFactura=(e,nombre)=>
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
      //item=[]
      //cargarDatos();
    }
  })
}

//=====================================================CRUD FACTURACION END=============================================//


//=====================================================CRUD AUXILIARES=============================================//
const cargarDatosProducto=()=>
{
  //declaro mi query
  const consulta = query(collection(db, "Producto"));
  //esta es la que se encargara de ejecutar el query como si fuera una promesas
  const querySnapshot = getDocs(consulta);
  querySnapshot.then((querySnapshot) => 
  {
    let i=0;//variable para identificar el ultimo elemento
    let array=[];
    querySnapshot.forEach((doc) => 
    {
      //agregamos los datos al arreglo para dezplegarlo en la tabla
      array=[...array,( <option key={doc.id} value={doc.data().precio}  nombre={doc.data().nombre} precio={doc.data().precio} className='item'>{doc.data().nombre}</option>)]
      ++i;
    });
    a=i+1;
    setItemP(array)
  });
 
}
const cargarDatosCliente=()=>
{
  //declaro mi query
  const consulta = query(collection(db, "cliente"));
  //esta es la que se encargara de ejecutar el query como si fuera una promesas
  const querySnapshot = getDocs(consulta);
  querySnapshot.then((querySnapshot) => 
  {
    let i=0;//variable para identificar el ultimo elemento
    let array=[];
    querySnapshot.forEach((doc) => 
    {
      //agregamos los datos al arreglo para dezplegarlo en la tabla
      array=[...array,( <option key={doc.id} value={doc.id}  nombre={doc.data().nombre} apellido={doc.data().apellido} className='item'>{doc.data().nombre + " " + doc.data().apellido}</option>)]
      ++i;
    });
    a=i+1;
    setItemC(array)
  });
 
}
const cargarDatosEmpleado=()=>
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
      array=[...array,( <option key={doc.id} value={doc.id}  nombre={doc.data().nombre} apellido={doc.data().apellido} className='item'>{doc.data().nombre + " " + doc.data().apellido}</option>)]
      ++i;
    });
    a=i+1;
    setItemE(array);
  });
 
}

//=====================================================CRUD AUXILIARES=============================================//


  const [itemDF, setItemDF] = useState(false);
  const [itemP, setItemP] = useState(false);
  const [itemE, setItemE] = useState(false);
  const [itemC, setItemC] = useState(false);
  const [show, setShow] = useState(false);
  const [producto, setProducto] = useState(false);
  const [cantidad, setCantidad] = useState(false);
  const [precio, setPrecio] = useState(false);
  const [cliente, setCliente] = useState(false);
  const [empleado, setEmpleado] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(()=>
  {
    cargarDatosFactura();
    cargarDatosProducto()// esto lo hare para poder construir los detalles de la factura 
    cargarDatosCliente()// esto lo hare para poder seleccionar el cliente con el que este trabajando
    cargarDatosEmpleado()// esto lo hare para saber cual es el empleado que esta trabajando
    cargarDatosDetalleFactura();//carga los datos del detalle Factura

  }, [])
    return (
    <div className="facturacion">
          Facturacion
          <div className="Barra2">cliente<select name="select" onChange={(e)=>{setCliente(e.target[e.target.options.selectedIndex].textContent)}}>{itemC}</select>| empleado<select name="select" onChange={(e)=>{setEmpleado(e.target[e.target.options.selectedIndex].textContent)}}>{itemE}</select>              </div>
          <div className="container">
            <div className="item"> ID</div>
            <div className="item"> producto </div>
            <div className="item"> cantidad </div>
            <div className="item"> monto</div>
            <div className="item"></div>
            {itemDF}
          </div>
          <Button value={a} className="button" variant="primary" onClick={(e)=>{handleShow();}}>Agregar producto</Button>
          <Button value={a} className="button" variant="primary" onClick={(e)=>{if(cliente!=false && empleado!=false && total!=0){agregarFactura(pk_Factura,cliente,empleado,total)}else{alert("debe seleccionar empleado y cliente o no hay producto")}}}>Crear Factura</Button>

          <Modal  show
          ={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Agregar Empleado</Modal.Title>
          </Modal.Header>
          <Modal.Body className="container-Modal">
            producto<select name="select" onChange={(e)=>{setPrecio(e.target.value);setProducto(e.target[e.target.options.selectedIndex].textContent)}}>
                        {itemP}
                    </select>
                    

            cantidad<input type="number" min="0" max="100" onChange={(e)=>{setCantidad(e.target.value);}}></input>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cerrar
          </Button>
          <Button variant="primary" onClick={()=>{if(producto!==false && precio!==false && cantidad!=0){agregarDetalleFactura(producto,precio,cantidad,pk_Factura);handleClose()}else{alert("debe seleccionar una cantidad o producto")}}}>
            Añadir producto
          </Button>
          </Modal.Footer>
          </Modal>
      </div>
    );
  }
  export default Facturacion;