import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../secret';

//Database Creation
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

/**
 * Adds data to the database
 * @param {*} db - database to add to
 * @param {*} path - path of where to add to
 * @param {*} dataObject - object to add
 * @returns 
 */
export async function addData(db, path, dataObject) {
    try {
      const dataRef = collection(db, path);
      const docRef = await addDoc(dataRef, dataObject);
      return docRef.id
    }
    catch (e) {
      console.error('Error adding document: - add Data', e);
      return null
    }
}

/**
 * Updates pre-existing data
 * @param {*} database - database to update
 * @param {*} path - path of object to update
 * @param {*} dataObject - new version to replace with
 * @return true if success; false otherwise
 */
export async function updateData(database, path, dataObject) {
    try {
      const docRef = doc(database, path);
      await updateDoc(docRef, dataObject)
      return true
    } catch (e) {
      console.error('Error adding document - here: ', path, " ", e);
      return false
    }
  }

/**
 * Gets data using the getDataFromFirebase function
 * @param {*} database - database to retrieve from
 * @param {*} path - path of data
 * @returns data searched for
 */
export async function getData(database, path) {
    try {
      const dataCol = collection(database, path);
      const dataSnapshot = await getDocs(dataCol);
      const dataList = dataSnapshot.docs.map(doc => doc.data());
      return dataList;
    }
    catch (error) {
        console.log('Error fetching data: ' + error);
        return []
    }
}

/**
 * Gets data from doc using getDataFromFirebaseDoc function
 * @param {*} db - database to retrieve from
 * @param {*} path - path of data
 * @param {*} docID - specific doc data wanted from
 * @returns data searched for
 */
export async function getDataFromDoc(database, path, docID) {
  try {
    const dataDoc = doc(database, path, docID)
    const dataSnapshot = await getDoc(dataDoc)
    const dataList = dataSnapshot.data()
    return dataList
  }
  catch (error) {
    console.log("Error: ", error)
    return []
  }
}


/**
 * Creates a 5 alpha-numeric code for logging in
 * @returns code created
 */
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

/**
 * Saves the roomID on the system
 * @param {*} roomID - roomID to save
 * @return true if successful; false otherwise
 */
export async function updateRoomIDStatus(roomID) {
  try {
    await AsyncStorage.setItem('@roomID', JSON.stringify(roomID));
    return true
  }
  catch (error) {
    console.error("Could not save roomID status");
    return false
  }
}

/**
 * Recieve the room id from the system
 * @returns roomID saved; null if none
 */
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