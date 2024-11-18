import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SchedulerTime = ({ customerId, serviceId, providerId }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [location, setLocation] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startDate = tomorrow;
  const endDate = new Date(tomorrow);
  endDate.setDate(endDate.getDate() + 6);

  // Updated times array with an extra time slot
  const times = [
    { id: "1", time: "10:00 AM" },
    { id: "2", time: "11:00 AM" },
    { id: "3", time: "12:00 PM" },
    { id: "4", time: "1:00 PM" },
    { id: "5", time: "2:00 PM" },
    { id: "6", time: "3:00 PM" },
    { id: "7", time: "4:00 PM" },
    { id: "8", time: "5:00 PM" }, // Added extra time slot
  ];

  const navigation = useNavigation();

  const proceedToBook = async () => {
    if (!selectedDate || !fromTime || !toTime || !customerLocation) {
      Alert.alert(
        "Empty or invalid",
        "Please select all the fields",
        [{ text: "Cancel", style: "cancel" }, { text: "OK" }],
        { cancelable: false }
      );
      return; // Exit the function early
    }

    console.log('customer id: ', customerId);
    console.log('provider id: ', providerId);
    console.log('service id: ', serviceId);
    console.log('scheduledDate:', selectedDate);
    console.log('fromTime: ', fromTime);
    console.log('toTime: ', toTime);
    console.log('location: ', customerLocation);

    const bookingData = {
      customerId,
      providerId,
      serviceId,
      scheduled_Date: selectedDate,
      fromTime,
      toTime,
    };

    try {
      const response = await axios.post('http://192.168.1.218:4021/newBooking', bookingData);
      console.log(response.data);
      // Optionally navigate or show success message
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('location');
      if (storedLocation) {
        const locationData = JSON.parse(storedLocation);
        setLocation(locationData);
        setCustomerLocation(locationData); // Assuming location is an object with address, city, zip
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
        Enter Address
      </Text>
      <TextInput
        style={{
          borderColor: "gray",
          borderWidth: 0.7,
          borderRadius: 9,
          margin: 10,
          height: 70,
          fontSize: 16,
        }}
        defaultValue={`${location.address}, ${location.city}, ${location.zip}`}
        multiline={true}
        numberOfLines={3}
        onChangeText={text => setCustomerLocation(text)}
      />

      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
        Pick Up Date
      </Text>

      <HorizontalDatepicker
        mode="gregorian"
        startDate={startDate}
        endDate={endDate}
        initialSelectedDate={startDate}
        onSelectedDateChange={(date) => setSelectedDate(date.toISOString().split('T')[0])}
        selectedItemWidth={140}
        unselectedItemWidth={38}
        itemHeight={38}
        itemRadius={10}
        selectedItemBackgroundColor="#222831"
        unselectedItemBackgroundColor="#ececec"
      />

      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
        Select Time
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
        From Time
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {times.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              setFromTime(item.time);
              setToTime(''); // Reset toTime when fromTime is selected
            }}
            style={{
              margin: 10,
              borderRadius: 7,
              padding: 15,
              borderColor: fromTime === item.time ? "red" : "gray",
              borderWidth: 0.7,
            }}
          >
            <Text>{item.time}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
        To Time
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {times.filter(item => item.time > fromTime).map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setToTime(item.time)}
            style={{
              margin: 10,
              borderRadius: 7,
              padding: 15,
              borderColor: toTime === item.time ? "red" : "gray",
              borderWidth: 0.7,
            }}
          >
            <Text>{item.time}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ marginVertical: 20 }}>
        <Pressable onPress={proceedToBook}>
          <Text style={{ fontSize: 17, fontWeight: "600", color: "white", textAlign: 'center', backgroundColor: '#55be80', marginHorizontal: 'auto', padding: 10, borderRadius: 9 }}>
            Proceed to Book
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SchedulerTime;

const styles = StyleSheet.create({});
