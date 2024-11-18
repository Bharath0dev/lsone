import axios from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { MultiSelect } from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const getNextSevenDays = () => {
    const today = new Date();
    const dates = [];

    for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push({
            label: nextDate.toLocaleDateString(), // Format as needed
            value: nextDate.toISOString().split('T')[0], // Use YYYY-MM-DD format as value
        });
    }

    return dates;
};



const slotTimings = [
    {
        id:'1',
        value: "10:00AM",
        label: "10:00AM",
    },{
        id:'2',
        value: '11:00AM',
        label: '11:00AM',
    },{
        id:'3',
        value: '12:00PM',
        label: '12:00PM',
    },{
        id:'4',
        value: '2:00PM',
        label: '2:00PM'
    },{
        id:'5',
        value: '4:00PM',
        label: '4:00PM'
    },{
        id:'6',
        value: '5:00PM',
        label: '5:00PM',
    }
];


const MultiSelectComponent = ({ onSave }) => {
    const [dropdownValue, setDropdownValue] = useState(null);
    const [selected, setSelected] = useState([]);

    // Generate dates for the dropdown
    const dateOptions = getNextSevenDays();


    const handleSchedule = async ()=> {
        const providerId = "66f53c11f644ed457ec56f32";

        console.log(dropdownValue);
        console.log(selected);

        if(!dropdownValue || !selected){
            Alert.alert('select the date and Time');
        }

        const dataToSend = {
            providerId,
            dates: [
                {
                    date: dropdownValue,
                    time: selected,
                }
            ]
        }
        console.log(dataToSend);
        console.log("Data to Send:", JSON.stringify(dataToSend, null, 2));


        try{
            const response = await axios.post('http://192.168.1.218:4021/createAvailability', dataToSend);
            console.log(response.data);

            setDropdownValue(null);
            setSelected([]);
            onSave();

        }catch (error) {
            console.log("Error while sending data to availability", error.message);
            if (error.response) {
                console.log("Response data:", error.response.data);
                console.log("Response status:", error.response.status);
                console.log("Response headers:", error.response.headers);
            }
        }
    }


    return (
        <View style={styles.container}>
            <View>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={dateOptions} // Use the generated date options
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Select date"
                    searchPlaceholder="Search..."
                    value={dropdownValue}
                    onChange={item => {
                        setDropdownValue(item.value);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign style={styles.icon} color="black" name="calendar" size={20} />
                    )}
                />
            </View>

            <View>
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={slotTimings} // Use the same date options
                    labelField="label"
                    valueField="value"
                    placeholder="Select time slots"
                    searchPlaceholder="Search..."
                    // disable= {true}
                    value={selected}
                    onChange={item => {
                        setSelected(item);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign style={styles.icon} color="black" name="calendar" size={20} />
                    )}
                    selectedStyle={styles.selectedStyle}
                    disable={(dropdownValue === null)?(true):(false)}
                />
            </View>
            <View>
                <Button 
                onPress={handleSchedule}
                style={styles.button}
                labelStyle={styles.buttonText}
                disabled={!dropdownValue || selected.length === 0}>Save</Button>
            </View>
        </View>
    );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
    container: { padding: 16 },
    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'white',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
    button:{
        backgroundColor: '#00634B',
        borderRadius: 8,
        // width: '90%',
        // margin: 15
      },
      buttonText:{
        color: 'white',
        fontSize: 15
      }
});
