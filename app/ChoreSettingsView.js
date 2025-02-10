import { Text, View, Button, Modal, SectionList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import React, {useState, useEffect} from 'react';
import { styles } from './Styles'
import { updateData, database, getDataFromDoc } from './Database';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { freqToName, NEVER, proper } from './General';
import { deleteField } from 'firebase/firestore';
import IndividualChoreSetting from './IndividualChoreSettingView';

export default function ChoreSettingsView( {roomID, onClose }) {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [newSection, newSectionChanged] = useState("New Section")

    //Modal Info
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

    /**
    * Delete button for chore item
    */
    const renderRightActionsChore = ( {roomID, sectionName, choreName} ) => (
        <TouchableOpacity onPress={() => {
            deleteChoreItem(roomID, sectionName, choreName)
        }}>
            <Text>Delete</Text>
        </TouchableOpacity>
    )

     /**
    * Delete button for section item
    */
     const renderRightActionsSection = ( {roomID, sectionName} ) => (
        <TouchableOpacity onPress={() => {
            deleteChoreItem(roomID, sectionName)
        }}>
            <Text>Delete</Text>
        </TouchableOpacity>
    )

    /**
     * Section Item
     */
    const SectionItem = ( { sectionName }) => (
        <View style={styles.checkboxContainer}>
            <Text style={styles.header}>{sectionName}</Text>
            <Button title="Add Chore" onPress={() => {
                setChoreModalVisible(true)
                setEditedChoreTitle("")
                setEditedChoreFreq(NEVER)
                setCurrentSection(sectionName)
            }}/>
        </View>
    )

    const ListItem = ( {sectionName, title, freq}) => {
        return(
            <View style={styles.checkboxContainer}>
                <Text>{title}</Text>
                <Button title={freqToName[freq]} onPress={() => {
                    setCurrentSection(sectionName)
                    setEditedChoreTitle(title)  
                    setEditedChoreFreq(freq)
                    setChoreModalVisible(true)           
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
                    <Swipeable renderRightActions=
                        {(progress, dragX) =>
                            renderRightActionsChore({roomID: roomID, sectionName: section.title, choreName: item.job})}
                    >
                        <ListItem sectionName={section.title} title={item.job} freq={item.freq}/>
                    </Swipeable>
                }
                renderSectionHeader={({section: {title}}) => (
                    <Swipeable renderRightActions={(progress, dragX) => renderRightActionsSection({roomID: roomID, sectionName: title})}>
                        <SectionItem sectionName={title}/>
                    </Swipeable>
                )}
                refreshControl={
                <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={load}   
                />}
            />

            <Modal animationType="slide"
                   transparent={false}
                   visible={choreModalVisible}
                   onRequestClose={() => {
                    setChoreModalVisible(false)}}>
                <IndividualChoreSetting sectionName={currentSection} title={editedChoreTitle} freq={editedChoreFreq} addChore={addChore}/>
            </Modal>    

            <Button title="Save" onPress={async () => onClose()}/>
        
        </View>
     
    )

    /**
     * Deletes a chore or section item
     * @param {*} roomID - roomID where chore/section resides
     * @param {*} sectionName - name of section
     * @param {*} choreName - name of the chore
     */
    async function deleteChoreItem(roomID, sectionName, choreName=null) {
        
        try {
            let data
            if (choreName == null) {
                console.log(choreName)
                data = {[`choreList.${sectionName}`] : deleteField()}
            }
            else {
                data = {[`choreList.${sectionName}.${choreName}`] : deleteField()}
            }
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
        if (newChores.length == 0) {
            setIsRefreshing(false)
            return false
        }
        let proper_format = format(newChores)
        console.log(proper_format)
        updateChores(proper_format)
        setIsRefreshing(false)
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

    /**
     * Converts chores into readable format
     * @param {*} original 
     * @returns formatted version
     */
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

    /**
     * Adds a new section to chore list
     * @param {*} roomID of room
     * @param {*} sectionName to add
     */
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

    /**
     * Adds a new chore to the section
     * @param {*} sectionName of section
     * @param {*} choreName to add
     * @param {*} freq of chore
     */
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