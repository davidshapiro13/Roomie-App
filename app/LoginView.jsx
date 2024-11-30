import { StyleSheet, Modal, Text, View, Button, Alert } from 'react-native';
import React, {useState} from 'react';
import CreateRoomView from './CreateRoomView';
import JoinRoomView from './JoinRoomView';
import { firebase } from '@react-native-firebase/database';

export default function LoginView() {
    const reference = firebase
        .app()
        .database('https://roomie-2634a-default-rtdb.firebaseio.com/')
        .ref('/rooms');

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
                <CreateRoomView onClose={() => setCreateRoomOn(false)}></CreateRoomView>
            </Modal>

            <Modal animationType="slide"
                   transparent={false}
                   visible={joinRoomOn}
                   onRequestClose={() => {
                    Alert.alert("Closing Join Room");
                    setJoinRoomOn(false);}}>
                <JoinRoomView onClose={() => setJoinRoomOn(false)}></JoinRoomView>
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