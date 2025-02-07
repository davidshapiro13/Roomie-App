import { Picker } from '@react-native-picker/picker';
import { styles } from './Styles'
import React, {useState} from 'react';
import { Text, View, Button, TextInput} from 'react-native';
import { NEVER, ONCE_A_WEEK, TWICE_A_MONTH, ONCE_A_MONTH } from './General';

export default IndividualChoreSetting = ( { sectionName, title, freq, addChore }) => {
    const [chosenValue, setChosenValue] = useState(freq)
    const [currentTitle, updateCurrentTitle] = useState(title)
    return (
        <View style={styles.checkboxContainer}>
            <View style={{ width: 200}}>
            <Text>{title}</Text>
            <TextInput style={styles.input}
                    onChangeText={updateCurrentTitle}
                    value={currentTitle}
                />
            <Picker
            selectedValue={chosenValue}
            onValueChange={ (itemVal, itemIndex) => setChosenValue(itemVal)}>
                <Picker.Item label={NEVER} value={0}/>
                <Picker.Item label={ONCE_A_WEEK} value={1}/>
                <Picker.Item label={TWICE_A_MONTH} value={2}/>
                <Picker.Item label={ONCE_A_MONTH} value={4}/>
            </Picker> 
            <Button title="Submit" onPress={() => addChore(sectionName, currentTitle, chosenValue)} />
            </View>
        </View>
    )
}