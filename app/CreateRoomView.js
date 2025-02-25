import { Text, View, Button, TextInput } from 'react-native';
import React, {useState} from 'react';
import { database, addData, generateCode, updateRoomIDStatus, updateSavedItemStatus } from './Database';
import { styles } from './Styles';
import { DEFAULT_CHORE_LIST, getStartDate } from './General';

export default function CreateRoomView( { setRoomID, onClose }) {

    const DEFAULT_ROOM_NAME = 'Room name'
    const DEFAULT_USER_NAME = 'Your name'
    const [roomName, roomNameChanged] = useState(DEFAULT_ROOM_NAME)
    const [userName, userNameChanged] = useState(DEFAULT_USER_NAME)
    const [errorMessage, setErrorMessage] = useState("")

    return (
        <View style={styles.container}>
            <Text>Create Room</Text>
            
            <Text style={styles.error}>{errorMessage}</Text>
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
                if (proper(roomName, userName)) {
                    setErrorMessage("")
                    submit({setRoomID, roomName, userName, onClose})
                }
                else {
                    setErrorMessage("Room name and User name cannot be blank")
                }
                }}
            />
        </View>
    )

    /**
     * Checks if proper format
     * @param {*} roomName - name of room
     * @param {*} userName - name of user
     * @returns true if proper format; false otherwise
     */
    function proper(roomName, userName) {
        if (roomName == DEFAULT_ROOM_NAME || roomName == null ||
            userName == DEFAULT_USER_NAME || userName == null)
        {
            return false
        }
        return true
    }
}

/**
 * Enters data for a brand new room
 */
function submit({setRoomID, roomName, userName, onClose}) {
    const data = {
        "room_name" : roomName,
        "members" : {[userName] : 0},
        "choreList": DEFAULT_CHORE_LIST,
        "start_date" : getStartDate(),
        "chore_start_date" : getStartDate(),
        "creator": userName
    }
    addData(database, 'rooms/' , data).then((roomID) => {
        setRoomID(roomID)
        updateSavedItemStatus('@roomID', roomID)
        updateRoomIDStatus('@admin', true)
        updateSavedItemStatus('@username', userName)
        addData(database, 'code-to-roomID', {[generateCode()] : roomID});
    });
    onClose();
}