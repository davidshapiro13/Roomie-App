import { StyleSheet, Text, View, Button, Modal, SectionList } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Picker } from '@react-native-picker/picker';
import { styles } from './Styles'
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateData, database, getSavedItem, getDataFromDoc } from './Database';
import { freqToName } from './General';

export default function ChoreSettingsView( {roomID, onClose }) {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
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
    
    return (
        <SafeAreaView style={styles.container} >
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <SectionList style={{padding: 100}} sections={chores}
            renderItem={ ( {item } ) => 
                <ListItem title={item.job} freq={item.freq}/>
            }
            renderSectionHeader={({section: {title}}) => (
                <Text style={styles.header}>{title}</Text>
            )}
            />
        <Button title="Save" onPress={async () => onClose()}/>
        
        </SafeAreaView>
     
    )

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
        console.log("RESULT ", result)
        return result
    }
}

function ListItem( {title, freq}) {
    return(
        <View style={styles.checkboxContainer}>
            <Text>{title}</Text>
            <Button title={freqToName[freq]} onPress={() => {

            }}/>
        </View>
    )
}
function IndividualChoreSetting() {
    const [chosenValue, setChosenValue] = useState("option1")
    return (
        <View style={styles.checkboxContainer}>
            <View style={{ width: 200}}>
            <Picker
            selectedValue={chosenValue}
            onValueChange={ (itemVal, itemIndex) => setChosenValue(itemVal)}>
                <Picker.Item label="Option 1" value="option1"/>
                <Picker.Item label="Option 2" value="option2"/>
            </Picker> 
            </View>
        </View>
    )
}