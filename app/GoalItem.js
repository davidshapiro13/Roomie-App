import { StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function GoalItem( {title, completed}) {
    const [isSelected, setSelected] = useState(true)

    return (
        <View style={styles.checkboxContainer}>
            <Text>{title}</Text>

            <BouncyCheckbox
                isChecked={isSelected}
                onPress={(newState) => {
                    setSelected(newState);
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

const styles = StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
  });
