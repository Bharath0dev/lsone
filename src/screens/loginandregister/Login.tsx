import { View, Text, Image, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const LoginPage = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [showPassword, setShowPassword] = useState(true);

     const handleSubmit = async ()=>{
      console.log(email, password);

      if(!email || !password){
        Alert.alert('Please fill all the fields')
        return;
      }

      const userData ={
        email: email,
        password: password,
    }
    // console.log('kyaa');
    console.log('userData sending to backend is:',userData);
    const response = await axios.post('http://192.168.1.218:4021/login-user', userData)
    
      console.log(response.data)

      if(response.data.status == 'ok'){
        // Alert.alert('Login Succesfull');

        console.log('user accoutStatus is-',response.data.accountStatus);

        await AsyncStorage.setItem('token', response.data.data);
        await AsyncStorage.setItem('userId', response.data.userId);
        await AsyncStorage.setItem('role', response.data.role);
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));


        
        if(response.data.role === 'Admin' ){
          navigation.navigate('AdminScreen');
        }
        else if(response.data.role === 'Customer'){
          if(response.data.accountStatus === 'deactivated'){
            navigation.navigate('DeactivatedUser')
          }
          navigation.navigate('HomePage')
        }
        else if(response.data.role === 'ServiceProvider'){
          if(response.data.accountStatus === 'inactive'){
            navigation.navigate('OnHoldProviderScreen', {email: response.data.userEmail});
          }else if(response.data.accountStatus === 'deactivated'){
            navigation.navigate('DeactivatedUser')
          }else{
            navigation.navigate('ProviderTab');
          }
        }
        setEmail('');
        setPassword('');
      }else if(response.data.status == 'No-User'){
        Alert.alert('Enter Valid Credentials');
      }else if(response.data.status == 'error'){
        Alert.alert('Invalid email or Password');
      }

  }


  // const handleBackPress = () => {
  //   Alert.alert('Exit App', 'Are you sure you want to exit?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => null,
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'Exit',
  //       onPress: () => BackHandler.exitApp(),
  //     },
  //   ]);
  //   return true;
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //     return () => {
  //       BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //     };
  //   },[]),
  // );


  return (
    <ScrollView keyboardShouldPersistTaps={'always'} contentContainerStyle={{flexGrow: 1, justifyContent:'center',  }}>
      <View style={{width: '100%', alignItems: 'center'}}>
        
            <Text style={styles.text_header}>Login </Text>


            <View style={styles.action}>
                <Feather name='user' color='#055240' style={styles.smallIcon}/>

                <TextInput 
                placeholder='Email' 
                value={email}
                style={styles.textInput}
                onChange={e => setEmail(e.nativeEvent.text)}
                />
            </View>

            <View style={styles.action}>
                <SimpleLineIcons name='lock' color='#055240' style={styles.smallIcon}/>

                <TextInput 
                placeholder='Password' 
                value={password}
                style={styles.textInput}
                onChange={e => setPassword(e.nativeEvent.text)}
                secureTextEntry={showPassword}
                />
                <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
                    {password.length<1?null: !showPassword?(
                    <Feather
                    name='eye-off'
                    style={styles.eyeIcon}
                    color= '#055240'
                    size={16}
                    />):(
                        <Feather
                    name='eye'
                    style={styles.eyeIcon}
                    color= '#055240'
                    size={16}
                    /> 
                    )}
                </TouchableOpacity>
            </View>

            
        <TouchableOpacity 
              style={{
                // justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginVertical: 8,
                marginHorizontal: 10,
                paddingHorizontal: 20,
                width: '100%',
              }}
              onPress={()=>{navigation.navigate('ForgotPasswordScreen')}}>
              <Text style={{ color: '#00634B', fontWeight: '700'}}>Forgot Password?</Text>
        </TouchableOpacity>


        <View style={ styles.button}>
                <TouchableOpacity style={ styles.inBut} onPress={()=> handleSubmit()}>
                  <View>
                    <Text style={ styles.textSign}>Login</Text>
                  </View>
                </TouchableOpacity>
                <View style={{ padding: 15 }}>
                </View>

                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                    <Text style={{fontSize: 15}}> Don't have an Account? {' '}</Text>
                    <TouchableOpacity 
                    onPress={()=>{ navigation.navigate('Register')}}
                    >
                      <Text style={ styles.signupText }> SignUp</Text>
                    </TouchableOpacity>
                    
                  </View>

            </View>
      </View>
    </ScrollView>
  )
}

export default LoginPage