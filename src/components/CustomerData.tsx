import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CustomerData = ({ route }) => {
  
    // const {role} = route.params;
    const role = 'Customer';
    
    console.log(role);
    const [userData, setUserData] = useState('');

    const navigation = useNavigation();

    const [allUserData, setAllUserData] = useState('');
    const [filteredUsers, setFilteredUsers] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


  async function getAllData(){

    try{
        const response = await axios.get('http://192.168.1.218:4021/get-user-data', { params: { role }})
        console.log(response.data);
        setAllUserData(response.data.data);
    }catch(error){
        console.log(error)
    }
  }


  function handleChange(query){
    setSearchQuery(query);

    const filtered = allUserData.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) || 
      user.email.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredUsers(filtered);
  }

  useFocusEffect(
    useCallback(()=>{
    // getData();
    getAllData();
  }, [role]));


      function deactivateUser(data){
        axios.patch('http://192.168.1.218:4021/deactivateUser', {id: data._id})
        .then( res => {
          console.log(res.data);
          if(res.data.status == 'ok'){
            getAllData();
          }
        })
      }
    
      // const UserCard=({data})=>(
      //   <View>
      //   {(data.accountStatus === 'active' || data.accountStatus === 'deactivated') ? (
      //       <View style={styles.card}>
      //       {/* <Image source={ { uri: ''}} style={styles.image}/> */}
      
      //       <View style={styles.cardDetails}>
      //         <Text style={styles.name}>{data.name}</Text>
      //         <Text style={styles.email}>{data.email}</Text>
      //         <Text style={styles.role}>{data.role}</Text>
      //       </View>


      //       {data.accountStatus === 'active' ? (
      //         <TouchableOpacity 
      //         onPress={()=> deactivateUser(data)}
      //         style={{
      //           borderWidth: 2, 
      //           borderColor: 'red', 
      //           borderRadius: 8, 
      //           height: 35, 
      //           justifyContent: 'center', 
      //           alignItems: 'center'
      //           }}>
      //           {/* <MaterialCommunityIcons name='delete-outline' size={30} 
      //           onPress={()=> deleteUser(data)}
      //           /> */}
                
      //           <Text style={{ color: 'black', padding: 5, fontWeight: '500'}}>Deactivate</Text>
      //         </TouchableOpacity>
      //       ) : ( data.accountStatus === 'active' ? (
      //         <TouchableOpacity 
      //           onPress={()=> deactivateUser(data)}
      //           style={{
      //             borderWidth: 2, 
      //             borderColor: 'green', 
      //             borderRadius: 8, 
      //             height: 35, 
      //             justifyContent: 'center', 
      //             alignItems: 'center'
      //             }}>
      //             {/* <MaterialCommunityIcons name='delete-outline' size={30} 
      //             onPress={()=> deleteUser(data)}
      //           /> */}
                
      //           <Text style={{ color: 'black', padding: 5, fontWeight: '500'}}>Deactivate</Text>
      //         </TouchableOpacity>) :(null)
      //       )}
      //       </View>
      //   ) : (null)}
      //   </View>
      // )

      const UserCard=({data})=>(
        <View style={styles.card}>
          {/* <Image source={ { uri: ''}} style={styles.image}/> */}
    
          <View style={styles.cardDetails}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.email}>{data.email}</Text>
            <Text style={styles.role}>{data.role}</Text>
          </View>

          {/* <View>
            <MaterialCommunityIcons name='delete-outline' size={30} 
            onPress={()=> deleteUser(data)}
            />
          </View> */}

          {data.accountStatus === 'active' ? (
            <TouchableOpacity 
            onPress={()=> deactivateUser(data)}
            style={{
              borderWidth: 2, 
              borderColor: 'red', 
              borderRadius: 8, 
              height: 35, 
              justifyContent: 'center', 
              alignItems: 'center'
              }}>
              {/* <MaterialCommunityIcons name='delete-outline' size={30} 
              onPress={()=> deleteUser(data)}
              /> */}
              
              <Text style={{ color: 'black', padding: 5, fontWeight: '500'}}>Deactivate</Text>
            </TouchableOpacity>
          ) : ( data.accountStatus === 'deactivated' ? (
            <TouchableOpacity
              onPress={()=> deactivateUser(data)}
              style={{
                borderWidth: 2, 
                borderColor: 'green', 
                borderRadius: 8, 
                height: 35, 
                justifyContent: 'center', 
                alignItems: 'center'
                }}>
                {/* <MaterialCommunityIcons name='delete-outline' size={30} 
                onPress={()=> deleteUser(data)}
              /> */}
              
              <Text style={{ color: 'black', padding: 5, fontWeight: '500'}}>Activate</Text>
            </TouchableOpacity>) :(null)
          )}

        </View>
      )

      
      return (
        <>
          <View style={styles.container}>

            <View style={styles.searchContainer}>
              <View style={styles.searchbar}>
                <View>
                <Ionicons name='search' size={18}/>
                </View>
                <TextInput
                  style={styles.searchInput}
                  placeholder='search here'
                  placeholderTextColor={'#070707'}
                  value={searchQuery}
                  onChangeText={handleChange}
                />
              </View>
            </View>

            <View style={styles.recordsContainer}>
              <Text style={styles.recordsText}>
                { searchQuery.length > 0 ? `${filteredUsers.length} records found` : `Total records ${allUserData.length}`} 
              </Text>
            </View>
            <FlatList
              // data={allUserData}
              data={ searchQuery.length>0 ? filteredUsers : allUserData}
              keyExtractor={item => item._id}
              renderItem={({item}) => ( <UserCard data={item} />)}
            />
          </View>

          {/* <Button 
          onPress={()=>{ navigation.navigate('Profilepage')}}
          >Profile</Button>  */}

        </>
      )
    }
    
    const styles = StyleSheet.create({
      container:{
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
      },
      userName:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5
      },
      role:{
        fontSize: 18,
        color: '#777777'
      },
      card:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        // backgroundColor: 'green',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      image:{
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      cardDetails:{
        flex: 1,
      },
      name:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
      },
      email: {
        fontSize: 14,
        color: '#777777'
      },
      searchContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,

      },
      searchbar:{
        flexDirection: 'row',
        alignItems: 'center',
        // marginHorizontal: 10,
      },
      recordsContainer:{
        alignItems: 'flex-end',
        padding: 10,
        height: 50,
      }
    })
    


export default CustomerData

