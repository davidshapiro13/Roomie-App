import React, { useRef, useState, useEffect, act } from 'react';
import { View, Text, TextInput, Animated, Button, RefreshControl, Easing } from 'react-native';
import { styles } from './Styles'
import PieChart from 'react-native-pie-chart';
import { pieChartColors, FULL_ROTATION, proper } from './General';
import { updateData, database, getSavedItem, getDataFromDoc } from './Database';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteField } from 'firebase/firestore';
import { Svg, Polygon } from 'react-native-svg';

export default function WheelView( { roomID }) {
    const widthAndHeight = 250

    const DEFAULT_MOVIE_NAME = ''

    const [movieName, movieNameChanged] = useState(DEFAULT_MOVIE_NAME)
    const [size, changeSize] = useState(10)

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [totalRotation, setTotalRotation] = useState(0)
    const [endDegrees, setEndDegrees] = useState("0")
    const [startDegrees, setStartDegrees] = useState("0")
    const [winner, setWinner] = useState("WINNER")

    /**
     * Load movies on initial load of screen
     */
    useEffect( () => {
        const loadUseEffect = async () => {
            await load()
        }
        loadUseEffect()
        clear()
    }, [] )



    const [series, updateSeries] = useState([
        { value: size, color: '#fbd203'},
      ])
    const spinValue = useRef(new Animated.Value(0)).current

    const spinning = () => {
        load()
        spinValue.setValue(0)
        let spinAmount = Math.floor(Math.random() * 360 + 360)
        let newRotation //Updated rotation

        setTotalRotation(prevRotation => {
            newRotation = prevRotation + spinAmount
            setEndDegrees(spinAmount + startDegrees)
            return newRotation
        })

        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
        }).start( () => {
            setStartDegrees(prevStart => prevStart + spinAmount)
            const newWinner = getWinner(newRotation)
            setWinner(newWinner)
        })
    }

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: [`${startDegrees}deg`, `${endDegrees}deg`]
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
            console.log(movies)
            return movies
        }
    }

    async function submit(roomID, movieName) {
        if (proper(movieName)) {
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
            setErrorMessage("")
        }
        else {
            setErrorMessage("Movie name isn't recognized")
        }
    }

        /**
     * Correctly formats and sorts items for display
     * @param {*} original - original data
     * @returns sorted format
     */
    function format(original, username) {
            let result = []
            const array = Object.entries(original).sort()
            array.forEach( (item, i) => {
               if (username == item[0]) {
                    movieNameChanged(item[1])
               }
               const pieSlice = { value: 1, color: pieChartColors[i % pieChartColors.length], label: { text: item[1], fontWeight: 'bold' } }
               result.push(pieSlice)
            })
            return result
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

    function getWinner(rotation) {
        const sliceSize = FULL_ROTATION / series.length
        const actualRotation = rotation % FULL_ROTATION
        const reverseRotation = FULL_ROTATION - actualRotation
        console.log(reverseRotation)
        for (let i = 0; i < series.length; i++) {
            const lower = sliceSize * i
            const lowerBounded = reverseRotation >= lower
            const upperBounded = reverseRotation < sliceSize * (i + 1)
            if (upperBounded && lowerBounded) {
                //Go backwards to account for spin direction
                return series[i].label.text
            }
        }
        return "ERROR"
    }

    function clear() {
        setTotalRotation(0)
        setStartDegrees(0)
        setEndDegrees(0)
    }

    return (
        <View style={styles.container}>
            <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            load()
                            clear
                        }}   
                    />
            }>
                <Text>Add Your Movie</Text>
                <TextInput style={styles.input}
                    onChangeText={movieNameChanged}
                    value={movieName}
                />
                <Button title="Submit" onPress={() => submit(roomID, movieName)} />
                <Text style={styles.error}>{errorMessage}</Text>
                <View style={styles.pointer}>
                    <Svg  height="50" width="25">
                        <Polygon points="0,0 25,0 12.5,50" fill="blue" />
                    </Svg>
                </View>
                <Animated.View style={[styles.pieContainer, { transform: [{ rotate: spin }] }]}>
                    <PieChart widthAndHeight={widthAndHeight} series={series}/>
                </Animated.View>
                <Button title="Spin" onPress={spinning} />

                <Text>Your Movie Is</Text>
                <Text>{movieName}</Text>
                <Button title="Removie" onPress={() => deleteMovie(roomID)}/>
                <Text>Winner: {winner}</Text>
                <Button title="clear" onPress={() => {
                    clear()
                }}
            />
            </ScrollView>
        </View>
    )
}