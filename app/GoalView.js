import { Text, TextInput, View, Button, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { database, updateData, getDataFromDoc } from './Database';
import React, {useState, useEffect} from 'react';
import GoalItem from './GoalItem';
import { deleteField } from 'firebase/firestore';
import { styles } from './Styles';


export default function GoalView( {roomID }) {

    const DEFAULT_GOAL_NAME = 'New Goal'

    const [newGoal, newGoalChanged] = useState(DEFAULT_GOAL_NAME)
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [goals, setGoals] = useState([])
    const [errorMessage, setErrorMessage] = useState("")

    /**
     * Load goals on initial load of screen
     */
    useEffect( () => {
        const loadUseEffect = async () => {
            await load()
        }
        loadUseEffect()
    }, [] )

    /**
     * Delete button for goal item
     */
    const renderRightActions = ( {roomID, title} ) => (
        <TouchableOpacity onPress={() => deleteItem(roomID, title)}>
            <Text>Delete</Text>
        </TouchableOpacity>
    )

    /**
     * Goal Item that is slideable to delete
     */
    const renderItem = ( {item} ) => (
        <Swipeable renderRightActions={(progress, dragX) => renderRightActions({roomID, title: item.title})}>
            <GoalItem title={item.title} completed={item.completed} roomID={roomID}/>
        </Swipeable>
    )

    
    return (
        <View style={styles.container}>
            <Text style={styles.error}>{errorMessage}</Text>

            <Text>New Goal</Text>
            <TextInput style={styles.input}
                onChangeText={newGoalChanged}
                value={newGoal}
            />

            <Button title="Submit" onPress={async () => {
                if (proper(newGoal)) {
                    await submit(roomID, newGoal)
                    let loadSuccess = await load()
                    if (loadSuccess) {
                        setErrorMessage("")
                    }
                }
                else {
                    setErrorMessage("Create a name for goal")
                }
            }}
            />

            <FlatList
                data={goals} renderItem={renderItem}
                style={styles.list}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={load}   
                    /> }
            />

        </View>
    )

    /**
     * checks for new goals and uploads
     * @return true if success; false if not connected to internet
     */
    async function load() {
        setIsRefreshing(true)
        let newGoals = await loadGoals(roomID)
        if (newGoals.length == 0) {
            setIsRefreshing(false)
            return false
        }
        let proper_format = format(newGoals)
        setGoals(proper_format)
        setIsRefreshing(false)
        return true
    }
    
    /**
     * Deletes a goal item
     * @param {*} roomID - roomID where goal resides
     * @param {*} goalName - name of the goal
     * @param {*} setIsRefreshing - refreshing control to turn on and off
     */
    async function deleteItem(roomID, goalName, setIsRefreshing) {
        try {
            const data = {[`goals.${goalName}`]: deleteField()}
            await updateData(database, 'rooms/' + roomID, data)
            await load(setIsRefreshing)
        }
        catch (error) {
            console.log("Error deleting item, " + error)
        }
    }
    
    /**
     * Enter a new goal
     * @param {*} roomID - room ID of room where goal goes 
     * @param {*} newGoal - name of new goal
     */
    async function submit(roomID, newGoal) {
        try {
            const data = {[`goals.${newGoal}`] : false}
            const _ = await updateData(database, 'rooms/' + roomID, data)
        }
        catch (error) {
            console.log("Error " + error)
            throw error
        }
    }
    
    /**
     * Correctly formats and sorts items for display
     * @param {*} original - original data
     * @returns sorted format
     */
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

    /**
     * Checks if goalName is proper or not
     * @param {*} goalName - name of goal
     * @returns true if proper format; false otherwise
     */
    function proper(goalName) {
        if (goalName.length == 0 || goalName == DEFAULT_GOAL_NAME) {
            return false
        }
        else {
            return true
        }
    }
    
    /**
     * Retrieves goal data from database
     * @param {*} roomID - roomID of room loading for
     * @returns new goals
     */
    async function loadGoals(roomID) {
        const data = await getDataFromDoc(database, 'rooms', roomID)
        if (data.length == 0) {
            setErrorMessage("Cannot connect to Internet")
            return []
        }
        else {
            const newGoals = data.goals
            return newGoals
        }
    }
}