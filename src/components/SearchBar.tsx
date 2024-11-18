import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler'

const SearchBar = () => {
  return (
    <View style={styles.searchMain}>
        <Ionicons name='search' size={24} style={{ marginHorizontal: 8}}/>
        <TouchableOpacity >
        {/* <TextInput 
            placeholder='Search for services you need'
            style={styles.textInput}
        /> */}
        <Text style={styles.searchText}>Search for services you need</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    searchMain:{
        borderColor: 'grey',
        borderWidth: 1.5,
        borderRadius: 22,
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    searchText:{
        fontSize: 16,
    }
})
export default SearchBar