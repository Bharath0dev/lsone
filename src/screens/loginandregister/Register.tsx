import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { RadioButton } from 'react-native-paper'
import Feather from 'react-native-vector-icons/Feather'
import Error from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import styles from './style'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [nameVerify, setNameVerify] = useState(false)

  const [email, setEmail] = useState('')
  const [emailVerify, setEmailVerify] = useState(false)

  const [mobile, setMobile] = useState('')
  const [mobileVerify, setMobileVerify] = useState(false)

  const [password, setPassword] = useState('')
  const [passwordVerify, setPasswordVerify] = useState(false)
  const [showPassword, setShowPassword] = useState(true)

  const [role, setRole] = useState('')
  const [roleVerify, setRoleVerify] = useState(false)

  const navigation = useNavigation()

  const handleSubmit = () => {
    const userData = {
      name,
      email,
      mobile,
      password,
      role,
    }

    if (nameVerify && emailVerify && passwordVerify && mobileVerify && roleVerify) {
      axios.post('http://192.168.1.218:4021/register', userData)
        .then((res) => {
          if (res.data.status === 'ok') {
            Alert.alert('Registration Successful')
            navigation.navigate('LoginPage')
          } else {
            Alert.alert(JSON.stringify(res.data))
          }
        })
        .catch(e => console.log(e))
    } else {
      Alert.alert('Please fill in all mandatory details correctly')
    }
  }

  const handleName = (e) => {
    const nameVar = e.nativeEvent.text
    setName(nameVar)
    setNameVerify(nameVar.length > 1)
  }

  const handleEmail = (e) => {
    const emailVar = e.nativeEvent.text
    setEmail(emailVar)
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar))
  }

  const handleMobile = (e) => {
    const mobileVar = e.nativeEvent.text
    setMobile(mobileVar)
    setMobileVerify(/^[6-9][0-9]{9}$/.test(mobileVar))
  }

  const handlePassword = (e) => {
    const passwordVar = e.nativeEvent.text
    setPassword(passwordVar)
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~`-]).{8,}/.test(passwordVar))
  }

  const handleRoleChange = (role) => {
    setRole(role)
    setRoleVerify(role !== '')
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <View>
        <View style={styles.logoContainer}>
          <Text style={styles.text_header}>Register</Text>

          <Text style={{ alignItems: 'flex-end', width: '100%', marginLeft: 65, fontSize: 16, fontWeight: '500' }}>Register as</Text>

          <View style={styles.radioButton_div}>
            <View style={styles.radioButton_inner_div}>
              <Text style={styles.radio_btn_text}>Customer</Text>
              <RadioButton
                value='Customer'
                status={role === 'Customer' ? 'checked' : 'unchecked'}
                onPress={() => handleRoleChange('Customer')}
              />
            </View>

            <View style={styles.radioButton_inner_div}>
              <Text style={styles.radio_btn_text}>ServiceProvider</Text>
              <RadioButton
                value='ServiceProvider'
                status={role === 'ServiceProvider' ? 'checked' : 'unchecked'}
                onPress={() => handleRoleChange('ServiceProvider')}
              />
            </View>
          </View>

          <View style={styles.action}>
            <Feather name='user' color='#055240' style={styles.smallIcon} />
            <TextInput
              placeholder='Name'
              style={styles.textInput}
              onChange={handleName}
            />
            {nameVerify && <Feather name='check-circle' color='green' size={20} />}
            {!nameVerify && name.length > 0 && <Error name='error' color='red' size={20} />}
          </View>
          {!nameVerify && name.length > 0 && <Text style={{ marginLeft: 20, color: 'red' }}>Name should be more than 1 character</Text>}

          <View style={styles.action}>
            <Feather name='mail' color='#055240' style={styles.smallIcon} />
            <TextInput
              placeholder='Email'
              style={styles.textInput}
              onChange={handleEmail}
            />
            {emailVerify && <Feather name='check-circle' color='green' size={20} />}
            {!emailVerify && email.length > 0 && <Error name='error' color='red' size={20} />}
          </View>
          {!emailVerify && email.length > 0 && <Text style={{ marginLeft: 20, color: 'red' }}>Enter a valid email address</Text>}

          <View style={styles.action}>
            <Feather name='phone' color='#055240' style={styles.smallIcon} />
            <TextInput
              placeholder='Mobile'
              style={styles.textInput}
              onChange={handleMobile}
              maxLength={10}
            />
            {mobileVerify && <Feather name='check-circle' color='green' size={20} />}
            {!mobileVerify && mobile.length > 0 && <Error name='error' color='red' size={20} />}
          </View>
          {!mobileVerify && mobile.length > 0 && <Text style={{ marginLeft: 20, color: 'red' }}>Phone number should contain 10 digits</Text>}

          <View style={styles.action}>
            <Feather name='lock' color='#055240' style={styles.smallIcon} />
            <TextInput
              placeholder='Password'
              style={styles.textInput}
              onChange={handlePassword}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length > 0  ? (
                    <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    style={styles.eyeIcon}
                    color={passwordVerify ? 'green' : 'red'}
                    size={16}
                  />
                ) : (null)}
            </TouchableOpacity>
          </View>
          {!passwordVerify && password.length > 0 && <Text style={{ marginLeft: 20, color: 'red' }}>Password must contain uppercase, lowercase, number, special character, and be at least 8 characters long</Text>}

          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.inBut, { opacity: nameVerify && emailVerify && passwordVerify && mobileVerify && roleVerify ? 1 : 0.3}]}
              onPress={handleSubmit}
              disabled={!(nameVerify && emailVerify && passwordVerify && mobileVerify && roleVerify)}
            >
              <Text style={styles.textSign}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.smalltextContainer}>
            <Text style={styles.smallText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
              <Text style={styles.smallTextLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default RegisterPage
