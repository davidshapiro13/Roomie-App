import { StyleSheet, Text, TextInput, View, Button, FlatList, Alert } from 'react-native';
import { database, updateData, getData, getSavedRoomID, getDataFromDoc } from './Database';
import React, {useState, useEffect} from 'react';


let goals = []

export default function GoalView() {
    const [newGoal, newGoalChanged] = useState('New Goal')
    const [roomID, setRoomID] = useState(null)
    const [goals, setGoals] = useState([])

    useEffect( () => {
        const getInfo = async () => {
            try {
                const newRoomID = await getSavedRoomID()
                setRoomID(newRoomID)

                const newGoals = loadGoals(roomID)
                setGoals(newGoals)
            }
            catch (error) {
                console.log("Error getting info - ", error)
            }
        }
        getInfo()
    })

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
            <Text>{goals}</Text>
            <FlatList
                data={goals} renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}/>
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

async function loadGoals(roomID) {
    try {
        const data = await getDataFromDoc(database, 'rooms', roomID)
        const goals = data["goals"]
        return goals
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