import { Text, View} from 'react-native';
import React, {useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { database, updateData } from './Database';
import { styles } from './Styles';

export default function GoalItem( {title, completed, roomID}) {

    const [isSelected, setSelected] = useState(completed)

    return (
        <View style={styles.checkboxContainer}>
            <Text>{title}</Text>

            <BouncyCheckbox
                isChecked={isSelected}
                style={styles.checkbox}
                onPress={(newState) => {
                    setSelected(newState);
                    checkClicked(title, newState, roomID)
                    }}
                size={25}
                fillColor="#00bcd4"
                unfillColor="#ffffff"
                iconStyle={{ borderColor: '#00bcd4' }}
                innerIconStyle={{ borderWidth: 2 }}
                bounceEffect={true}
            />
        </View>
    )
}

/**
 * Updates status as done when checkmark is checked on and vice versa
 * @param {*} title - title of goal
 * @param {*} newState - new state (done or not) of goal
 * @param {*} roomID - roomID where goal resides
 */
async function checkClicked(title, newState, roomID) {
    const data = {[`goals.${title}`] : newState}
    const _ = await updateData(database, 'rooms/' + roomID, data)
}
