import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export async function addData(db, path, dataObject) {
    try {
      console.log("addData called with:", db, path, dataObject);
      const dataRef = collection(db, path);
      console.log("collectionRef:", dataRef);
      const docRef = await addDoc(dataRef, dataObject);
      console.log("docRef:", docRef);
      return docRef.id
    } catch (e) {
      console.error('Error adding document: - add Data', e);
    }
}

  export async function updateData(database, path, dataObject) {
    try {
      const docRef = doc(database, path);
      await updateDoc(docRef, dataObject)
    } catch (e) {
      console.error('Error adding document - here: ', path, " ", e);
      throw e
    }
  }

export async function getData(database, path) {
    returnedData = {"test" : "value"};
    try {
        const dataList = await getDataFromFirebase(database, path);
        return dataList;
    }
    catch (error) {
        Alert.alert('Error fetching data: ' + error);
        throw error;
    }
}

export function generateCode() {
    let codeLength = 5
    var result = ""
    let options = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    for (let i = 0; i < codeLength; i++) {
        let index = Math.floor(Math.random() * options.length)
        result += options[index]
    }
    return result


}

export async function updateLoginStatus(isLoggedIn) {
  try {
    await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(isLoggedIn));
  }
  catch (error) {
    console.error("Could not save login status");
  }
}

export async function getLoggedInStatus() {
  try {
    const loggedIn = await AsyncStorage.getItem('@isLoggedIn');
    if (loggedIn !== null) {
      return JSON.parse(loggedIn);
    }
    return false
  }
  catch (error) {
    console.error('Failed to find login info', error);
    return false;
  }
}