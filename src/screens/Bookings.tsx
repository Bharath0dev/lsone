
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import ReviewsModal from '../Modals/ReviewsModal';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const Bookings = () => {
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const [upComingBookings, setUpComingBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [flatlistData, setFlatlistData] = useState([]);
  const [activeStatusHeading, setActiveStatusHeading] = useState('all');

  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);

  const [customerId, setCustomerId] = useState('');
  const [providerId, setProviderId] = useState('');

  const [pId, setPId] = useState('');
  const [cId, setCId] = useState('');
  const [bId, setBId] = useState('');

  const separateData = (bookingData) => {
    console.log('separating...', bookingData, bookingData.length);

    const pending = [];
    const upcoming = [];

    for (let i = 0; i < bookingData.length; i++) {
      if (bookingData[i].status === 'pending') {
        pending.push(bookingData[i]);
      } else if (bookingData[i].status === 'confirmed') {
        upcoming.push(bookingData[i]);
      }
    }

    setPendingBookings(pending);
    setUpComingBookings(upcoming);
    };

  const getAsyncData = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const storedUserRole = await AsyncStorage.getItem('role');
    setUserId(storedUserId);
    setUserRole(storedUserRole);
  };

  useEffect(() => {
    getAsyncData();
  }, []);

  const getBookings = async () => {
    if (!userId) {
      console.log('User ID is not set. Skipping booking fetch.');
      return;
    }

    try {
      const response = await axios.get(`http://192.168.1.218:4021/bookingData/${userId}`);
      console.log('response.data is : ', response.data);
      console.log()
    // Extract the bookings array from the response
    const bookingsArray = response.data.bookings || [];
    setBookingData(bookingsArray);  // Set booking data to the extracted array
    separateData(bookingsArray);  // Pass the extracted array to separateData
    } catch (error) {
      console.log('booking data error: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        console.log('check check-',userId);
        getBookings();
      }
    }, [userId])
  );

  const checkCompletedDate = (date) => {
     // Ensure `date` is a Date object. If it's a string, convert it to a Date.
    const scheduledDate = new Date(date);
    const todayDate = new Date();

    // Normalize both dates to ignore time and compare only the date.
    const today = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    const scheduled = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate());

    console.log("Today's Date:", today);
    console.log("Scheduled Date:", scheduled);

    // Compare the dates.
    if (today >= scheduled) {
      return true;
    } else {
      return false;
    }
  }

  const handleResponceButton = async (bookingId, userResponse, scheduledDate, providerId, customerId, genBookingId) => {
    
    if(userResponse === 'completed'){
      const completedDateStatus = checkCompletedDate(scheduledDate);
      if(!completedDateStatus){
        return;
      }
    }
    try {
      const response = await axios.patch(`http://192.168.1.218:4021/updateBookingStatus/${bookingId}/userResponse`, {
        userResponse: userResponse,
        scheduledDate: scheduledDate,
        providerId: providerId,
        customerId: customerId,
        genBookingId: genBookingId,
      });

      getBookings();
      console.log('Status updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReviewsModalVisible = async (booking_Id, provider_Id) => {
    console.log('bookingId',booking_Id);
    console.log('provider_Id',provider_Id);
    console.log('user_Id',userId);
    setCId(userId);
    setBId(booking_Id);
    setPId(provider_Id);
    setReviewsModalVisible(true);
  }


  const handleFlatlist = (status) => {
    setActiveStatusHeading(status);
    if (status === 'confirmed') {
      setFlatlistData(upComingBookings);
    } else if (status === 'pending') {
      setFlatlistData(pendingBookings);
    } else if (status === 'all') {
      setFlatlistData(bookingData);
    }
  };

  useEffect(() => {
    // Set default to show all bookings on first load
    handleFlatlist('all');
  }, [bookingData]); // Ensure it runs when bookingData is updated

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly',height: 70,marginHorizontal: 10, alignItems: 'center' }}>

      <TouchableOpacity
          onPress={() => handleFlatlist('all')}
          // style={{ width: '33.33%' }}
          style={activeStatusHeading === 'all' ? styles.activeView : styles.deActiveView}
        >
          <View >
            <Text style={activeStatusHeading === 'all' ? styles.activeStatusHeading : styles.deActiveStatusHeading}>All</Text>
          </View>
          {/* <View style={activeStatusHeading === 'all' ? styles.activeLine : styles.deActiveLine}></View> */}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFlatlist('pending')}
          // style={{ width: '33.33%' }}
          style={activeStatusHeading === 'pending' ? styles.activeView : styles.deActiveView}
        >
          <Text style={activeStatusHeading === 'pending' ? styles.activeStatusHeading : styles.deActiveStatusHeading}>Pending</Text>
          {/* <View style={activeStatusHeading === 'pending' ? styles.activeLine : styles.deActiveLine}></View> */}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFlatlist('confirmed')}
          // style={{ width: '33.33%' }}
          style={activeStatusHeading === 'confirmed' ? styles.activeView : styles.deActiveView}
        >
          <Text style={activeStatusHeading === 'confirmed' ? styles.activeStatusHeading : styles.deActiveStatusHeading}>Up Coming</Text>
          {/* <View style={activeStatusHeading === 'confirmed' ? styles.activeLine : styles.deActiveLine}></View> */}
        </TouchableOpacity>

        
      </View>

      <View>
        <FlatList
          data={flatlistData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const { date, time } = formatDateTime(item.scheduledDate);

            return(
            <View style={styles.card}>
              {userRole === 'Customer' ? (
                <>
                <View style={{backgroundColor: 'white', borderRadius: 8, padding: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                  {/* <Text>Booking ID: {item.bookingId}</Text>
                  <Text>Provider Name: {item.providerId.name}</Text>
                  <Text>Email: {item.providerId.email}</Text>
                  <Text>Scheduled Date: {item.scheduledDate}</Text> 
                  <Text>Scheduled Date: {date}</Text>
                  <Text>Preferred Time: {item.preferredTime}</Text>
                  <Text>Status: {item.status}</Text>  */}


                  <View style={{rowGap: 8}}>
                    <Text>Booking ID: {item.bookingId}</Text>
                    <View style={{flexDirection: 'row', columnGap: 5, alignItems: 'baseline' }}>
                      <FontAwesome6 name='user-large' size={16} color='#333'/>
                      <Text style={{color: 'black', fontWeight: '400', fontSize: 18}}>{item.providerId.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', columnGap: 5, alignItems:'center'}}>
                      <MaterialIcons name='email' size={18} color= '#333'/>
                      <Text style={{color: 'black', fontWeight: '500', fontSize: 17}}>{item.providerId.email}</Text>
                    </View>
                    
                    <View style={{flexDirection: 'row', columnGap: 5, alignItems: 'center'}}>
                      <AntDesign name='calendar' size={17} color='black'/>
                      <Text style={{fontSize: 14, fontWeight: '600', color: '#333'}}>{date}</Text>
                    </View>
                    {item.preferredTime ? (
                      <View>
                        <Text>Preferred Time: {item.preferredTime}</Text>
                      </View>
                    ):(
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#333'}}>Preferred Time: </Text>
                        <Text style={{color: '#333', fontSize: 17}}>--/--</Text>
                      </View>
                    )}
                  </View>
                  
                  <View>
                    { item.status === 'pending' ? (
                      <View style={{flexDirection: 'row', alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#ff8300', fontWeight: 'bold'}}>Pending</Text>
                        <MaterialIcons name='pending' size={19} color='#ff8300'/>
                      </View>
                    ) : (
                      item.status === 'confirmed' ? (
                        <View style={{flexDirection: 'row',columnGap: 2, alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                        <Text style={{fontSize: 14, marginBottom: 2, color: '#135c02', fontWeight: 'bold'}}>Confirmed</Text>
                        <FontAwesome name='check-circle-o' size={16} color='#135c02'/>
                      </View>
                      ): (
                        item.status === 'cancelled' ? (
                          <View style={{flexDirection: 'row',columnGap: 2, alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                          <Text style={{fontSize: 14, marginBottom: 2, color: '#fe453a', fontWeight: 'bold'}}>Cancelled</Text>
                          <Entypo name='circle-with-cross' size={18} color='#fe453a'/>
                        </View>
                      ):(
                        item.status === 'declined' ? (
                          <View style={{flexDirection: 'row',columnGap: 2, alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                            <Text style={{fontSize: 14, marginBottom: 2, color: '#f91104', fontWeight: 'bold'}}>Declined</Text>
                            <Entypo name='circle-with-cross' size={18} color='#f91104'/>
                          </View>
                      ):(null)
                      ))
                    )}
                  </View>
                </View>
                  {(item.status === 'pending' || item.status === 'confirmed') ? (
                    <View>
                      <Button onPress={() => handleResponceButton(item._id, "cancelled", item.scheduledDate, item.providerId._id, userId, item.bookingId, item.serviceId)} labelStyle={styles.buttonText}>Cancel</Button>
                    </View>
                  ) : (item.status === 'completed') ? (
                    <View>
                      <Button onPress={() => handleReviewsModalVisible(item._id, item.providerId._id)} labelStyle={styles.buttonText}>Review</Button>
                    </View>):(null)}
                </>
              ) : (
                <>
                <View style={{backgroundColor: 'white', borderRadius: 8, padding: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{rowGap: 8}}>
                    <Text>Booking ID: {item.bookingId}</Text>
                    <View style={{flexDirection: 'row', columnGap: 5, alignItems: 'baseline' }}>
                      <FontAwesome6 name='user-large' size={16} color='#333'/>
                      <Text style={{color: 'black', fontWeight: '400', fontSize: 18}}>{item.customerId.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row', columnGap: 5, alignItems:'center'}}>
                      <MaterialIcons name='email' size={18} color= '#333'/>
                      <Text style={{color: 'black', fontWeight: '500', fontSize: 17}}>{item.customerId.email}</Text>
                    </View>
                    
                    <View style={{flexDirection: 'row', columnGap: 5, alignItems: 'center'}}>
                      <AntDesign name='calendar' size={17} color='black'/>
                      <Text style={{fontSize: 14, fontWeight: '600', color: '#333'}}>{date}</Text>
                    </View>
                    {item.preferredTime ? (
                      <View>
                        <Text>Preferred Time: {item.preferredTime}</Text>
                      </View>
                    ):(
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#333'}}>Preferred Time: </Text>
                        <Text style={{color: '#333', fontSize: 17}}>--/--</Text>
                      </View>
                    )}
                  </View>
                  
                  <View>
                    { item.status === 'pending' ? (
                      <View style={{flexDirection: 'row', alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                        <Text style={{fontSize: 14, marginBottom: 5, color: '#ff8300', fontWeight: 'bold'}}>Pending</Text>
                        <MaterialIcons name='pending' size={19} color='#ff8300'/>
                      </View>
                    ) : (
                      item.status === 'confirmed' ? (
                        <View style={{flexDirection: 'row',columnGap: 2, alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                        <Text style={{fontSize: 14, marginBottom: 2, color: '#135c02', fontWeight: 'bold'}}>Confirmed</Text>
                        <FontAwesome name='check-circle-o' size={16} color='#135c02'/>
                      </View>
                      ): (
                        item.status === 'cancelled' ? (
                          <View style={{flexDirection: 'row',columnGap: 2, alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                          <Text style={{fontSize: 14, marginBottom: 2, color: '#fe453a', fontWeight: 'bold'}}>Cancelled</Text>
                          <Entypo name='circle-with-cross' size={18} color='#fe453a'/>
                        </View>
                      ):(
                        item.status === 'declined' ? (
                          <View style={{flexDirection: 'row',columnGap: 2, alignItems: 'center', borderRadius: 15, padding: 3,paddingBottom: 1, borderColor:'#055240', borderWidth: 1.5 }}>
                            <Text style={{fontSize: 14, marginBottom: 2, color: '#f91104', fontWeight: 'bold'}}>Declined</Text>
                            <Entypo name='circle-with-cross' size={18} color='#f91104'/>
                          </View>
                      ):(null)
                      ))
                    )}
                    
                  </View>
                  
                </View>
                  
                  {item.status === 'pending' ? (
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                      <Button onPress={() => handleResponceButton(item._id, "confirmed", item.scheduledDate, userId, item.customerId._id, item.bookingId, item.serviceId)} labelStyle={styles.buttonText}>Accept</Button>
                      <Text style={{color: 'white', fontSize: 22, textAlignVertical: 'center'}}>|</Text>
                      <Button onPress={() => handleResponceButton(item._id, "declined", item.scheduledDate, userId, item.customerId._id, item.bookingId, item.serviceId)} labelStyle={styles.buttonText}>Decline</Button>
                    </View>
                  ) : item.status === 'confirmed' ? (
                    <View>
                      <Button onPress={() => handleResponceButton(item._id, "completed", item.scheduledDate, userId, item.customerId._id, item.bookingId, item.serviceId)} labelStyle={styles.buttonText}>Completed</Button>
                    </View>
                  ) : null}
                </>
              )}
            </View>
          )}}
          ListEmptyComponent={<Text style={{ justifyContent: 'center', textAlign: 'center' }}>No bookings found.</Text>}
          contentContainerStyle={{
            paddingBottom: 65
          }}
        />
      </View>

      <ReviewsModal
      visible={reviewsModalVisible}
      onClose={() => setReviewsModalVisible(false)}
      customerId={cId} bookingId={bId} providerId={pId}
      />
    </View>
  );
};


export default Bookings;

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  card: {
    backgroundColor: '#055240',
    margin: 10,
    elevation: 4,
    paddingHorizontal: 3,
    paddingVertical: 3,
    borderRadius: 8
  },
  activeView:{
    height: 45,
    backgroundColor: '#055240',
    justifyContent: 'center',
    borderRadius: 20,
    width: '33.33%',
  },
  deActiveView:{
    height: 45,
    justifyContent: 'center',
    borderRadius: 20,
    width: '33.33%',
  },
  activeStatusHeading: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    justifyContent: 'center',
    textAlign: 'center'
  },
  deActiveStatusHeading:{
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    justifyContent: 'center',
    textAlign: 'center'
  },
  // activeLine: {
  //   borderColor: 'red',
  //   borderWidth: 0.5,
  //   marginTop: 8
  // },
  // deActiveLine: {
  //   borderColor: 'white',
  //   borderWidth: 0.5,
  //   marginTop: 8
  // },
  buttonText:{
    color: 'white',
    fontWeight: '700',
  }
  
});
