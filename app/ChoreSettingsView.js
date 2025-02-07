import { StyleSheet, Text, View, Button, Modal, SectionList, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Picker } from '@react-native-picker/picker';
import { styles } from './Styles'
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateData, database, getSavedItem, getDataFromDoc, deleteItem } from './Database';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { freqToName, NEVER, ONCE_A_WEEK, TWICE_A_MONTH, ONCE_A_MONTH, proper } from './General';
import { TextInput } from 'react-native-gesture-handler';
import { deleteField } from 'firebase/firestore';

export default function ChoreSettingsView( {roomID, onClose }) {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [newSection, newSectionChanged] = useState("New Section")

    const [choreModalVisible, setChoreModalVisible] = useState(false)
    const [editedChoreTitle, setEditedChoreTitle] = useState(null)
    const [editedChoreFreq, setEditedChoreFreq] = useState(0)
    const [currentSection, setCurrentSection] = useState("")

    const [chores, updateChores] = useState([])

    /**
     * Load chores on initial load of screen
     */
      useEffect( () => {
        const loadUseEffect = async () => {
            await load()
        }
        loadUseEffect()
    }, [] )

    const tests = [{title: "LivingRoom", data: [{job: "Hi", freq: 1}]}]
    
    /**
    * Delete button for chore item
    */
    const renderRightActions = ( {roomID, sectionName, choreName} ) => (
        <TouchableOpacity onPress={() => {
            deleteChore(roomID, sectionName, choreName)
        }}>
            <Text>Delete</Text>
        </TouchableOpacity>
    )

     /**
    * Delete button for section item
    */
     const renderRightActionsSection = ( {roomID, sectionName} ) => (
        <TouchableOpacity onPress={() => {
            deleteSection(roomID, sectionName)
        }}>
            <Text>Delete</Text>
        </TouchableOpacity>
    )

    const SectionItem = ( { sectionName }) => (
        <View style={styles.checkboxContainer}>
            <Text style={styles.header}>{sectionName}</Text>
            <Button title="Add Chore" onPress={() => {
                setChoreModalVisible(true)
                setEditedChoreTitle("")
                setCurrentSection(sectionName)
            }}/>
        </View>
    )

    const IndividualChoreSetting = ( { sectionName, title, freq }) => {
        const [chosenValue, setChosenValue] = useState(freq)
        const [currentTitle, updateCurrentTitle] = useState(title)
        return (
            <View style={styles.checkboxContainer}>
                <View style={{ width: 200}}>
                <Text>{title}</Text>
                <TextInput style={styles.input}
                        onChangeText={updateCurrentTitle}
                        value={currentTitle}
                    />
                <Picker
                selectedValue={chosenValue}
                onValueChange={ (itemVal, itemIndex) => setChosenValue(itemVal)}>
                    <Picker.Item label={NEVER} value={0}/>
                    <Picker.Item label={ONCE_A_WEEK} value={1}/>
                    <Picker.Item label={TWICE_A_MONTH} value={2}/>
                    <Picker.Item label={ONCE_A_MONTH} value={4}/>
                </Picker> 
                <Button title="Submit" onPress={() => addChore(sectionName, currentTitle, chosenValue)} />
                </View>
            </View>
        )
    }

    const ListItem = ( {sectionName, title, freq}) => {
        return(
            <View style={styles.checkboxContainer}>
                <Text>{title}</Text>
                <Button title={freqToName[freq]} onPress={() => {
                    setChoreModalVisible(true)
                    setCurrentSection(sectionName)
                    setEditedChoreTitle(title)  
                    setEditedChoreFreq(freq)                
                }}/>
            </View>
        )
    }

    return (
        <View style={styles.container} >
            <View style={styles.textBox}>
                <TextInput style={styles.input}
                    onChangeText={newSectionChanged}
                    value={newSection}
                />
                <Button title="New Section" onPress={() => addNewSection(roomID, newSection)} />
            </View>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <SectionList style={{padding: 100}} sections={chores}
            renderItem={ ( {item, section } ) => 
                <Swipeable renderRightActions={(progress, dragX) => renderRightActions({roomID: roomID, sectionName: section.title, choreName: item.job})}>
                    <ListItem sectionName={section.title} title={item.job} freq={item.freq}/>
                </Swipeable>
            }
            renderSectionHeader={({section: {title}}) => (
                <Swipeable renderRightActions={(progress, dragX) => renderRightActionsSection({roomID: roomID, sectionName: title})}>
                    <SectionItem sectionName={title}/>
                </Swipeable>
            )}
            />
            <Modal animationType="slide"
                   transparent={false}
                   visible={choreModalVisible}
                   onRequestClose={() => {
                    setChoreModalVisible(false)}}>
                <IndividualChoreSetting sectionName={currentSection} title={editedChoreTitle} freq={editedChoreFreq}/>
            </Modal>    
        <Button title="Save" onPress={async () => onClose()}/>
        
        </View>
     
    )

    /**
     * Deletes a chore item
     * @param {*} roomID - roomID where chore resides
     * @param {*} choreName - name of the chore
     * @param {*} setIsRefreshing - refreshing control to turn on and off
     */
    async function deleteChore(roomID, sectionName, choreName) {
        try {
            const data = {[`choreList.${sectionName}.${choreName}`] : deleteField()}
            const _ = await updateData(database, 'rooms/' + roomID, data)
            await load()
        }
        catch (error) {
            console.log("Error deleting item, " + error)
        }
    }

        /**
     * Deletes a chore item
     * @param {*} roomID - roomID where chore resides
     * @param {*} choreName - name of the chore
     * @param {*} setIsRefreshing - refreshing control to turn on and off
     */
        async function deleteSection(roomID, sectionName) {
            try {
                const data = {[`choreList.${sectionName}`] : deleteField()}
                const _ = await updateData(database, 'rooms/' + roomID, data)
                await load()
            }
            catch (error) {
                console.log("Error deleting item, " + error)
            }
        }

    /**
     * checks for new chores and uploads
     * @return true if success; false if not connected to internet
     */
        async function load() {
            setIsRefreshing(true)
            let newChores = await loadChores(roomID)
            console.log(newChores)
            if (newChores.length == 0) {
                setIsRefreshing(false)
                return false
            }
            let proper_format = format(newChores)
            updateChores(proper_format)
            setIsRefreshing(false)
            console.log(chores)
            return true
        }
        
    /**
     * Retrieves chore data from database
     * @param {*} roomID - roomID of room loading for
     * @returns all chores
     */
    async function loadChores(roomID) {
        const data = await getDataFromDoc(database, 'rooms', roomID)
        if (data.length == 0) {
            setErrorMessage("Cannot connect to Internet")
            return {}
        }
        else {
            const chores = data.choreList
            return chores
        }
    }

    function format(original) {
        let result = []
        const array = Object.entries(original).sort()
        array.forEach( (category) => {
            const choresAsArray = Object.entries(category[1]).sort()
            let dataList = []
            choresAsArray.forEach( (item) => {
               dataList.push({job: item[0], freq: item[1]})
            })
            const newSection = {title: category[0], data: dataList}
            result.push(newSection)
        })
        return result
    }

    async function addNewSection(roomID, sectionName) {
        if (proper(sectionName)) {
            try {
                const data = {[`choreList.${sectionName}`] : {}}
                const _ = await updateData(database, 'rooms/' + roomID, data)
                await load()
            }
            catch (error) {
                console.log("Error " + error)
                throw error
            }
            setErrorMessage("")
        }
        else {
            setErrorMessage("Section name is not acceptable")
        }
    }

    async function addChore(sectionName, choreName, freq) {
        if (proper(choreName)) {
            try {
                const data = {[`choreList.${sectionName}.${choreName}`] : Number(freq)}
                const _ = await updateData(database, 'rooms/' + roomID, data)
                await load()
            }
            catch (error) {
                throw error
            }
            setChoreModalVisible(false)
        }
    }
}