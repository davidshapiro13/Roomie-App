import { Text, View, Button, Modal } from 'react-native';
import {styles} from './Styles';
import React, {useState} from 'react';
import { database, getDataFromDoc } from './Database';
import ChoreSettingsView from './ChoreSettingsView';

export default function ChoreView( { roomID} ) {
    const [settingsOn, setSettingsOn] = useState(false)

    return (
        <View style={styles.container}>
            <Text>Chore</Text>
            <Button title="PRESS" onPress={() => getChoreWeeksList(database, roomID)}/>

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




async function getChoreWeeksList(database, roomID, numWeeks = 5) {
  let nameList = await getNameList(database, roomID)
  let choreList = await getChoreList(database, roomID)
  let namePoints = []
  let assignments = []
  nameList.forEach( person => {
      namePoints.push({name: person.name, points: person.points})
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
      namePoints[0].points += neededChores[choreNum].points
      namePoints.sort((item1, item2) => item1.points - item2.points)
    }
    assignments.push(week_chores)
  }
  console.log(assignments)
}

async function getNameList(database, roomID) {
  const data = await getDataFromDoc(database, 'rooms', roomID)
  const array = Object.entries(data.members).sort()
  const name_array = array.map((element) => ({name: element[0], points: element[1]}))
  return name_array
}

async function getChoreList(database, roomID) {
  const data = await getDataFromDoc(database, 'rooms', roomID)
  const array = Object.entries(data.choreList)
  let chore_list = []
  array.forEach( section => {
    const chores = Object.entries(section[1])
    const chore_array = chores.map( chore => ( {title: chore[0], points: chore[1]} ))
    chore_list.push(...chore_array)
  })
  return chore_list
}