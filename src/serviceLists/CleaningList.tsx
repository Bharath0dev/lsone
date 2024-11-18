import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';

const CleaningList = () => {
    const [cleaningServices, setCleaningServices] = useState('');
    
    const getCleaningServices = async ()=>{
        const category = "Cleaning";

        const response = await axios.get('http://192.168.1.218:4021/get-services', { params: { category }})
        console.log(response.data);
    }

  return (
    <View>
      <View>
        <Text>Cleaning Services</Text>
      </View>

      <View>

      </View>
    </View>
  )
}

export default CleaningList

const styles = StyleSheet.create({})