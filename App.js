import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import LoginView from './app/LoginView';
import MainView from './app/MainView';
import { getSavedItem, getSavedRoomID } from './app/Database';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './app/Styles'

function logout(loggedIn) {
  loggedIn = false
}

const Stack = createNativeStackNavigator()
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export default function App() {

  const [roomID, setRoomID] = useState(null)
  const [username, setUsername] = useState(null)

  /**
   * Load roomID if there is one
   */
  useEffect( () => {
    const fetchRoomID = async () => {
      const savedRoomID = await getSavedItem('@roomID');
      setRoomID(savedRoomID)
    }
    fetchRoomID()
  })

  return (
    <GestureHandlerRootView>
    <NavigationContainer>
        <Navigator screenOptions={{ headerShown: false }}>
        { roomID != null ? (
                <Screen name = "Main">
                  {() => <MainView roomID={roomID} setRoomID={setRoomID} />}
                </Screen>
                ) : (
                <Screen name="Login">
                  {() => <LoginView setRoomID={setRoomID}/>}
                </Screen>
                )}
        </Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
  )
}