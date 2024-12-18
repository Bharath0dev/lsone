import { Alert, BackHandler, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-paper'
import axios from 'axios';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnHoldProviderScreen = ({route}) => {
    console.log(route.params)
    const [showForm, setShowForm] = useState(false);
    const [userEmail, setUserEmail] = useState(route.params.email);

    const navigation = useNavigation();

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

    const FormModal = () => {
        const [address, setAddress] = useState('');
        const [experience, setExperience] = useState('');
        const [services, setServices] = useState('');
        const [description, setDescription] = useState('');

        const navigation = useNavigation();

        const handleSubmit = async () => {
            console.log(address, experience, userEmail);
            if(!experience || !address || !services){
                Alert.alert('Please fill all fields');
            }
            const data = {
                address: address,
                experience: experience,
                email: userEmail,
                services: services,
                description: description,
            }
            try{
                const response = await axios.patch('http://192.168.1.218:4021/updateOnHoldProviderData', data)
                console.log(response.data);
                if(response.data.status === 'ok'){
                  Alert.alert('Details submitted successfully');
                  setShowForm(false);
                }
            }catch(error){
                console.log('error while sending experience and location-', error)
            }
        }
        
        return(
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showForm}
                onRequestClose={() => setShowForm(false)} 
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Button onPress={() => setShowForm(false)} style={{ margin: 20, alignItems: 'flex-end' }}>
                            Close
                        </Button>

                        <Text>Enter your services with atleast 6 months of experience</Text>
                        <TextInput
                            style={{
                                borderColor: "#00634B",
                                borderWidth: 1,
                                borderRadius: 9,
                                margin: 10,
                                height: 50,
                                fontSize: 13,
                                // width: '80%',
                            }}
                            onChangeText={setServices}
                            multiline={true}
                            numberOfLines={3}
                            keyboardType='numeric'
                            placeholder='Ex. AC repair'
                        />

                        <Text>Experience(in years)</Text>
                        <TextInput
                            style={{
                                borderColor: "#00634B",
                                borderWidth: 1,
                                borderRadius: 9,
                                margin: 10,
                                height: 50,
                                fontSize: 13,
                                // width: '80%',
                            }}
                            onChangeText={setExperience}
                            multiline={true}
                            numberOfLines={3}
                            keyboardType='numeric'
                            placeholder='Enter your experience (Ex. 0.6 for months)'
                        />

                        <Text>Description</Text>
                        <TextInput
                            style={{
                                borderColor: "#00634B",
                                borderWidth: 1,
                                borderRadius: 9,
                                margin: 10,
                                height: 50,
                                fontSize: 13,
                                // width: '80%',
                            }}
                            onChangeText={setDescription}
                            multiline={true}
                            placeholder='Describe yourself..'
                        />


                        <Text>Your Address</Text>
                        <TextInput
                            style={{
                                borderColor: "#00634B",
                                borderWidth:1,
                                borderRadius: 9,
                                margin: 10,
                                height: 50,
                                fontSize: 13,
                                // width: '80%',
                            }}
                            onChangeText={setAddress}
                            multiline={true}
                            // numberOfLines={3}
                            placeholder='Enter your address'
                        />

                        <TouchableOpacity style={styles.button}
                        onPress={()=> handleSubmit()}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        )
    }
    
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.note}>Your account is in inactive state</Text>
      <Text style={styles.note}>To get activated, please provide the details</Text>
      <TouchableOpacity style={styles.button}
      onPress={()=> setShowForm(true)}>
        <Text style={styles.buttonText}>Show Form</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}
        onPress={()=> handleLogout()}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      {showForm && <FormModal />}
    </View>
  )
}

export default OnHoldProviderScreen

const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        backgroundColor: '#00634B',
        // height: 50,
        // width: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    buttonText:{
        color: 'white',
        fontSize: 20,
        padding: 10,
        fontWeight: 'bold',
    },
    note:{
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        height: '100%',
    },
})