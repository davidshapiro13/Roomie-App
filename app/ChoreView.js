import { Text, View, Button, Modal, SectionList, RefreshControl } from 'react-native';
import {styles} from './Styles';
import React, {useState, useEffect} from 'react';
import { database, getDataFromDoc } from './Database';
import ChoreSettingsView from './ChoreSettingsView';
import { getCurrentWeek, getUpcomingWeeks } from './General';

export default function ChoreView( { roomID} ) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [settingsOn, setSettingsOn] = useState(false)
    const [choreList, setChoreList] = useState([])

    /**
    * Load chores on initial load of screen
    */
    useEffect( () => {
      const loadUseEffect = async () => {
        await load()
      }
      loadUseEffect()
    }, [] )


    return (
        <View style={styles.container}>
            <Text>Chore List</Text>
            <SectionList style={{padding: 100}} sections={choreList}
                renderItem={ ( {item, section } ) => 
                  (
                    <Text>{item.chore} - {item.worker}</Text>
                  )
                }
                renderSectionHeader={({section: {title}}) => (
                  <Text style={styles.header}>{title}</Text>
                )}
                refreshControl={
                  <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={load}   
                  /> }
            />

            <Button title="Settings" onPress={() => setSettingsOn(true)}/>
            <Modal animationType="slide"
                   transparent={false}
                   visible={settingsOn}
                   onRequestClose={() => {
                    setSettingsOn(false)
                    load()}}>
                <ChoreSettingsView roomID={roomID} onClose={() => setSettingsOn(false)}/>
            </Modal>    
        </View>
    )

    async function load() {
      setIsRefreshing(true)
      const items = await getChoreWeeksList(database, roomID)
      const formattedItems = format(items)
      setChoreList(formattedItems)
      setIsRefreshing(false)
    }

    /**
     * Correctly formats and sorts items for display
     * @param {*} original - original data
     * @returns sorted format
     */
      function format(original) {
        let result = []
        const array = Object.entries(original)
        const weekDates = getUpcomingWeeks(array.length)

        array.forEach( (week, index) => {
          const uniqueID = Date.now().toString() + Math.random()
          const map = {id: uniqueID, title: weekDates[index], data: week[1]}
          result.push(map)
        })
        return result
      }
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
  return assignments
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