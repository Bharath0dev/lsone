import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BookingModal = ({ visible, onClose, customerId, serviceId, providerId }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [location, setLocation] = useState('');
    const [datesToHide, setDatesToHide] = useState([]);


    const timesArray = [
        { id: "1", time: "10:00 AM" },
        { id: "2", time: "11:00 AM" },
        { id: "3", time: "12:00 PM" },
        { id: "4", time: "1:00 PM" },
        { id: "5", time: "2:00 PM" },
        { id: "6", time: "3:00 PM" },
        { id: "7", time: "4:00 PM" },
      ];

    const today = new Date();
    const minDate = today.toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 28);
    const maxDateString = maxDate.toISOString().split('T')[0]; // 30 days from today

    const onDayPress = (day) => {
        if (day.dateString >= minDate && day.dateString <= maxDateString) {
            setSelectedDate(day.dateString);
            setShowCalendar(false);
        }
    };

    const handleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const getData = async () => {
        try {
            const storedLocation = await AsyncStorage.getItem('location');
            if (storedLocation) {
                const locationData = JSON.parse(storedLocation);
                // Check if locationData is an empty object or invalid, set as empty string
                if (!locationData || Object.keys(locationData).length === 0) {
                    setLocation('');
                } else {
                    setLocation(locationData);
                }
            } else {
                // If there is no location in storage, set as empty
                setLocation('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const getDatesToHide = async () => {
        try {
            const response = await axios.get('http://192.168.1.218:4021/getDatesToHide', { params: { providerId } });
            setDatesToHide(response.data.unAvailableDates);
            setDatesToHide(response.data.unAvailableDates || []);
        } catch (error) {
            console.log('Error while getting dates to hide:', error);
            // setDatesToHide([]);
        }
    };

    useEffect(() => {
        getDatesToHide();
    }, [providerId]);

    const proceedToBook = async () => {
        if (!selectedDate || !location) {
            Alert.alert(
                "Empty or invalid",
                "Please select all the fields",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            return;
        }

        const bookingData = {
            customerId,
            providerId,
            serviceId,
            scheduled_Date: selectedDate,
            preferredTime: selectedTime,
            location: location,
        };

        try {
            const response = await axios.post('http://192.168.1.218:4021/newBooking', bookingData);
            if (response.data.status === 'ok') {
                Alert.alert('Booking Successful', 'Your booking has been confirmed.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            onClose(); // Close the modal after the alert is acknowledged
                        }
                    }
                ]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const markedDates = {
        [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' }
    };

    // datesToHide.forEach(date => {
    //     markedDates[date] = { disabled: true, color: 'lightgrey' }; // Use light grey for disabled dates
    // });

    if (Array.isArray(datesToHide)) {
        datesToHide.forEach(date => {
            markedDates[date] = { disabled: true, color: 'lightgrey' };
        });
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <Button onPress={onClose} style={{ margin: 20, alignItems: 'flex-end' }}>Close</Button>

                    <View style={{ marginHorizontal: 15 }}>
                        <Text>Your Address</Text>
                    </View>
                    <View>
                        <TextInput
                            style={{
                                borderColor: "gray",
                                borderWidth: 0.7,
                                borderRadius: 9,
                                margin: 10,
                                height: 70,
                                fontSize: 16,
                            }}
                            defaultValue={location ? location : ''}
                            placeholder="Enter your full address"
                            multiline={true}
                            numberOfLines={3}
                        />
                    </View>

                    <View style={{ marginHorizontal: 15 }}>
                        <Text>Pick a Date</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleShowCalendar}
                        style={{
                            flexDirection: 'row',
                            margin: 15,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            columnGap: 20,
                            height: 40,
                            borderColor: '#00634B',
                            borderWidth: 1,
                            borderRadius: 6,
                            paddingHorizontal: 15
                        }}
                    >
                        {selectedDate ? (
                            <>
                                <Text style={{ color: '#00634B' }}>Selected Date: {selectedDate}</Text>
                                <MaterialIcons name='close' size={21} color='#00634B' />
                            </>
                        ) : (
                            <>
                                <Text style={{ color: '#00634B' }}>Show Calendar</Text>
                                <Fontisto name='date' size={20} color='#00634B' />
                            </>
                        )}
                    </TouchableOpacity>

                    {showCalendar ? (
                        <View style={styles.calendarContainer}>
                            <View style={styles.calendarWrapper}>
                                <Calendar
                                    style={styles.calendar}
                                    current={selectedDate || minDate}
                                    minDate={minDate}
                                    maxDate={maxDateString}
                                    monthFormat={'yyyy MM'}
                                    hideArrows={false}
                                    disableAllTouchEventsForDisabledDays={true}
                                    enableSwipeMonths={true}
                                    markedDates={markedDates} // Use the updated markedDates
                                    onDayPress={onDayPress}
                                />
                                {/* <Text>Selected Date: {selectedDate}</Text> */}
                            </View>
                        </View>
                    ) : null}

                    
                    {selectedDate ? (
                        <View>
                            <Text style={{ marginHorizontal: 15 }}>
                                Preferred Time(Optional):
                            </Text>
                            <View style={{ marginHorizontal: 15 }}>
                                <FlatList
                                data={timesArray}
                                renderItem={({item})=>(
                                    <TouchableOpacity 
                                    onPress={()=> setSelectedTime(item.time)}
                                    style={{
                                        marginRight: 10,
                                        marginVertical: 10,
                                        borderRadius: 8,
                                        padding: 15,
                                        borderColor: selectedTime === item.time ? "#00634B" : "gray",
                                        borderWidth: 1.5,
                                    }}>
                                        <Text>{item.time}</Text>
                                    </TouchableOpacity>
                                )}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    ):(null)}
                        
                        
                   

                    <Button 
                    onPress={proceedToBook}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    >Book Now</Button>
                </View>
            </Modal>
        </View>
    );
};

export default BookingModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    calendarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    calendar: {
        width: 380,
        borderRadius: 10,
    },
    button:{
        backgroundColor: '#00634B',
        width: '95%',
        borderRadius: 8,
        marginHorizontal: 'auto'
    },
    buttonText:{
        fontSize: 18,
        fontWeight: '800',
        color: 'white',
    },
    // timeSlot:{
    //     // marginHorizontal: 10,
    //     padding: 10,
    //     backgroundColor: 'green',
    //     marginHorizontal: 5,
    //     marginVertical: 10
    // }
});
