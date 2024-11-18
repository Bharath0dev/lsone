import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Scheduler = ({ customerId, serviceId, providerId }) => {

  // console.log('customer id: ',customerId);
  // console.log('provider id: ',providerId);
  // console.log('service id: ',serviceId);

  const [selectedDate, setSelectedDate] =useState('');
  const [selectedTime, setSelectedTime] = useState([]);

  const [location, setLocation] = useState('');
  const [customerLocation, setCustomerLocation] = useState('')

  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const startDate = tomorrow;
  const endDate = new Date(tomorrow);
  endDate.setDate(endDate.getDate() + 6);

  const [timings, setTimings] = useState([]);

  // const times = [
  //   {
  //     id: "1",
  //     time: "10:00 AM",
  //   },
  //   {
  //     id: "2",
  //     time: "11:00 AM",
  //   },
  //   {
  //     id: "3",
  //     time: "12:00 PM",
  //   },
  //   {
  //     id: "4",
  //     time: "1:00 PM",
  //   },
  //   {
  //     id: "5",
  //     time: "2:00 PM",
  //   },
  //   {
  //     id: "6",
  //     time: "3:00 PM",
  //   },
  //   {
  //     id: "7",
  //     time: "4:00 PM",
  //   },
  // ];

  const navigation = useNavigation();

  const proceedToBook = async () => {
    if(!selectedDate || !selectedTime || !customerLocation){
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
    }

  console.log('customer id: ',customerId);
  console.log('provider id: ',providerId);
  console.log('service id: ',serviceId);
  console.log('scheduledDate:', selectedDate);
  console.log('scheduledTime: ', selectedTime);
  console.log('location: ', customerLocation);

  if(selectedDate && selectedTime && customerLocation){

    const bookingData = {
      customerId,
      providerId,
      serviceId,
      scheduled_Date: selectedDate,
      scheduledTime: selectedTime,
    }

    try{
      const response = await axios.post('http://192.168.1.218:4021/newBooking', bookingData)
      console.log(response.data);
      
    }catch(error){
      console.log(error);
    }

    
  }

}


const getData = async () => {
  try{
    const storedLocation = await AsyncStorage.getItem( 'location');
    if(storedLocation){
      setLocation(JSON.parse(storedLocation))
      setCustomerLocation(JSON.parse(storedLocation))

    }
  }catch(error){
    console.log(error);
  }
  console.log(location);
  console.log('customer address ',customerLocation)
  
  
}

useEffect(()=>{
  getData();
}, []);



const getTimings = async () => {
  console.log(providerId);
  console.log('date is:',selectedDate);

  const response = await axios.get('http://192.168.1.218:4021/getTimings', {params: { providerId: providerId, date: selectedDate } });
  console.log(response.data);
  // console.log(response.data[0].dates[0].time);
  setTimings(response.data.timings || []);

}

useEffect(()=>{
  if (selectedDate) {
    getTimings();
  }
},[selectedDate]);


  return (
    <View style={styles.schedulerMain}>

      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
          Enter Address
        </Text>
        <TextInput
          style={{
            // padding: 40,
            borderColor: "gray",
            borderWidth: 0.7,
            // paddingVertical: 80,
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
          itemHeight={39}
          itemRadius={10}
          // selectedItemTextStyle={styles.selectedItemTextStyle}
          // unselectedItemTextStyle={styles.selectedItemTextStyle}
          selectedItemBackgroundColor="#222831"
          unselectedItemBackgroundColor="#ececec"
          // flatListContainerStyle={styles.flatListContainerStyle}
          // onDateSelected= {(date)=>{ setSelectedDate(date.toISOString().split('T')[0]) }}
        />


      <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
        Select Time
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timings.map((time, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedTime(time)}
              style={{
                margin: 10,
                borderRadius: 7,
                padding: 15,
                borderColor: selectedTime === time ? "red" : "gray",
                borderWidth: 0.7,
              }}
            >
              <Text>{time}</Text>
            </Pressable>
          ))}
        </ScrollView>
        
      <View style={{ marginVertical: 20}}>
        <Pressable onPress={proceedToBook}>
          <Text style={{ fontSize: 17, fontWeight: "600", color: "white",  textAlign: 'center', backgroundColor: '#55be80', marginHorizontal: 'auto', padding: 10, borderRadius: 9 }}>
            Proceed to Book
          </Text>
        </Pressable>
      </View>

    </View>
  )
}

export default Scheduler

const styles = StyleSheet.create({
  schedulerMain:{
    // backgroundColor: 'green',
    // position: 'absolute',
  }
})