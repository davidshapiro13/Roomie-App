import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Animated, Button, RefreshControl } from 'react-native';
import { styles } from './Styles'
import PieChart from 'react-native-pie-chart';
import { pieChartColors } from './General';
import { updateData, database, getSavedItem, getDataFromDoc } from './Database';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteField } from 'firebase/firestore';

export default function WheelView( { roomID }) {
    const widthAndHeight = 250

    const DEFAULT_MOVIE_NAME = ''

    const [movieName, movieNameChanged] = useState(DEFAULT_MOVIE_NAME)
    const [size, changeSize] = useState(10)

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [endDegrees, setEndDegrees] = useState("0")

    /**
     * Load goals on initial load of screen
     */
    useEffect( () => {
        const loadUseEffect = async () => {
            await load()
        }
        loadUseEffect()
    }, [] )

    const [series, updateSeries] = useState([
        { value: size, color: '#fbd203'},
      ])
    const spinValue = useRef(new Animated.Value(0)).current

    const spinning = () => {
        load()
        spinValue.setValue(0)
        let spinAmount = Math.floor(Math.random() * 360 + 360)
        setEndDegrees(spinAmount)
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true
        }).start()
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", `${endDegrees}deg`]
    })

    /**
     * checks for new movies and uploads
     * @return true if success; false if not connected to internet
     */
    async function load() {
        setIsRefreshing(true)
        let newMovies = await loadMovies(roomID)
        if (newMovies.length == 0) {
            setIsRefreshing(false)
            return false
        }
        const username = await getSavedItem('@username')
        let proper_format = format(newMovies, username)
        updateSeries(proper_format)
        setIsRefreshing(false)
        return true
    }
    
    /**
     * Retrieves movie data from database
     * @param {*} roomID - roomID of room loading for
     * @returns all movies
     */
    async function loadMovies(roomID) {
        const data = await getDataFromDoc(database, 'rooms', roomID)
        if (data.length == 0) {
            setErrorMessage("Cannot connect to Internet")
            return []
        }
        else {
            const movies = data.movies
            return movies
        }
    }

    async function submit(roomID, movieName) {
        try {
            const username = await getSavedItem('@username')
            const data = {[`movies.${username}`] : movieName}
            const _ = await updateData(database, 'rooms/' + roomID, data)
            await load()
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
    function format(original, username) {
            let result = []
            const array = Object.entries(original)
            array.forEach( (item, i) => {
               if (username == item[0]) {
                    movieNameChanged(item[1])
               }
               const pieSlice = { value: 1, color: pieChartColors[i % pieChartColors.length], label: { text: item[1], fontWeight: 'bold' } }
               result.push(pieSlice)
            })
            return result.sort((item1, item2) => item1.label.text.localeCompare(item2.label.text))
        }

    /**
     * Deletes a movie item
     * @param {*} roomID - roomID where movie resides
     * @param {*} username - name of the user
     * @param {*} setIsRefreshing - refreshing control to turn on and off
     */
    async function deleteMovie(roomID) {
        try {
            const username = await getSavedItem('@username')
            const data = {[`movies.${username}`]: deleteField()}
            await updateData(database, 'rooms/' + roomID, data)
            await load()
        }
        catch (error) {
            console.log("Error deleting item, " + error)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={load}   
                    /> }>
                <Text>Add Your Movie</Text>
                <TextInput style={styles.input}
                    onChangeText={movieNameChanged}
                    value={movieName}
                />
                <Button title="Submit" onPress={() => submit(roomID, movieName)} />

                <Animated.View style={[styles.pieContainer, { transform: [{ rotate: spin }] }]}>
                    <PieChart widthAndHeight={widthAndHeight} series={series}/>
                </Animated.View>
                <Button title="Spin" onPress={spinning} />

                <Text>Your Movie Is</Text>
                <Text>{movieName}</Text>
                <Button title="Removie" onPress={() => deleteMovie(roomID)}/>
            </ScrollView>
        </View>
    )
}