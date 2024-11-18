import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'


const repairImages = [
    {
        id:'1', uri: require('../assets/wmrepair.jpg'), name: 'WashingMaching repair'
    },
    {
        id:'2', uri: require('../assets/acrepair.jpeg'), name: 'AC repair'
    },
    {
        id:'3', uri: require('../assets/more.png'), name: 'TV mounting'
    },
    {
        id:'4', uri: require('../assets/more.png'), name: 'TV mounting'
    },
    {
        id:'5', uri: require('../assets/more.png'), name: 'TV mounting'
    },
]

const mountImages = [
    {
        id:'1', uri: require('../assets/wmrepair.jpg'), name: 'AC mounting'
    },
    {
        id:'2', uri: require('../assets/acrepair.jpeg'), name: 'TV mounting '
    },
    {
        id:'3', uri: require('../assets/more.png'), name: 'TV mounting'
    },
    {
        id:'4', uri: require('../assets/more.png'), name: 'TV mounting'
    },
    {
        id:'5', uri: require('../assets/more.png'), name: 'TV mounting'
    },
]

export const RepairingServices = () => {

    
    const renderItem = ({ item }) => (
        <View style={ styles.list}>
            <Image source={ item.uri } style={styles.image} />
            <Text style={styles.imageName}>{item.name}</Text>
        </View>
        
    );
  return (
        <View style={styles.mainView}>
            <Text style={ styles.headingText}>Mounting Services</Text>
            <FlatList
            data={repairImages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            />
        </View>
    
  )
}

export const OfficeServices = () => {
    const renderItem = ({ item }) => (
        <View style={ styles.list}>
            <Image source={ item.uri } style={styles.image} />
            <Text style={styles.imageName}>{item.name}</Text>
        </View>
        
    );
  return (
        <View style={styles.mainView}>
            <Text style={ styles.headingText}>Mounting Services</Text>
            <FlatList
            data={mountImages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            />
        </View>
    
  )
  }


const styles = StyleSheet.create({
    headingText:{
        fontSize: 18,
        color: 'black',
        fontWeight: '600',
        marginHorizontal: 12,
    },
    mainView:{
        height: 180,
        justifyContent: 'center',
    },
    image:{
        height: 100,
        width: 100,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#52be80',
        marginVertical: 5,
    },
    list:{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    imageName:{
        fontSize: 13,
        fontWeight: '700',

    }
})