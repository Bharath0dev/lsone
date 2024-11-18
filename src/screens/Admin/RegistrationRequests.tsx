import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import { Button } from 'react-native-paper'

const RegistrationRequests = () => {

    const [inactiveUsers,setInactiveUsers] = useState([])

const getRegistrationRequests = async () => {

    try{
        const response = await axios.get('http://192.168.1.218:4021/getRegistrationRequests');
        console.log(response.data);

        setInactiveUsers(response.data.result);
    }catch(error){
        console.log('error while getting registration requests-', error);
    }
}

useFocusEffect(
    useCallback(()=>{
        getRegistrationRequests();
    }, [])
)

const handleResponse = async(statusResponse, providerId) => {
    try{
        console.log(statusResponse, providerId);

        const response = await axios.patch('http://192.168.1.218:4021/updateAccountStatus', { statusResponse: statusResponse, providerId:providerId});
        console.log(response.data);
        getRegistrationRequests();
    }catch(error){
        console.log('error while chnaging the account status-', error);
    }
}

// Render Footer if no requests are found
const renderFooter = () => {
    if (inactiveUsers.length === 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No Registration Requests</Text>
        </View>
      );
    }
    return null; // Don't render footer if there are items in the list
  };

  return (
    <View style={styles.pageContainer}>
      <FlatList
      data={inactiveUsers}
      renderItem={({item})=>(
        <View style={styles.flatlistContainer}>
            <View style={styles.flatlistText}>
                <View style={styles.detailView}>
                    <Text style={styles.detailText}>Name: </Text>
                    <Text>{item.name}</Text>
                </View>
               
               <View style={styles.detailView}>
                    <Text style={styles.detailText}>Email: </Text>
                    <Text>{item.email}</Text>
               </View>
                
                <View style={styles.detailView}>
                    <Text style={styles.detailText}>Mobile: </Text>
                    <Text>{item.mobile}</Text>
                </View>
                

                <View style={styles.detailView}>
                    <Text style={styles.detailText}>Services: </Text>
                    <Text>{item.providerDetails.preferences}</Text>
                </View>
                

                <View style={styles.detailView}> 
                    <Text style={styles.detailText}>Experience:</Text>
                    <Text>{item.providerDetails.experience}</Text>
                </View>
                
                <View style={[styles.detailView, {width: '75%'}]}>
                    <Text style={styles.detailText}>Description:</Text>
                    <Text>{item.providerDetails.description}</Text>
                </View>
                
                <View style={styles.detailView}>
                    <Text style={styles.detailText}>Address:</Text>
                    <Text>{item.address}</Text>
                </View>
                
            </View>
            <View style={styles.buttons}>
                <Button onPress={()=>handleResponse('rejected', item._id)}>Reject</Button>
                <Button onPress={()=>handleResponse('approved', item._id)}>Approve</Button>
            </View>
            
        </View>
      )}
      keyExtractor={(item) => item._id} 
      ListFooterComponent={renderFooter} 
      />
    </View>
  )
}

export default RegistrationRequests

const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        backgroundColor: 'white',

    },
    flatlistContainer:{
        backgroundColor: 'white',
        elevation: 4,
        margin: 10,
        borderRadius: 10,
    },
    flatlistText:{
        margin: 10,
        rowGap: 8,
    },
    buttons:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    footer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#333',
        fontSize: 16,
    },
    detailView:{
        flexDirection: 'row',
        columnGap: 8,    
    },
    detailText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    }
})