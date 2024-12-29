import { StyleSheet, Text, View, Button } from 'react-native';
import { getSavedRoomID, updateRoomIDStatus } from './Database'
import React from 'react';

export default function HomeView( { roomID, setRoomID } ) {
    return (
        <View style={styles.container}>
            <Text>{JSON.stringify(roomID)}</Text>
            <Button title="Log Out" onPress={() => {
                console.log(JSON.stringify(roomID))
                setRoomID(null) //Log Out
                updateRoomIDStatus(null) //Save logout
                }
            }></Button>
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