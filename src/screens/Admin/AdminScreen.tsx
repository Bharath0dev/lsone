import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, BackHandler, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button } from 'react-native-paper';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import ServicesScreen from '../../components/Services';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';


const AdminScreen = () => {



  const [inactiveUsersCount,setInactiveUsersCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [providersCount, setProvidersCount] = useState(0);
  const [customerCount,setCustomerCount] = useState(0);
  const [bookingsCount,setBookingsCount] = useState(0);


  const getServices = async () => {

    try {
        const response = await axios.get('http://192.168.1.218:4021/get-services-ad');
        console.log('getServices',response.data.count);
        setServicesCount(response.data.count);
    } catch (error) {
        console.error('Error fetching services:', error);
    }
};


useFocusEffect(
  useCallback(() => {
      getServices();
  },[])
)


  const getRegistrationRequests = async () => {
  
      try{
          const response = await axios.get('http://192.168.1.218:4021/getRegistrationRequests');  
          setInactiveUsersCount(response.data.count);
      }catch(error){
          console.log('error while getting registration requests-', error);
      }
  }

  async function getProviderCount(){
    const role = 'ServiceProvider';

    try{
        const response = await axios.get('http://192.168.1.218:4021/getProviderData', { params: { role }})
        setProvidersCount(response.data.count);
    }catch(error){
        console.log(error)
    }
  }

  const getBookingCount = async () => {
    try {
      const response = await axios.get(`http://192.168.1.218:4021/getBookingCount`);
      console.log('bookings count is : ', response.data.count);
      setBookingsCount(response.data.count);  
    } catch (error) {
      console.log('booking data error: ', error);
    }
  };

const getCustomerCount = async() => {
  const role = 'Customer';
    try{
        const response = await axios.get('http://192.168.1.218:4021/get-user-data', { params: { role }})
        setCustomerCount(response.data.count);
    }catch(error){
        console.log(error)
    }
  }
  

  useFocusEffect(
      useCallback(()=>{
          getRegistrationRequests();
          getProviderCount();
          getBookingCount();
          getCustomerCount();
      }, [])
  )

  
  useEffect(()=>{
    Toast.show({
      type: 'success',
      text1: 'welcome',
      text2: 'Logged in',
      visibilityTime: 3000
    })
  }, []);

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    },[]),
  );

  const navigation = useNavigation();

  function handleLogout(){
    try{
      AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
      AsyncStorage.setItem('token', '');
      
    // navigation.navigate('LoginAd');
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

  return (

    <View style={styles.main}>
      <View style={styles.topIcons}>          
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
      <View style={styles.countBoxesContainer}>
        <View style={styles.countBoxesServicesAndBookings}>

          <TouchableOpacity style={[styles.box, { backgroundColor: '#c9facd' }]}
            onPress={()=> navigation.navigate('TotalServices')}>

            {servicesCount <10 ? (
              <Text style={[styles.count, { color: '#1a8057' }]}>0{servicesCount}</Text>
            ):(
              <Text style={[styles.count, { color: '#1a8057' }]}>{servicesCount}</Text>
            )}

            <Text style={[styles.text, { color: '#1a8057' }]}>Total Services</Text>
            
          
          </TouchableOpacity>

          <TouchableOpacity style={[styles.box, { backgroundColor: '#d0f2fe' }]}
            onPress={()=> navigation.navigate('TotalServices')}>

            {bookingsCount <10 ? (
              <Text style={[styles.count, { color: '#314393' }]}>0{bookingsCount}</Text>
            ):(
              <Text style={[styles.count, { color: '#314393' }]}>{bookingsCount}</Text>
            )}

            <Text style={[styles.text, { color: '#314393' }]}>Total Bookings</Text>
            
          
          </TouchableOpacity>
        </View>
        <View style={styles.countBoxesProvidersAndCustomers}>
          <TouchableOpacity style={[styles.box, { backgroundColor: '#ffe7da' }]}
            onPress={()=> navigation.navigate('RegistrationRequestsScreen')}>

              {inactiveUsersCount <10 ? (
                <Text style={[styles.count, { color: '#4f020a' }]}>0{inactiveUsersCount}</Text>
              ):(
                <Text style={[styles.count, { color: '#4f020a' }]}>{inactiveUsersCount}</Text>
              )}

              <Text style={[styles.text, { color: '#4f020a' }]}>New Registration Requests</Text>
              
          </TouchableOpacity>

          

          <TouchableOpacity style={[styles.box, { backgroundColor: '#fff8ce' }]}
            onPress={()=> navigation.navigate('ProviderData')}>

              {providersCount <10 ? (
                <Text style={[styles.count, { color: '#9c690e' }]}>0{providersCount}</Text>
              ):(
                <Text style={[styles.count, { color: '#9c690e' }]}>{providersCount}</Text>
              )}
              <Text style={[styles.text, { color: '#9c690e' }]}>Total Providers</Text>
              
          </TouchableOpacity>

        </View>

        <View style={styles.countBoxesProvidersAndCustomers}>
          <TouchableOpacity style={[styles.box, { backgroundColor: '#fadfe8' }]}
            onPress={()=> navigation.navigate('CustomerData')}>

              {customerCount <10 ? (
                <Text style={[styles.count, { color: '#900c37' }]}>0{customerCount}</Text>
              ):(
                <Text style={[styles.count, { color: '#900c37' }]}>{customerCount}</Text>
              )}

              <Text style={[styles.text, { color: '#900c37' }]}>Total Customers</Text>
              
          </TouchableOpacity>
          <View style={[styles.box]}>

          </View>
        </View>
      </View>
      {/* <View style={styles.servicesView}>
        <ServicesScreen/>
      </View> */}
      
    </View>

  )
}

const styles = StyleSheet.create({
  main:{
    flex:1,
    backgroundColor: 'white',
  },
  servicesView:{
    // flex:1
  },
  topIcons:{
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  countBoxesContainer:{
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  countBoxesServicesAndBookings:{
    flexDirection: 'row',
    columnGap: 10,
    width: '90%',
    justifyContent: 'space-evenly',
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
  
})

export default AdminScreen