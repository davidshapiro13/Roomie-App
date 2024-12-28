import { StyleSheet, Text, View, Button } from 'react-native';
import { getSavedRoomID, updateRoomIDStatus } from './Database'
import React from 'react';

export default function HomeView( { setRoomID } ) {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Button title="Log Out" onPress={() => {
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