import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Carousel from './Carousel'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { CommonActions, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CategoryCards from './CategoryCards'
import SearchBar  from './SearchBar';
import { MountingServices, OfficeServices, RepairingServices } from './ServiceFlatlist'




const UserHomeScreen = () => {

    const [userName, setUserName] = useState('');

    const navigation = useNavigation();

    const getName = async () => {
        const userName = await AsyncStorage.getItem('userName');
        setUserName(userName);
    }
    

    

      useEffect(()=>{
        getName();
      }, [])

  return (
    <ScrollView>
        <View style={styles.mainView}>
            <View style={styles.topTextView}>
                <Text style={styles.topText}>
                    What are you looking for today
                </Text>
            </View>
            <TouchableOpacity 
            style={styles.searchBar}
            onPress={ ()=> navigation.navigate('searchScreen') }
            >
                <SearchBar/>
            </TouchableOpacity>
            <View style={styles.sliderMain}>
              <Carousel />
            </View>
            <View style={styles.catgoriesMain}>
                <Text style={styles.catgoriesHeader}>Categories</Text>
                <View>
                  <CategoryCards/>
                </View>
            </View>
        </View>
    </ScrollView>
  )
}

export default UserHomeScreen

const styles = StyleSheet.create({
    mainView:{
        // backgroundColor: 'skyblue',
    },
    topTextView:{
        height: 100
    },
    topText:{
        fontSize:36,
        fontWeight: '600',
        marginHorizontal: 12,
    },
    searchBar:{
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderMain:{
        height: 250,
        justifyContent: 'center',
        alignItems: 'center'
    },
    catgoriesMain:{
        height: 260,
    },
    catgoriesHeader:{
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 10,
        marginHorizontal: 12
    },
    // userName:{
    //     fontSize: 15,
    //     fontWeight: 'bold',
    //     marginLeft: 10,
        
    // },
    // greet:{
    //     fontSize: 12,
    //     marginLeft: 10,
    //     color: '#212121',
    //     fontWeight: 'bold',
    // }
})
