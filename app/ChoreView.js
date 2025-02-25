import { Text, View, Button, Modal, SectionList, FlatList, RefreshControl } from 'react-native';
import {styles} from './Styles';
import React, {useState, useEffect} from 'react';
import { database, getDataFromDoc, getSavedItem, updateData } from './Database';
import ChoreSettingsView from './ChoreSettingsView';
import { getUpcomingWeeks, CALENDAR_WEEK_NUM } from './General';
import ChoreItem from './ChoreItem';

export default function ChoreView( { roomID} ) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [settingsOn, setSettingsOn] = useState(false)
    const [choreList, setChoreList] = useState([])
    const [userChoreList, setUserChoreList] = useState([])

    /**
    * Load chores on initial load of screen
    */
    useEffect( () => {
      const loadUseEffect = async () => {
        await load()
      }
      loadUseEffect()
    }, [])

    const renderItem = ( {item} ) => (
      <ChoreItem section={item.section} title={item.title} completed={item.completed} roomID={roomID} load={load}/>
    )

    return (
        <View style={styles.container}>
            <Text>Your Chores:</Text>
            <FlatList
                data={userChoreList} renderItem={renderItem}
                style={styles.list}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={load}   
                    /> }
            />
            <Text>Chore List</Text>
            <SectionList style={{padding: 100}} sections={choreList}
                renderItem={ ( {item, section } ) => {
                  const isFirstSection = section == choreList[0]
                  if (item.completed && isFirstSection) {
                    return (
                      <Text>{item.chore} - {item.worker} - ✅</Text>
                    )
                  }
                  else {
                    return (
                      <Text>{item.chore} - {item.worker}</Text>
                    )
                  }
                  
                }
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
                <ChoreSettingsView roomID={roomID} onClose={() => {
                  load()
                  setSettingsOn(false)
                }}/>
            </Modal>    
        </View>
    )

    async function load() {
      setIsRefreshing(true)
      const items = await getChoreWeeksList(database, roomID)
      console.log(items)
      const startDate = await getStartDateFromStorage(database, roomID)
      const formattedItems = format(items, startDate)
      const thisWeek = await getUserChores(formattedItems[0])
      await assignFirebaseChores(thisWeek, roomID)
      setUserChoreList(thisWeek)
      setChoreList(formattedItems)
      setIsRefreshing(false)
    }

    /**
     * Correctly formats and sorts items for display
     * @param {*} original - original data
     * @returns sorted format
     */
      function format(original, startDate) {
        let result = []
        const array = Object.entries(original)
        const weekDates = getUpcomingWeeks(startDate)

        array.slice(0, CALENDAR_WEEK_NUM).forEach( (week, index) => {
          const uniqueID = Date.now().toString() + Math.random()
          const map = {id: uniqueID, title: weekDates[index], data: week[1]}
          result.push(map)
        })
        return result
      }
}

async function getUserChores(week) {
  let userChores = []
  const weeklyChores = week.data
  const username = await getSavedItem('@username')
  weeklyChores.forEach( chore => {
    if (chore.worker == username) {
      const uniqueID = Date.now().toString() + Math.random()
      userChores.push({id: uniqueID, title: chore.chore, section: chore.section, completed: chore.completed})
    }
  })
  return userChores
}

async function assignFirebaseChores(week, roomID) {
  const username = await getSavedItem('@username')
  week.forEach(async task => {
    console.log("HHHH")
    const data = {[`choreList.${task.section}.${task.title}.worker`] : username}
    const _ = await updateData(database, 'rooms/' + roomID, data)
  })
}



async function getChoreWeeksList(database, roomID, numWeeks = 20) {
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
    console.log(neededChores)
    for (let choreNum = 0; choreNum < neededChores.length; choreNum++) {
      week_chores.push( {chore: neededChores[choreNum].title,
                         completed: neededChores[choreNum].completed,
                         section: neededChores[choreNum].sectionName,
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
  console.log(array)
  let chore_list = []
  array.forEach( section => {
    const chores = Object.entries(section[1])
    const chore_array = chores.map( chore => ( {sectionName: section[0], title: chore[0], points: chore[1].points, completed: chore[1].completed} ))
    chore_list.push(...chore_array)
  })
  return chore_list
}

async function getStartDateFromStorage(database, roomID) {
  const data = await getDataFromDoc(database, 'rooms', roomID)
  return (data.chore_start_date).toDate()
}