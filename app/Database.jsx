import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCNuU3HvsJPY7oxo2_7q4O8I3YJyGGg-70",
    authDomain: "roomie-app-bf9cf.firebaseapp.com",
    projectId: "roomie-app-bf9cf",
    storageBucket: "roomie-app-bf9cf.firebasestorage.app",
    messagingSenderId: "757312119596",
    appId: "1:757312119596:web:74fb7f0172492529480289",
    measurementId: "G-8X307H6FR6"
  };
  
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

async function getDataFromFirebase(database, path) {
    const dataCol = collection(database, path);
    const dataSnapshot = await getDocs(dataCol);
    const dataList = dataSnapshot.docs.map(doc => doc.data());
    return dataList;
}

export async function addData(database, path, dataObject) {
    try {
      const dataRef = collection(database, path);
      const docRef = await addDoc(dataRef, dataObject);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

export function getData(database, path) {
    getDataFromFirebase(database, path).then(dataList => {
        console.log('Data: ' + dataList);
      }).catch(error => {
        Alert.alert('Error fetching data: ' + error);
    });
    console.log("Success")
}