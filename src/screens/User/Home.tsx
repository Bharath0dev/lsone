import { Alert, BackHandler, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import UserHomeScreen from '../../components/UserHomeScreen'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import CategoryCards from '../../components/CategoryCards';
import Carousel from '../../components/Carousel';
import SearchBar  from '../../components/SearchBar';


const Home = () => {

  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState('');
  const [alertShown, setAlertShown] = useState(false);

  const [cleaningServices, setCleaningServices] = useState('');
  const [mountingServices, setMountingServices] = useState('');
  const [repairingServices, setRepairingServices] = useState('');

  const [userNotifications, setUserNotifications] = useState([]);
  const [isReadStatus, setIsReadStatus] = useState(true);


  const navigation = useNavigation();
  const baseURL = 'http://192.168.1.218:4021/';

  const getToken = async () => {
    const tokenFromStorage = await AsyncStorage.getItem('token');
    console.log("token in Homepage : ",tokenFromStorage);
    setToken(tokenFromStorage);
    console.log(tokenFromStorage);
  }

  useEffect(()=>{
    getToken();
  }, [])

  const  getData = async () =>{
    const res = await axios.post('http://192.168.1.218:4021/userdata', {token: token})
        console.log(res.data);
        setUserData(res.data.data);
        setUserId(res.data.data._id);
        await setData(res.data.data);
        // if (res.data && res.data.data) {
        //   setUserData(res.data.data);
        //   setUserId(res.data.data._id);
        //   await setData(res.data.data);
        // }
  }

  const getAsyncData = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setUserId(userId);
  }

  async function setData(userData) {
    if (userData && userData.name && userData.location) {
      await AsyncStorage.setItem('userName', userData.name);
      await AsyncStorage.setItem('location', JSON.stringify(userData.address));
      await AsyncStorage.setItem('role', userData.role)

      console.log(userData.name); 
      console.log(userData.location); 
    } else {
      console.log('userData is not available or does not have a name');
    }
  }
  
  useEffect(()=>{
    getData();
  }, [token])
  
  const getCleaningServices = async ()=>{
    const category = "Cleaning";

    const response = await axios.get('http://192.168.1.218:4021/get-services', { params: { category }})
    console.log(response.data);
    setCleaningServices(response.data.data);
  }

  const getMountingServices = async ()=>{
    const category = "Mounting and Installation";

    const response = await axios.get('http://192.168.1.218:4021/get-services', { params: { category }})
    console.log(response.data);
    setMountingServices(response.data.data);
  }

  const getRepairingServices = async ()=>{
    const category = "Repair Services";

    const response = await axios.get('http://192.168.1.218:4021/get-services', { params: { category }})
    console.log(response.data);
    setRepairingServices(response.data.data);
  }

useEffect(()=>{
  getAsyncData();
  getCleaningServices();
  getMountingServices();
  getRepairingServices();
},[])

useEffect(()=>{
  Toast.show({
    type: 'success',
    text1: 'welcome',
    text2: 'Logged in',
    visibilityTime: 3000
  })
}, []);

  // useEffect(() => {
  //   // console.log(userData.location.zip)
  //   if (userData && (userData.address === "" || userData.address === null)) {
  //     if (!alertShown) {
  //       navigation.navigate('Profile')
  //       Alert.alert('Error', 'Please add your address');
  //       setAlertShown(true); // Set to true to prevent repeated alerts
  //     }
  //   }
  // }, [userData]);


  function handleLogout(){
    try{
      AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
      AsyncStorage.setItem('token', '');
      
    // navigation.navigate('LoginC');
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

  const handleNotificationNavigation = () => {
    navigation.navigate('NotificationScreen', {userNotifications: userNotifications, userId: userId})
  }

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
      console.log('kya userId-',userId);
        getNotifications();
    } else {
        console.log('userId is not set yet');
    }
  }, [userId]));

  return (
    <ScrollView>
    <View style={styles.container}>

        <View style={styles.notificationBar}>

        <View style={styles.topIcons}>
              <TouchableOpacity  
              style={styles.notificationIcon}
              onPress={()=> handleNotificationNavigation()}
              >
                  <Ionicons
                      name='notifications' 
                      // color='#52be80' 
                      color = '#055240'
                      size={25} 
                      style={{margin: 8}}
                      /> 
                      {isReadStatus ? ( 
                        <Entypo 
                          name='dot-single'
                          color='red'
                          size={30}
                          style={styles.notificationDot}
                        />
                        ):(null)}
              </TouchableOpacity>
          
              <TouchableOpacity onPress={handleLogout}>
                  <FontAwesome
                      name='sign-out' 
                      // color='#52be80' 
                      color = '#055240'
                      // color = '#00634B'
                      size={25}
                      style={{margin: 8}}
                      />
              </TouchableOpacity>
          </View>

          
          <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 3, position: 'absolute', top: 25,}}>

            <View style={{}}>
                <Image 
                  style={styles.profileImage} 
                  source={userData && userData.profileImage
                    ? { uri: `http://192.168.1.218:4021/${userData.profileImage}` } 
                    : require('../../assets/userProfilePic.png')} 
                />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginHorizontal: 10}}>
                <Text style={styles.greet}>Hi,</Text>
                <Text>{' '}</Text>
                {/* <Text style={styles.userName}>{userData.name}</Text>  */}
                <Text style={styles.userName}>{userData && userData.name ? userData.name : ''}</Text>

            </View>

          </View>
        </View>

      <View>
        {/* <UserHomeScreen/> */}
        <View style={styles.topTextView}>
                <Text style={styles.topText}>
                    What are you looking for
                </Text>
            </View>
            <TouchableOpacity 
            style={styles.searchBar}
            onPress={ ()=> navigation.navigate('searchScreen') }
            >
                <SearchBar/>
            </TouchableOpacity>
            <View style={styles.sliderMain}>
              <Carousel />
            </View>
            <View style={styles.catgoriesMain}>
                <Text style={styles.catgoriesHeader}>Categories</Text>
                <View>
                  <CategoryCards/>
                </View>
        </View>
      </View>
      
      <View>
        <View>
            <Text style={styles.serviceHeading}>Cleaning Services</Text>
        </View>
        <View style={styles.servicesContainer}>
            <FlatList
            horizontal
            data={cleaningServices}
            keyExtractor={(item) => item._id}
            renderItem={({item})=>(
              <TouchableOpacity 
              style={styles.flatlistContainer}
              onPress={()=>{navigation.navigate('ServiceProviders', {serviceId: item._id, serviceName: item.serviceName})}}
              >
                
                <Image source={ {uri: baseURL + item.serviceImage}}
                style={styles.serviceImage}
                onError={() => console.log('Image load error')}
                />
                <Text style={styles.serviceName}>{item.serviceName}</Text>

              </TouchableOpacity>
            )}/>
        </View>
      </View>

      <View>
        <View>
            <Text style={styles.serviceHeading}>Mounting & Installation Services</Text>
        </View>
        <View style={styles.servicesContainer}>
            <FlatList
            horizontal
            data={mountingServices}
            keyExtractor={(item) => item._id}
            renderItem={({item})=>(
              <TouchableOpacity 
              style={styles.flatlistContainer}
              onPress={()=>{navigation.navigate('ServiceProviders', {serviceId: item._id, serviceName: item.serviceName})}}
              >
                
                <Image source={ {uri: baseURL + item.serviceImage}}
                style={styles.serviceImage}
                onError={() => console.log('Image load error')}
                />
                <Text style={styles.serviceName}>{item.serviceName}</Text>

              </TouchableOpacity>
            )}/>
        </View>
      </View>

      <View>
        <View>
            <Text style={styles.serviceHeading}>Repairing Services</Text>
        </View>
        <View style={styles.servicesContainer}>
            <FlatList
            horizontal
            data={repairingServices}
            keyExtractor={(item) => item._id}
            renderItem={({item})=>(
              <TouchableOpacity 
              style={styles.flatlistContainer}
              onPress={()=>{navigation.navigate('ServiceProviders', {serviceId: item._id, serviceName: item.serviceName})}}
              >
                
                <Image source={ {uri: baseURL + item.serviceImage}}
                style={styles.serviceImage}
                onError={() => console.log('Image load error')}
                />
                <Text style={styles.serviceName} numberOfLines={3}>{item.serviceName}</Text>

              </TouchableOpacity>
            )}/>
        </View>
      </View>
    </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#f1fafa',
    backgroundColor: 'white',
  },
  notificationBar:{
    // backgroundColor: 'green',
    height: 70,
    // flexDirection: 'row',
    // alignItems:'center',
    marginHorizontal: 5,
    // justifyContent: 'space-between',
  },
  topIcons:{
      flexDirection: 'row',
      justifyContent: 'flex-end'
  },
  serviceHeading:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#055240',
    marginHorizontal: 10
  },
  servicesContainer:{
    
  },
  topTextView:{
    // height: 100,
    marginVertical: 10
},
topText:{
    fontSize:36,
    fontWeight: '600',
    marginHorizontal: 12,
},
searchBar:{
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
},
sliderMain:{
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
},
catgoriesMain:{
    height: 270,
    marginBottom: 10
},
catgoriesHeader:{
    fontSize: 18,
    color: '#00634B',
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 12
},
  flatlistContainer:{
    rowGap: 8,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'black',
    // borderWidth: 1
  },
  serviceImage:{
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  serviceName:{
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    width: 110
  },
  profileImage:{
    height: 40,
    width: 40,
    borderRadius: 100,
    borderColor: '#055240',
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
  notificationIcon:{},
  notificationDot:{
    position: 'absolute',
    top: -2,
    right: 1,
  }
})