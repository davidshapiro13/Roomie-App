import { StyleSheet, Modal, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';
import { database, addData, getData, updateData, generateCode, updateRoomIDStatus } from './Database';

export default function JoinRoomView( { setRoomID, onClose }) {
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
                submit({setRoomID, roomCode, userName, onClose})}}/>
        </View>
    )
}

async function submit({setRoomID, roomCode, userName, onClose}) {
    try {
        const data = await getData(database, 'code-to-roomID')
        const roomID = getRoomID(data, roomCode)
        if (roomID != "ERROR") {
            const memberData = {
                [`members.${userName}`] : "FILL IN LATER"
            }
            setRoomID(roomID)
            updateRoomIDStatus(roomID)
            updateData(database, 'rooms/' + roomID, memberData)
            onClose()
        }
    }
    catch (error) {
        Alert.alert('Error fetching data: ' + error);
        throw error;
    }
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