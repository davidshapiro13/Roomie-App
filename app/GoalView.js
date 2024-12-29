import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { database, updateData, getData, getSavedRoomID, getDataFromDoc } from './Database';
import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function GoalView( {roomID }) {
    const [newGoal, newGoalChanged] = useState('New Goal')
    const [goals, setGoals] = useState([{id: 1, title: "hellol", completed: true}])
    return (
        <View style={styles.container}>
            <Text>New Goal</Text>
            <TextInput style={styles.input}
                onChangeText={newGoalChanged}
                value={newGoal}
            />
            <Button title="Submit" onPress={() => {
                submit(newGoal)}}
            />
            <Button title="Load" onPress={() => {
                const load = async () => {
                    let newGoals = await loadGoals(roomID)
                    let proper_format = format(newGoals)
                    console.log(proper_format)
                    setGoals([proper_format])
                }
                load()
                }}
            />
            <FlatList
                data={goals} renderItem={({item}) => <Text style={styles.item}>{item.title}</Text>} keyExtractor={item => item.id}/>
            <Text>HI</Text>
        </View>
    )
}

async function submit(newGoal) {
    try {
        const roomID = await getSavedRoomID()
        console.log("IMPORTANT ", roomID)
        const data = {[`goals.${newGoal}`] : false}
        const _ = await updateData(database, 'rooms/' + roomID, data)
        console.log(roomID)
    }
    catch (error) {
        console.log("Error " + error)
        throw error
    }
}

function format(original) {
    
    const array = Object.entries(original)[0]
    const uniqueID = Date.now().toString()
    console.log(uniqueID)
    return {id: uniqueID, title: array[0], completed: array[1]}
}
async function loadGoals(roomID) {
    try {
        const data = await getDataFromDoc(database, 'rooms', roomID)
        const newGoals = data.goals
        return newGoals
    }
    catch (error) {
        console.log("ERROR LoadGoals() - " + error)
        return []
    }
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
    },
    item: {
        padding: 10,
        justifyContent: "center",
        fontSize: 18,
        height: 44,
      },
  });