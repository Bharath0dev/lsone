import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from 'react-native-paper'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { MultiSelect } from 'react-native-element-dropdown'
import MultiSelectComponent from '../../tried/MultiSelectDD';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Positions } from 'react-native-calendars/src/expandableCalendar';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const ProviderScreen = () => {
  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState('');

  const [userNotifications, setUserNotifications] = useState([]);
  const [isReadStatus, setIsReadStatus] = useState(true);

  const [alertShown, setAlertShown] = useState(false);

  const [servicesCount, setServicesCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [upcomingTasksCount, setUpcomingTasksCount] = useState(0);
  const [unAvailableDatesCount, setUnAvailableDatesCount] = useState(0);

  const navigation = useNavigation();

  const getAsyncData = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    console.log(token);
    console.log("user Id ", userId);
    setUserId(userId);
  }

  useEffect(()=>{
    getAsyncData();
  }, []);

  const  getData = async () =>{
    const token = await AsyncStorage.getItem('token');
    console.log("token in Homepage : ",token);

    console.log(token);

    const res = await axios.post('http://192.168.1.218:4021/userdata', {token: token})
        console.log('user data in provider screen',res.data);
        setUserData(res.data.data);
  }

  const getCountforProviderScreen = async () => {
    try{
      const response = await axios.get('http://192.168.1.218:4021/getCountforProviderScreen', { params: {userId: userId}});
      console.log('getCountforProviderScreen-',response.data);

      setUpcomingTasksCount(response.data.upComingTasksCount);
      setPendingRequestsCount(response.data.pendingRequestsCount);
      setServicesCount(response.data.matchingServiceProviderCount);
      setUnAvailableDatesCount(response.data.unAvailableDatesCount);
    }catch(error){
      console.log('error while getting counts-', error);
    }
  }

  useEffect(() => {
    getData();
   }, []);

   useEffect(()=>{
    Toast.show({
      type: 'success',
      text1: 'welcome',
      text2: 'Logged in',
      visibilityTime: 3000
    })
  }, []);

   useEffect(() => {
    if (userData && (userData.address === "" || userData.address === null)) {
      if (!alertShown) {
        navigation.navigate('Profile')
        Alert.alert('Error', 'Please add your address');
        setAlertShown(true); // Set to true to prevent repeated alerts
      }
    }
  }, [userData]);

   useEffect(()=>{
    console.log('userData to navigate to hold screen', userData.accountStatus);
    if(userData && userData.accountStatus === 'inactive'){
      navigation.navigate('OnHoldProviderScreen', {email: userData.email});
    }
   })


   const providerBookingData = async () => {
    const response = await axios.get(`http://192.168.1.218:4021/bookingData/${userId}`)
    console.log('providerbookingData is:',response.data);

    const counts = response.data.count;
        console.log('Counts:', counts);
   }
   useEffect(() => {
    providerBookingData();
   }, [userId]);

   function handleLogout(){
    try{
      AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
      AsyncStorage.setItem('token', '');
      
    // navigation.navigate('LoginPro');
      navigation.dispatch(
        CommonActions.reset({
          index: 0, 
          routes: [{ name: 'LoginPage' }], 
        })
      );

    }catch (error) {
      console.error("Failed to sign out:", error);
    }
  }
  
 
  

  const getNotifications = async () => {
    try {
        const response = await axios.get('http://192.168.1.218:4021/getNotifications', { params: { userId } });
        console.log('Response from backend:', response.data);
        setUserNotifications(response.data.result)
        setIsReadStatus(response.data.isReadStatus);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};


useFocusEffect(
  useCallback(() => {
  if (userId) {
      getNotifications();
      getCountforProviderScreen();
  } else {
      console.log('userId is not set yet');
  }
}, [userId]));

const handleNotificationNavigation = ()=>{
  navigation.navigate('NotificationScreenPro', {userNotifications: userNotifications, userId: userId})
}

  return (
    <View style={styles.pageContainer}>  
      <View style={styles.notificationBar}>

        <View style={styles.topIcons}>
              <TouchableOpacity onPress={()=>handleNotificationNavigation()}>
                  <Ionicons
                      name='notifications' 
                      // color='#52be80' 
                      color = '#00634B'
                      size={25} 
                      style={{margin: 8}}
                      /> 
                    {isReadStatus ? (
                      <Entypo 
                        name='dot-single'
                        color='red'
                        size={30}
                        style={styles.notificationDot}
                        />   ):(null)}
                       
              </TouchableOpacity>
          
              <TouchableOpacity onPress={handleLogout}>
                  <FontAwesome
                      name='sign-out' 
                      // color='#52be80' 
                      color = '#00634B'
                      size={25}
                      style={{margin: 8}}
                      />
              </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 3, marginTop: -15}}>

            <View style={{}}>
                <Image 
                  style={styles.profileImage} 
                  source={userData.profileImage
                    ? { uri: `http://192.168.1.218:4021/${userData.profileImage}` } 
                    : require('../../assets/userProfilePic.png')} 
                />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginHorizontal: 10}}>
                <Text style={styles.greet}>Hi,</Text>
                <Text>{' '}</Text>
                <Text style={styles.userName}>{userData.name}</Text> 
            </View>

          </View>
    
      </View>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{backgroundColor: 'green', width: '50%'}}>
            <Text>upcomingTasksCount: {upcomingTasksCount}</Text>
          </View>
          <View style={{backgroundColor: 'red', width: '50%'}}>
            <Text>pendingRequestsCount: {pendingRequestsCount}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{backgroundColor: 'blue', width: '50%'}}>
            <Text>servicesCount: {servicesCount}</Text>
          </View>
          <View>

          </View>
        </View> */}


