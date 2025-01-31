import { StyleSheet, Text, View, Button, Modal } from 'react-native';
import React, {useState} from 'react';
import ChoreSettingsView from './ChoreSettingsView';

export default function ChoreView( { roomID} ) {
    const [settingsOn, setSettingsOn] = useState(false)

    return (
        <View style={styles.container}>
            <Text>Chore</Text>
            <Button title="PRESS" onPress={() => getChoreWeeksList()}/>

            <Button title="Settings" onPress={() => setSettingsOn(true)}/>
            <Modal animationType="slide"
                   transparent={false}
                   visible={settingsOn}
                   onRequestClose={() => {
                    setSettingsOn(false);}}>
                <ChoreSettingsView roomID={roomID} onClose={() => setSettingsOn(false)}/>
            </Modal>    
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


  function getChoreWeeksList(numWeeks = 5) {
    let nameList = getNameList()
    let choreList = getChoreList()
    let namePoints = []
    const startDate = getStartDate()
    let assignments = []
    nameList.forEach( name => {
        namePoints.push({name: name, points: 0})
    })
    //Sort user points low to high
    namePoints.sort((item1, item2) => item1.points - item2.points)

    //Sort chore points highest to lowest
    choreList.sort((item1, item2) => item2.points - item1.points)

    for (let weekNum = 0; weekNum < numWeeks; weekNum++) {
        let week_chores = []
        const neededChores = choreList.filter( chore => weekNum % chore.points == 0) 
        for (let choreNum = 0; choreNum < neededChores.length; choreNum++) {
            week_chores.push( {chore: neededChores[choreNum].title,
                               worker: namePoints[0].name } )
            console.log(neededChores[choreNum].points)
            namePoints[0].points += neededChores[choreNum].points
            namePoints.sort((item1, item2) => item1.points - item2.points)
        }
        assignments.push(week_chores)
    }
    console.log(namePoints)
    console.log(assignments)
  }

  function getNameList() {
    return ["Jeremy", "Johnny", "Teddy"]
  }

  function getChoreList() {
    return [{title: "Stove", points: 4}, {title: "Trash", points: 1}]
  }

  function getStartDate() {
    return 0
  }