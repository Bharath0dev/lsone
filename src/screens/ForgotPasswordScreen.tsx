import { Alert, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgatPasswordScreen = () => {

  const [email, setEmail] = useState('');
  const [userOTP, setUserOTP] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [showOTPInputBox, setShowOTPInputBox] = useState(false);
  const [showChangePasswordInputBox,setShowChangePasswordInputBox] = useState(false);
  const [password,setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVerify,setPasswordVerify] = useState(false);

  const [submitBtn, setSubmitBtn] = useState(false);

  const navigation = useNavigation();

  const handleSubmitEmail = async () => {
    try{
      if(email){
        const response = await axios.get('http://192.168.1.218:4021/emailVerification', {params: { email : email }});
        console.log(response.data);
        if(response.data.status === 'ok'){
          setShowOTPInputBox(true);
          setShowEmailInput(false);
          console.log(response.data.emailOTP);
          setEmailOTP(response.data.emailOTP);
          
        }
      }
    }catch(error){
      console.log('error while resetting passowrd', error);
    }
    
  }

  const handleSubmitOTP = async () => {
    console.log(userOTP)
    if(userOTP == emailOTP){
      console.log('yayy');
      setShowChangePasswordInputBox(true);
      setShowEmailInput(false);
      setShowOTPInputBox(false);
    }
  }


  const checkPasswords = (password, confirmPassword) => {
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~`-]).{6,}/.test(password)) {
      return password === confirmPassword;
    }
    return false;
  };
  

  const handleChangePassword = async (password, confirmPassword) => {

    setSubmitBtn(true);
    const isPasswordValid = checkPasswords(password, confirmPassword);

    console.log(submitBtn, passwordVerify)

    setPasswordVerify(isPasswordValid);

    if(isPasswordValid){
      console.log(password, confirmPassword);
      const data = {
        email: email,
        password: password,
      }
      console.log(data);
      const response = await axios.patch('http://192.168.1.218:4021/updatePassword', data );
      console.log(response.data);
      if(response.data.status === 'ok'){
        Alert.alert('Password updated successfully');
        navigation.goBack();
      }
    }
  }
  return (
    <View style={styles.pageContainer}>
      { showEmailInput && !showOTPInputBox && !showChangePasswordInputBox ? (<View>
        <View>
          <TextInput
          style={styles.Input}
          placeholder='Enter Your Email'
          onChangeText={setEmail}
          value={email}
          />
        </View>
        <View>
          <Button style={styles.button} labelStyle={styles.buttonText}
          onPress={()=>{handleSubmitEmail()}}>Submit Email</Button>
        </View>
      </View>
      ):( showOTPInputBox && !showEmailInput && !showChangePasswordInputBox ? (
        <View>
          <View>
            <TextInput
            style={styles.Input}
            placeholder='Enter OTP'
            onChangeText={setUserOTP}
            value={userOTP}
            keyboardType='numeric'
            />
          </View>
          <View>
            <Button style={styles.button} labelStyle={styles.buttonText}
            onPress={()=>{handleSubmitOTP()}}>Submit OTP</Button>
          </View>
        </View>):( showChangePasswordInputBox && !showOTPInputBox  && !showEmailInput ?(
          <View>
            
          <View>
            <TextInput
            style={styles.Input}
            placeholder='Enter Password'
            onChangeText={setPassword}
            // onChangeText={handlePassword}
            value={password}
            secureTextEntry = {true}
            />
          </View>
        
          <View>
            <TextInput
            style={styles.Input}
            placeholder='Confirm Password'
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            />
          </View>

          { submitBtn && !passwordVerify ? (
            <View style={{ marginHorizontal: 15,}}>
              <Text
              style={{ color: '#fa6f46', fontSize: 16}}>
                  Uppercase, Lowercase, Number, special characters and 6 or more characters and password and confirm password should be same
              </Text>
            </View>): (null)}

          <View>
          <Button style={styles.button} labelStyle={styles.buttonText}
            onPress={()=>{handleChangePassword(password, confirmPassword)}}>Change Password</Button>
          </View>

        </View>
        ):(null))
      )}
      
    </View>
  )
}

export default ForgatPasswordScreen

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center'
  },
  Input: {
    borderWidth: 1,
    borderColor: '#333',
    margin: 10,
    fontSize: 16,
  },
  button:{
    backgroundColor: '#00634B',
    borderRadius: 8,
    margin: 10
  },
  buttonText:{
    color: 'white',
    fontSize: 16
  }
})