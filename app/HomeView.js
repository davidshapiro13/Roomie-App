import { Text, View, Button } from 'react-native';
import { updateRoomIDStatus, updateSavedItemStatus } from './Database';
import React from 'react';
import { styles } from './Styles';

export default function HomeView( { roomID, setRoomID } ) {

    return (
        <View style={styles.container}>
            <Text>{JSON.stringify(roomID)}</Text>
            <Button title="Log Out" onPress={() => {
                console.log(JSON.stringify(roomID))
                setRoomID(null) //Log Out
                updateSavedItemStatus('@roomID', null) //Save logout
                }
            }></Button>
        </View>
        
    )
}