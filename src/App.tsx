import { View, Text, ImageComponent } from 'react-native'
import React, { useEffect, useState } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import Home from './screens/User/Home';
import LoginPage from './screens/loginandregister/Login';
import RegisterPage from './screens/loginandregister/Register';
import AdminScreen from './screens/Admin/AdminScreen';
import GetStarted from './screens/loginandregister/GetStarted';
import ProviderScreen from './screens/Provider/ProviderScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dropdown from './components/Dropdown';
import UpdateProfile from './components/UpdateProfile';
import UserData from './components/UserData';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomerData from './components/CustomerData';
import ProviderData from './components/ProviderData';
import AdminNav from './Navigations/AdminNav';
import ProviderNav from './Navigations/ProviderNav';
import ProfileNav from './Navigations/ProfileNav';
import CustomerNav from './Navigations/CustomerNav';
import LoginNav from './Navigations/LoginNav';
import Scheduler from './components/Scheduler';
import imagePickerComponent from './components/imagePickerComponent';
import ImageUpload from './tried/ImageUpload';
import SchedulerTime from './tried/timePicker';
import MultiSelectDD from './tried/MultiSelectDD';
import ReviewsDemo from './tried/ReviewsDemo';
import ModalDemo from './tried/Modal';
import BookingModal from './Modals/BookingModal';
import ReviewsModal from './Modals/ReviewsModal';
import ForgatPasswordScreen from './screens/ForgotPasswordScreen';
import OnHoldProviderScreen from './screens/Provider/OnHoldProviderScreen';
import ProviderTab from './Navigations/ProviderNav';
import CustomerTab from './Navigations/CustomerNav';
import StarRatingComponent from './components/StarRatingComponent';
import DeactivatedUserScreen from './screens/DeactivatedUserScreen';



const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'green',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  
  error: props => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: 'red',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'red',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};


const GetStartedNav = ()=>{
  const Stack = createNativeStackNavigator();

  return(
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: 'fade'
    }}>
      <Stack.Screen name='GetStarted' component={GetStarted}/>
      <Stack.Screen name='LoginPage' component={LoginPage}/>
        {/* <Stack.Screen name='Register' component={RegisterPage}/> */}
      <Stack.Screen name='ForgotPasswordScreen' component={ForgatPasswordScreen}/>
      <Stack.Screen name='HomePage' component={CustomerTab}/>
      <Stack.Screen name='ProviderTab' component={ProviderTab}/>
      <Stack.Screen name='OnHoldProviderScreen' component={OnHoldProviderScreen}/>
      <Stack.Screen  name='DeactivatedUser' component={DeactivatedUserScreen}/>
      <Stack.Screen name='AdminScreen' component={AdminNav}/>
      <Stack.Screen name='Register' component={RegisterPage}/>
    </Stack.Navigator>
  )
}




const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  // async function getData(){
  //   const data = await AsyncStorage.getItem('isLoggedIn');
    
  //   const userType = await AsyncStorage.getItem('role');
  //   console.log(data, 'at app.tsx');
  //   setIsLoggedIn(data);
  //   setRole(userType);
  //   console.log(isLoggedIn);
  // }

  // useEffect(()=>{
  //   getData();
  // }, []);

  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      const userType = await AsyncStorage.getItem('role');
  
      const loggedIn = data === 'true'; 
  
      console.log(data, 'at app.tsx');
      setIsLoggedIn(loggedIn); 
      setRole(userType || ''); 
    } catch (error) {
      console.error('Failed to load data from AsyncStorage:', error);
    }
  };
  
  useEffect(()=>{
    getData();
  }, []);

  let NavigationComponent;
              
  if (isLoggedIn && role === 'Admin') {
    NavigationComponent = <AdminNav />;
  } else if (isLoggedIn && role === 'ServiceProvider') {
    NavigationComponent = <ProviderTab />;
  } else if (isLoggedIn && role === 'Customer') {
    NavigationComponent = <CustomerTab />;
  } else {
    NavigationComponent = <GetStartedNav />;
    // NavigationComponent = <ImageUpload />;
    // NavigationComponent = <SchedulerTime />;
    // NavigationComponent = <MultiSelectDD />;
    // NavigationComponent = <Scheduler />;
    // NavigationComponent = <ReviewsDemo />;
    // NavigationComponent = <ModalDemo />;
    // NavigationComponent = <BookingModal />;
    // NavigationComponent = <ReviewsModal />;
    // NavigationComponent = <StarRatingComponent />;
    
  }

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        {/* {
        isLoggedIn && role === 'Admin' ? (<AdminNav/>) : (
          (isLoggedIn && role === 'ServiceProvider' ?  (<ProviderNav/> ) : (
            isLoggedIn && role === 'Customer' ?  (<CustomerNav/>):(<GetStartedNav/>)
            ))) 
            } */}
            {NavigationComponent}
            {/* <GetStartedNav/> */}
       
       <Toast config={toastConfig} />

      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App