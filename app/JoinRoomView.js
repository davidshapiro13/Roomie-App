import { Text, View, Button, Alert, TextInput } from 'react-native';
import React, {useState} from 'react';
import { database, getData, updateData, updateRoomIDStatus } from './Database';
import { styles } from './Styles'

export default function JoinRoomView( { setRoomID, onClose }) {

    const DEFAULT_ROOM_CODE = 'Room code'
    const DEFAULT_USER_NAME = 'Your name'
    const [roomCode, roomCodeChanged] = useState(DEFAULT_ROOM_CODE)
    const [userName, userNameChanged] = useState(DEFAULT_USER_NAME)
    const [errorMessage, setErrorMessage] = useState("")

    return (
        <View style={styles.container}>
            <Text style={styles.error}>{errorMessage}</Text>
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
                if (proper(roomCode, userName)) {
                    setErrorMessage("")
                    submit({setRoomID, roomCode, userName, onClose})
                }
                else {
                    setErrorMessage("Please fill in a proper room code and user name")
                }}}/>
        </View>
    )

    /**
     * Checks if proper format
     * @param {*} roomCode - roomCode
     * @param {*} userName - name of user
     * @returns true if proper format; false otherwise
     */
    function proper(roomCode, userName) {
        if (roomCode.length != 5 || roomCode == DEFAULT_ROOM_CODE ||
            userName.length == 0 || userName == DEFAULT_USER_NAME) {
                return false
        }
        else {
            return true
        }
    }

    /**
    * Submits new data when person joins room
    */
    async function submit({setRoomID, roomCode, userName, onClose}) {
        try {
            const data = await getData(database, 'code-to-roomID')
            const roomID = getRoomID(data, roomCode)
            if (data.length == 0) {
                setErrorMessage("Cannot connect to Internet")
                return
            }
            else if (roomID != "ERROR") {
                const memberData = {
                    [`members.${userName}`] : "FILL IN LATER"
                }
                setErrorMessage("")
                setRoomID(roomID)
                updateRoomIDStatus(roomID)
                updateData(database, 'rooms/' + roomID, memberData)
                onClose()
            }
            else {
                setErrorMessage("Room Code does not exist")
            }
        }
        catch (error) {
            Alert.alert('Error fetching data: ' + error);
            throw error;
        }
    }
}


/**
 * Retrieve room ID from room code
 * @param {*} data - data to search through
 * @param {*} roomCode - room code to search with as key
 * @returns room ID for room joined
 */
function getRoomID(data, roomCode) {
    for (let i=0; i < data.length; i++) {
        const item = data[i]
        if (Object.keys(item)[0] == roomCode) {
            return item[roomCode]
        }
    }  
    return "ERROR" 
}