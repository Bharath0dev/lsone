import { Alert, BackHandler, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const DeactivatedUserScreen = () => {

    const navigation = useNavigation();
    const handleLogout = async () => {
    
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
        await AsyncStorage.setItem('token', '');
        // navigation.navigate('LoginPage');
    
        navigation.dispatch(
          CommonActions.reset({
            index: 0, 
            routes: [{ name: 'LoginPage' }], 
          })
        );
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

  
  return (
    <View style={styles.pageContainer}>
      <Text>Your account got deactivated</Text>
      <View>
          <Button
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => handleLogout()}
              > Log out</Button>
        </View>
    </View>
  )
}

export default DeactivatedUserScreen

const styles = StyleSheet.create({
    pageContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 15,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#055240',
        borderRadius: 8,
    },
    buttonText:{
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    }
})