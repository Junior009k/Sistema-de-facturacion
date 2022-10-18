import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

//configuracion de firebase
const firebaseConfig = {
  apiKey: "AIzaSyBe2D4MB00dXHwu2Ok9gLh2dBtAEdwO1F4",
  authDomain: "sistema-de-facturaracion.firebaseapp.com",
  databaseURL: "https://sistema-de-facturaracion-default-rtdb.firebaseio.com",
  projectId: "sistema-de-facturaracion",
  storageBucket: "sistema-de-facturaracion.appspot.com",
  messagingSenderId: "487521766380",
  appId: "1:487521766380:web:3343237fc19a560024cec9"
};

//inicializa la aplicacion de firebase con mi configuracion
const app = initializeApp(firebaseConfig);

//obtiene la base de datos de firestore
export const db = getFirestore(app);