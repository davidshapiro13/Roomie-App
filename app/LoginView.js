import { StyleSheet, Modal, Text, View, Button, Alert } from 'react-native';
import React, {useState} from 'react';
import CreateRoomView from './CreateRoomView';
import JoinRoomView from './JoinRoomView';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { database, addData, getData } from './Database';

export default function LoginView( { setRoomID }) {
    const [createRoomOn, setCreateRoomOn] = useState(false)
    const [joinRoomOn, setJoinRoomOn] = useState(false)
    return (
        <View style={styles.container}>
            <Text>Roomie</Text>
            <Button title="Create Room" onPress={() => setCreateRoomOn(true)}/>
            <Button title="Join Room" onPress={() => setJoinRoomOn(true)}/>

            <Modal animationType="slide"
                   transparent={false}
                   visible={createRoomOn}
                   onRequestClose={() => {
                    Alert.alert("Closing Create Room");
                    setCreateRoomOn(false);}}>
                <CreateRoomView setRoomID={setRoomID} onClose={() => setCreateRoomOn(false)}></CreateRoomView>
            </Modal>

            <Modal animationType="slide"
                   transparent={false}
                   visible={joinRoomOn}
                   onRequestClose={() => {
                    Alert.alert("Closing Join Room");
                    setJoinRoomOn(false);}}>
                <JoinRoomView setRoomID={setRoomID} onClose={() => setJoinRoomOn(false)}></JoinRoomView>
            </Modal>

        </View>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
  });