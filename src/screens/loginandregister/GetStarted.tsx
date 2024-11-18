import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const GetStarted = () => {
    const navigation = useNavigation();
  return (
    <View style={{backgroundColor: '#fff', flex:1, justifyContent: 'space-evenly'}}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={ require( '../../assets/logo.png')}/>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.text}>
            Welcome 
            to LocalServe
        </Text>
      </View>

    <TouchableOpacity 
    style={styles.buttonContainer}
    onPress={()=> {navigation.navigate('Register')}}
    >
        <Text style={styles.buttonText}>Get Started{' >'}</Text>
    </TouchableOpacity>

        <View style={styles.smalltextContainer}>
            <Text style={styles.smallText}>
                Already have an accout?{"  "}
            </Text>
            <TouchableOpacity
            onPress={()=> {navigation.navigate('LoginPage')}}
            >
                <Text style={styles.smallTextLink}>Login</Text>
            </TouchableOpacity>
      </View>
    </View>
  )
}

export default GetStarted

const styles = StyleSheet.create({
    logoContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        width: '65%',
        height: 200,
    },
    textContainer:{
        justifyContent: 'center',
        alignItems:"center",
        marginHorizontal: 25,
        marginVertical: 25,
    },
    text:{
        fontSize: 40,
        fontWeight: '900',
    },
    buttonContainer:{
        backgroundColor: '#f64343',
        height: 60,
        width: 215,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 'auto',
        borderRadius: 40,
        marginVertical: 30
    },
    buttonText:{
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    smalltextContainer:{
        justifyContent:"center",
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 30
    },
    smallText:{
        fontSize: 15
    },
    smallTextLink:{
        fontSize: 17,
        color: '#f04646',
        fontWeight: 'bold'
    }
})