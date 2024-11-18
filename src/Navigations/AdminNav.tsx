import { View, Text, Image } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminScreen from '../screens/Admin/AdminScreen';
import CustomerData from '../components/CustomerData';
import ProviderData from '../components/ProviderData';
import ProfileNav from './ProfileNav';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNav from './LoginNav';
import LoginPage from '../screens/loginandregister/Login';
import RegistrationRequests from '../screens/Admin/RegistrationRequests';
import Services from '../components/Services';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';



//   const AdminDrawerNav = () => {
//     const Drawer = createDrawerNavigator();

// // const CustomerDataWrapper = ({ route, ...props }) => (
// //     <CustomerData {...props} route={{ ...route, params: { role: "Customer" } }} />
// //     );
    
// // const ProviderDataWrapper = ({ route, ...props})=> (
// //     <ProviderData {...props} route={{ ...route, params: {role: "ServiceProvider "}}}/>
// //     )
    
//   return(
//     <Drawer.Navigator screenOptions={{
//       drawerStyle: {
//         width: '70%',
//       },
//     }}>
//       <Drawer.Screen 
//       name='AdminScreenDrawer' component={AdminScreen}
//       options={{
//         drawerLabel: 'Home',
//         headerTitle: ()=> null,
//       }}
//       />
//       <Drawer.Screen 
//       name='CustomerData' 
//       // component={(props ) => <CustomerDataWrapper {...props} role = 'Customer'/>}
//       component={CustomerData}
//       />

//       <Drawer.Screen 
//       name='ProviderData' 
//       // component={(props ) => <ProviderDataWrapper {...props} role = 'ServiceProvider'/>}
//       component={ProviderData}
//       />
//       <Drawer.Screen name='Profilepage' component={ ProfileNav}/>
    
//     </Drawer.Navigator>
//   )
//   }

  const  AdminNav = () => {
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle:{
            backgroundColor: '#00634B',
            height: 60,
          },
          tabBarInactiveTintColor: '#9DCFB6',
          tabBarActiveTintColor: 'white',
        }}>
          <Tab.Screen
          options={{
            tabBarIcon: ({ color })=>(
              <Entypo name='home' color={ color } size={28}/>
            ),
            headerShown: false,
            tabBarLabel: 'Home',
          }} name='AdminTabScreen' component={AdminStack}/>
          <Tab.Screen options={{
            headerShown: false,
            tabBarLabel: 'Services',
            tabBarIcon: ({ color })=>(
              <Image
              source={require('../assets/services.png')}  // Path to your PNG image
              style={{ width: 30, height: 30, tintColor: color }}
            />
            ),
          }} name='TotalServices' component={Services}/>
          <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Customers',
            tabBarIcon: ({ color })=>(
              <Image
              source={require('../assets/customers10.png')}  // Path to your PNG image
              style={{ width: 30, height: 30, tintColor: color }}
            />
            ),
          }} name='CustomerData' component={CustomerData}/>
          <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Providers',
            tabBarIcon: ({ color })=>(
              <Image
              source={require('../assets/management.png')}  // Path to your PNG image
              style={{ width: 34, height: 34, tintColor: color }}
            />
            ),
          }} name='ProviderData' component={ProviderData}/>
          <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color })=>(
              <Ionicons name='person' color={color} size={28}/>
            ),
          }} name='Profilepage' component={ ProfileNav}/>
        </Tab.Navigator>
    )
    //employees.png
  }

const AdminStack  = () => {
  const Stack = createNativeStackNavigator();
    return(
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name='AdminStackScreen' component={AdminScreen}/>
        <Stack.Screen name='RegistrationRequestsScreen' component={RegistrationRequests}/>
        <Stack.Screen name='TotalServices' component={Services}/>
        <Stack.Screen name='CustomerData' component={CustomerData}/>
        <Stack.Screen name='ProviderData' component={ProviderData}/>
        {/* <Stack.Screen name='LoginAd' component={LoginPage}/> */}
      </Stack.Navigator>
    )

}


export default AdminNav