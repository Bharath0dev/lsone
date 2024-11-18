import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Home from '../screens/User/Home';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProfileNav from './ProfileNav';
import SearchScreen from '../screens/SearchScreen';
import LoginNav from './LoginNav';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServicesScreen from '../screens/ServicesScreen';
import ServiceProviders from '../screens/ServiceProviders';
import Categories from '../screens/Categories';
import Bookings from '../screens/Bookings';
import ProviderDetailsScreen from '../screens/ProviderDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LoginPage from '../screens/loginandregister/Login';
import DeactivatedUserScreen from '../screens/DeactivatedUserScreen';


const CustomerStack = ()=>{
  const Stack = createNativeStackNavigator();

  return(
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='HomePage' component={Home}/>
      <Stack.Screen name='ServicesScreen' component={ServicesScreen}/>
      <Stack.Screen name='ServiceProviders' component={ServiceProviders}/>
      <Stack.Screen name='categories' component={Categories}/>
      <Stack.Screen name='searchScreen' component={SearchScreen}/>
      <Stack.Screen name='ProviderDetailsScreen' component={ProviderDetailsScreen}/>
      <Stack.Screen  name='NotificationScreen' component={NotificationsScreen}/>
      <Stack.Screen  name='DeactivatedCustomer' component={DeactivatedUserScreen}/>
      {/* <Stack.Screen name='LoginC' component={LoginPage}/> */}

    </Stack.Navigator>
  )
}


const CustomerTab = () => {
  



  const Tab = createBottomTabNavigator();
    // const [showProfileTab, setShowProfileTab] = useState(false);
  
    return(
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle:{
          // backgroundColor: '#53be80',
          backgroundColor: '#055240',
          // backgroundColor: '#00634B',
          height: 60,
          // width: '95%',
          // position: 'absolute',
          // marginHorizontal:10,
          // marginBottom: 5,
          // borderRadius: 10
        },
        tabBarInactiveTintColor: '#9DCFB6',
        tabBarActiveTintColor: 'white',
        tabBarHideOnKeyboard: true,
        // keyboardHidesTabBar: true,
      }}
      >
        <Tab.Screen 
        name='Home' 
        component={CustomerStack}
        options={{
          tabBarIcon: ({ color })=>(
            <Entypo name='home' color={ color } size={28}/>
          ),
          headerShown: false,
        }}/>
        <Tab.Screen 
        name='search' 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color })=>(
            <FontAwesome name='search' color={ color } size={28}/>
          ),
        }}/>
        <Tab.Screen 
        name='Bookings' 
        component={Bookings}
        options={{
          tabBarIcon: ({ color })=>(
            <Entypo name='list' color={ color } size={28}/>
          ),
        }}/>
        <Tab.Screen 
        name='Profile' 
        component={ProfileNav}
        options={{
          tabBarIcon: ({ color })=>(
            <Ionicons name='person' color={color} size={28}/>
          ),
          headerShown: false ,
        }}/>
      </Tab.Navigator>
    )
}

export default CustomerTab