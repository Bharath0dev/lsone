import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const NotificationsScreen = ({route}) => {

  const userId = route.params.userId;
  console.log('userId in notification screen-',userId);
  const [userNotifications, setUserNotifications] = useState([]);

   useEffect(() => {
    // Only set state when the component is mounted or the notifications change
    if (route.params?.userNotifications) {
      setUserNotifications(route.params.userNotifications);
      console.log(route.params.userNotifications)
      updateIsReadStatus();
    }
  }, [route.params?.userNotifications]);
  

const updateIsReadStatus = async () => {
  const response = await axios.patch('http://192.168.1.218:4021/updateIsReadStatus', {userId: userId});
  console.log(response.data);
}


// Function to format the date and time from the createdAt field
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp); 
  
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);

  const dateString = date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });

  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return { date: dateString, time: timeString };
};


  return (
    <View style={styles.pageContainer}>
      <View>
        <FlatList
        data={userNotifications}
        renderItem={({item})=>{
          const { date, time } = formatDateTime(item.createdAt);
          return (
            <View style={styles.flatlistView}>
              { item.heading === 'Booking Cancelled' ? (
                <Text style={[styles.notificationHeading,{color: 'red'}]}>{item.heading}</Text>
              ) : (
                item.heading === 'Booking Confirmed' ? (
                  <Text style={[styles.notificationHeading,{color: 'green'}]}>{item.heading}</Text>
                ) : (
                  item.heading === 'New Booking' ? (
                    <Text style={[styles.notificationHeading,{color: 'orange'}]}>{item.heading}</Text>
                  ) : (
                    item.heading === 'Booking Completed' ? (
                      <Text style={[styles.notificationHeading,{color: 'blue'}]}>{item.heading}</Text>
                    ) : (null)
                  )
                )
              ) }
              
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationTime}>{date} at {time}</Text> 
            </View>
          );
        }}/>
      </View>
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  pageContainer:{
    flex:1,
    backgroundColor: 'white',
  },
  flatlistView:{
    backgroundColor: 'white',
    margin: 10,
    elevation: 4,
    borderRadius: 8,
    padding: 10,
  },
  notificationHeading:{
    fontSize: 17,
    marginVertical: 2
  },
  notificationMessage:{
    fontSize: 14,
    color: 'black',
    marginVertical: 4,
  },
  notificationTime:{
    fontSize: 12,
    marginVertical: 2,
  }
})