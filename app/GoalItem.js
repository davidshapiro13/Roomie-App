import { StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { database, updateData, getDataFromDoc } from './Database';

export default function GoalItem( {title, completed, roomID, database}) {
    const [isSelected, setSelected] = useState(completed)

    return (
        <View style={styles.checkboxContainer}>
            <Text>{title}</Text>

            <BouncyCheckbox
                isChecked={isSelected}
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

async function checkClicked(title, newState, roomID) {
    const data = {[`goals.${title}`] : newState}
    const _ = await updateData(database, 'rooms/' + roomID, data)
}

const styles = StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
  });
