import { StyleSheet, Modal, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';
import { database, addData, getData, updateData, generateCode, updateLoginStatus } from './Database';

export default function JoinRoomView( { setLoggedIn, onClose }) {
    const [roomCode, roomCodeChanged] = useState('Room code')
    const [userName, userNameChanged] = useState('Your name')
    return (
        <View style={styles.container}>
            <Text>Join Room</Text>
            
            <Text>Room Code: </Text>
            <TextInput style={styles.input}
                onChangeText={roomCodeChanged}
                value={roomCode}
            />

            <Text>Your Name: </Text>
            <TextInput style={styles.input}
                onChangeText={userNameChanged}
                value={userName}
            />

            <Button title="Submit" onPress={() => {
                submit({setLoggedIn, roomCode, userName, onClose})}}/>
        </View>
    )
}

function submit({setLoggedIn, roomCode, userName, onClose}) {
    getData(database, 'code-to-roomID').then( (data) => {
        console.log("DATA2 ", data)
        roomID = getRoomID(data, roomCode)
        console.log(roomID)
        if (roomID != "ERROR") {
            console.log("room id ", roomID)
            const memberData = {
                [`members.${userName}`] : "FILL IN LATER"
            }
            updateData(database, 'rooms/' + roomID, memberData)
            updateLoginStatus(true)
            setLoggedIn(true)
            onClose()
        }
    })
}

function getRoomID(data, roomCode) {
    for (let i=0; i < data.length; i++) {
        const item = data[i]
        if (Object.keys(item)[0] == roomCode) {
            return item[roomCode]
        }
    }  
    return "ERROR" 
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