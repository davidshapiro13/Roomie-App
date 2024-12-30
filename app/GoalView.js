import { StyleSheet, Text, TextInput, View, Button, FlatList, RefreshControl} from 'react-native';
import { database, updateData, getDataFromDoc } from './Database';
import React, {useState, useEffect} from 'react';
import GoalItem from './GoalItem';


export default function GoalView( {roomID }) {
    const [newGoal, newGoalChanged] = useState('New Goal')
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [goals, setGoals] = useState([])

    useEffect( () => {
        const load = async () => {
            setIsRefreshing(true)
            let newGoals = await loadGoals(roomID)
            let proper_format = format(newGoals)
            setGoals(proper_format)
            setIsRefreshing(false)
        }
        load()
    }, [] )

    return (
        <View style={styles.container}>
            <Text>New Goal</Text>
            <TextInput style={styles.input}
                onChangeText={newGoalChanged}
                value={newGoal}
            />
            <Button title="Submit" onPress={() => {
                submit(roomID, newGoal)
                load()
            }}
            />

            <FlatList
                data={goals} renderItem={({item}) => <GoalItem title={item.title} completed={item.completed}/>}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={load}   
                    /> }
            />
        </View>
    )

    async function load() {
        setIsRefreshing(true)
        let newGoals = await loadGoals(roomID)
        let proper_format = format(newGoals)
        setGoals(proper_format)
        setIsRefreshing(false)
    }
}


async function submit(roomID, newGoal) {
    try {
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
    let result = []
    const array = Object.entries(original)
    array.forEach( item => {
        const uniqueID = Date.now().toString() + Math.random()
        const map = {id: uniqueID, title: item[0], completed: item[1]}
        result.push(map)
    })
    return result.sort((item1, item2) => item1.title.localeCompare(item2.title))
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