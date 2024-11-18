import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const CategoryCards = () => {

    const navigation = useNavigation();

  return (
    <>
        <View style={styles.cardOne}>
            {/* <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Plumbing' })}
            >
               <View style={styles.card}>
                <Image style={[styles.cardImage, {height: 55, width: 55}]} source={require('../assets/plumbing2.png')} />
                </View>
                <Text style={styles.cardText}>Plumbing</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Mounting and Installation' })}
            >
                <View style={styles.card}>
                <Image style={styles.cardImage} source={require('../assets/mount.png')} />
                </View>
                <Text style={[styles.cardText, {fontSize: 13}]} numberOfLines={2}>Mounting & Installation</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Cleaning' })}
            >
                <View style={[styles.card, {padding: -20}]}>
                <Image style={[styles.cardImage]} source={require('../assets/cleaning2.png')} />
                </View>
                <Text style={styles.cardText}>Cleaning</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Repairing' })}
            >
                <View style={styles.card}>
                <Image style={styles.cardImage} source={require('../assets/repairing.png')} />
                </View>
                <Text style={styles.cardText}>Repairing</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Furniture Assembling' })}
            >
                <View style={styles.card}>
                <Image style={styles.cardImage} source={require('../assets/Furniture-Assembly.png')} />
                </View>
                <Text style={styles.cardText}>Furniture Assembling</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.cardTwo}>
            <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Gardening Services' })}
            >
                <View style={styles.card}>
                <Image style={[styles.cardImage, {height: 55, width: 55}]} source={require('../assets/Yard_work.png')} />
                </View>
                <Text style={styles.cardText}>Gardening Services</Text>
            </TouchableOpacity>

           

            <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Painting' })}
            >
                <View style={styles.card}>
                <Image style={styles.cardImage} source={require('../assets/painting.png')} />
                </View>
                <Text style={styles.cardText}>Painting</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.cardContainer}
            onPress={()=> navigation.navigate('ServicesScreen', { category: 'Handyman' })}
            >
                <View style={styles.card}>
                <Image style={[styles.cardImage, {height: 55, width: 55}]} source={require('../assets/handyman2.png')} />
                </View>
                <Text style={styles.cardText}>HandyMan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardContainer}
            onPress={()=> navigation.navigate('categories')}
            >
                <View style={styles.card}>
                <Image style={styles.cardImage} source={require('../assets/more2.png')} />
                </View>
                <Text style={styles.cardText}>More</Text>
            </TouchableOpacity>

        </View>
  </>
  )
}

export default CategoryCards

const styles = StyleSheet.create({
    
    cardOne:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 10
    },
    cardTwo:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 10
    },
    card:{
        // backgroundColor: '#055240',
        borderColor: '#212121',
        // borderWidth: 1.5,
        borderRadius: 25,
        height: 65,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    cardImage:{
        height: 50,
        width: 50,
        // borderRadius: 100,
    },
    cardContainer:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardText:{
        color: 'black',
        fontWeight: '500',
        textAlign: 'center', 
        maxWidth: 80,
        fontSize: 14
    }
})