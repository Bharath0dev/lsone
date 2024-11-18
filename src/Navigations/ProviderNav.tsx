import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderScreen from '../screens/Provider/ProviderScreen';
import LoginNav from './LoginNav';
import ProfileNav from './ProfileNav';
import services from '../screens/Provider/ProviderServices';
import ProviderServices from '../screens/Provider/ProviderServices';
import Bookings from '../screens/Bookings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import ProviderAvailabilityScreen from '../screens/Provider/ProviderAvailabilityScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OnHoldProviderScreen from '../screens/Provider/OnHoldProviderScreen';
import LoginPage from '../screens/loginandregister/Login';
import DeactivatedUserScreen from '../screens/DeactivatedUserScreen';

const ProviderStack = () =>{
  const Stack = createNativeStackNavigator();

    return (
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen  name='ProviderScreen' component={ProviderScreen}/>
        <Stack.Screen  name='NotificationScreenPro' component={NotificationsScreen}/>
        <Stack.Screen  name='OnHoldProviderScreen' component={OnHoldProviderScreen}/>
        <Stack.Screen  name='DeactivatedProvider' component={DeactivatedUserScreen}/>
        
        {/* <Stack.Screen name='Profile' component={ProfileNav}/>
        <Stack.Screen name='Bookings' component={Bookings}/>
        <Stack.Screen name='servicesPro' component={ProviderServices}/> */}
        {/* <Stack.Screen name='LoginP' component={LoginPage}/> */}
      </Stack.Navigator>
    )

}

const ProviderTab = () => {
    

    const Tab = createBottomTabNavigator();

  return(
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarLabelStyle: { fontSize: 14 },
      tabBarStyle:{
        backgroundColor: '#00634B',
        height: 60,
        // width: '95%',
        // position: 'absolute',
        // marginHorizontal:10,
        // marginBottom: 5,
        // borderRadius: 10
      },
      tabBarInactiveTintColor: '#9DCFB6',
      tabBarActiveTintColor: 'white',
      
    }}
    >
      <Tab.Screen 
      name='ProviderTabScreen' 
      component={ProviderStack}
      options={{
        tabBarIcon: ({ color })=>(
          <Entypo name='home' color={ color } size={28}/>
        ),
        headerShown: false,
        tabBarLabel: 'Home',
      }}/>
      <Tab.Screen name='servicesPro' component={ProviderServices}
      options={{
        headerShown: false,
        tabBarLabel: 'Services',
        tabBarIcon: ({ color })=>(
          <Octicons name='tasklist' color={ color } size={28}/>
        ),
      }}
      
      />
      <Tab.Screen 
      name='Bookings' 
      component={Bookings}
      options={{
        tabBarIcon: ({ color })=>(
          <Entypo name='list' color={ color } size={28}/>
        ),
      }}
      />
      <Tab.Screen 
      name='Avalability' 
      component={ProviderAvailabilityScreen}
      options={{
        tabBarIcon: ({ color })=>(
          <Ionicons name='calendar-outline' color={ color } size={28}/>
        ),
      }}
      />
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

export default ProviderTab