<View style={styles.countBoxesContainer}>
        <View style={styles.countBoxesServicesAndBookings}>
          <TouchableOpacity style={[styles.box, { backgroundColor: '#ffe7da', width: '100%', height: 155, borderRadius: 10, padding: 10 }]}
            onPress={()=> navigation.navigate('Bookings')}>

              {upcomingTasksCount <10 ? (
                <Text style={[styles.count, { color: '#4f020a' }]}>0{upcomingTasksCount}</Text>
              ):(
                <Text style={[styles.count, { color: '#4f020a' }]}>{upcomingTasksCount}</Text>
              )}

              <Text style={[styles.text, { color: '#4f020a' }]}>Up Coming Tasks</Text>
              
          </TouchableOpacity>

          <TouchableOpacity style={[styles.box, { backgroundColor: '#d0f2fe', width: '100%', height: 155, borderRadius: 10, padding: 10 }]}
              onPress={()=> navigation.navigate('Bookings')}>

              {pendingRequestsCount <10 ? (
                <Text style={[styles.count, { color: '#314393' }]}>0{pendingRequestsCount}</Text>
              ):(
                <Text style={[styles.count, { color: '#314393' }]}>{pendingRequestsCount}</Text>
              )}
              <Text style={[styles.text, { color: '#314393' }]}>Pending Requests</Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.countBoxesProvidersAndCustomers}>

          <TouchableOpacity style={[ styles.box, { backgroundColor: '#c9facd' } ]}
            onPress={()=> navigation.navigate('servicesPro')}>

            {servicesCount <10 ? (
              <Text style={[styles.count, { color: '#1a8057' }]}>0{servicesCount}</Text>
            ):(
              <Text style={[styles.count, { color: '#1a8057' }]}>{servicesCount}</Text>
            )}
            <Text style={[styles.text, { color: '#1a8057' }]}>Opted Services</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.box, { backgroundColor: '#fff8ce' }]}
            onPress={()=> navigation.navigate('Avalability')}>

            {unAvailableDatesCount <10 ? (
              <Text style={[styles.count, { color: '#9c690e' }]}>0{unAvailableDatesCount}</Text>
            ):(
              <Text style={[styles.count, { color: '#9c690e' }]}>{unAvailableDatesCount}</Text>
            )}
            <Text style={[styles.text, { color: '#9c690e' }]}>My Unavailable Dates</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.countBoxesProvidersAndCustomers}>

          

        </View>

      </View>
      </View>
   )
 }

 const styles = StyleSheet.create({
  pageContainer:{
    backgroundColor: 'white',
    flex: 1,
  },
  profileImage:{
    height: 40,
    width: 40,
    borderRadius: 100,
    borderColor: '#00634B',
    borderWidth: 1
  },
  userName:{
    fontSize: 21,
    fontWeight: '600',
    color: '#212121',
  },
  greet:{
    fontSize: 18,
    fontWeight: '600',

  },
  notificationBar:{
    height: 75,
    marginHorizontal: 5,
  },
  topIcons:{
      flexDirection: 'row',
      justifyContent: 'flex-end'
  },
  notificationDot:{
    position: 'absolute',
    // alignContent: 'flex-end',
    // justifyContent: 'flex-end',
    top: -2,
    right: 1
  },
  countBoxesContainer:{
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  countBoxesServicesAndBookings:{
    // flexDirection: 'row',
    // columnGap: 10,
    rowGap: 10,
    width: '90%',
    // justifyContent: 'space-evenly',
    marginVertical: 5
  },
  countBoxesProvidersAndCustomers:{
    flexDirection: 'row',
    columnGap: 10,
    width: '90%',
    justifyContent: 'space-evenly',
    marginVertical: 5,
  },
  box:{
    width: 180, height: 155, borderRadius: 10, padding: 10
  },
  count:{
    fontSize: 50,
  },
  text:{
    fontWeight: 'bold',
  }
  });

export default ProviderScreen







