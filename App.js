import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import LoginView from './app/LoginView';
import MainView from './app/MainView';
import { getLoggedInStatus, getSavedRoomID } from './app/Database';
import { NavigationContainer } from '@react-navigation/native';

function logout(loggedIn) {
  loggedIn = false
}

const Stack = createNativeStackNavigator()
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export default function App() {

  const [roomID, setRoomID] = useState(null)

  useEffect( () => {
    const fetchRoomID = async () => {
      const savedRoomID = await getSavedRoomID();
      setRoomID(savedRoomID)
      console.log(roomID)
    }
    fetchRoomID()
  })
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
      { roomID != null ? (
              <Screen name = "Main">
                {() => <MainView roomID={roomID} setRoomID={setRoomID}/>}
              </Screen>
              ) : (
              <Screen name="Login">
                {() => <LoginView setRoomID={setRoomID}/>}
              </Screen>
              )}
      </Navigator>
      </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  }
});
