import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../secret';


const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

async function getDataFromFirebase(database, path) {
    const dataCol = collection(database, path);
    const dataSnapshot = await getDocs(dataCol);
    const dataList = dataSnapshot.docs.map(doc => doc.data());
    return dataList;
}

async function getDataFromFirebaseDoc(database, path, docID) {
  try {
    const dataDoc = doc(database, path, docID)
    const dataSnapshot = await getDoc(dataDoc)
    const dataList = dataSnapshot.data()
    return dataList
  }
  catch (error) {
    console.log("ERROR in firebaseDoc " + error)
  }
}

export async function addData(db, path, dataObject) {
    try {
      const dataRef = collection(db, path);
      const docRef = await addDoc(dataRef, dataObject);
      return docRef.id
    }
    catch (e) {
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
    try {
        const dataList = await getDataFromFirebase(database, path);
        return dataList;
    }
    catch (error) {
        console.log('Error fetching data: ' + error);
        throw error;
    }
}

export async function getDataFromDoc(database, path, docID) {
  try {
      const dataList = await getDataFromFirebaseDoc(database, path, docID);
      return dataList;
  }
  catch (error) {
      console.log('Error fetching data: ' + error);
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

export async function updateRoomIDStatus(roomID) {
  try {
    await AsyncStorage.setItem('@roomID', JSON.stringify(roomID));
    console.log(JSON.stringify(roomID))
  }
  catch (error) {
    console.error("Could not save roomID status");
  }
}

export async function getSavedRoomID() {
  try {
    const roomID = await AsyncStorage.getItem('@roomID');
    if (roomID !== null) {
      return JSON.parse(roomID);
    }
    return null
  }
  catch (error) {
    console.log('Failed to find roomID', error);
    return null;
  }
}