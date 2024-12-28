import { StyleSheet, Modal, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';
import { database, addData, generateCode, updateLoginStatus, updateRoomIDStatus } from './Database';

export default function CreateRoomView( { setRoomID, onClose }) {
    const [roomName, roomNameChanged] = useState('Room name')
    const [userName, userNameChanged] = useState('Your name')
    return (
        <View style={styles.container}>
            <Text>Create Room</Text>
            
            <Text>Room Name: </Text>
            <TextInput style={styles.input}
                onChangeText={roomNameChanged}
                value={roomName}
            />

            <Text>Your Name: </Text>
            <TextInput style={styles.input}
                onChangeText={userNameChanged}
                value={userName}
            />

            <Button title="Submit" onPress={() => {
                submit({setRoomID, roomName, userName, onClose})}}/>
        </View>
    )
}

function submit({setRoomID, roomName, userName, onClose}) {
    const data = {
        "room_name" : roomName,
        "members" : {[userName] : "FILL IN LATER"}
    }
    addData(database, 'rooms/' , data).then((roomID) => {
        setRoomID(roomID)
        updateRoomIDStatus(roomID)
        addData(database, 'code-to-roomID', {[generateCode()] : roomID});
    });
    onClose();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        borderWidth: 1,
        width: 200,
        marginTop: 5,
        padding: 5
    }
  });