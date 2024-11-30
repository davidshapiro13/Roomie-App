import { StyleSheet, Modal, Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';

export default function JoinRoomView( { onClose }) {
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

            <Button title="Submit" onPress={() => {submit({onClose})}}/>
        </View>
    )
}

function submit({onClose}) {
    onClose()
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