import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderScreen from '../screens/Provider/ProviderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UpdateProfile from '../components/UpdateProfile';
import LoginNav from './LoginNav';
import LoginPage from '../screens/loginandregister/Login';

const ProfileNav = () => {
    const Stack = createNativeStackNavigator();

  return(
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen name="Profilepage" component={ProfileScreen}/>
      <Stack.Screen name='UpdateProfile' component={UpdateProfile}/>
      {/* <Stack.Screen name='LoginProfile' component={LoginPage}/> */}

    </Stack.Navigator>
  )
}

export default ProfileNav