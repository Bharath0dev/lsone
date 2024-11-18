import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper'
import { CommonActions, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { MultiSelect } from 'react-native-element-dropdown'
import MultiSelectComponent from '../../tried/MultiSelectDD';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProviderScreen = () => {


  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState('');

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [availability, setAvailability] = useState([]);

  const [showDates, setShowDates] = useState(false);
  // const [showTimings, setShowTimings] = useState(false);
  const [expandedDateIndex, setExpandedDateIndex] = useState(null);
  const [downArrow, setDownArrow] = useState(false);

  const [showScheduler, setShowScheduler] = useState(false);


  useEffect(() => {
    const fetchServices = async () => {
        try {
            const response = await axios.get('http://192.168.1.218:4021/services');
            setServices(response.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    fetchServices();
  }, []);


// const handleAddService = async () => {
//   if (!selectedService) return;

//   const serviceDetails = {
//       serviceId: selectedService._id,
//       //price: selectedService.price, // Assuming price is part of the service document
//       //availability: [], // Set your availability logic here
//   };

//   try {
//       const response = await axios.put(`http://192.168.1.218:4021/service-provider/${userId}/services`, serviceDetails);
//       console.log('Service added:', response.data);
//   } catch (error) {
//       console.error('Error adding service:', error.response ? error.response.data : error.message);
//   }
// };

  const navigation = useNavigation();

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    console.log(token);
    console.log("user Id ", userId);
    setUserId(userId);
    // axios
    //   .post('http://192.168.1.218:4021/userdata', {token: token, user_id: userId})
    //   .then(res => {
    //     console.log(res.data);
    //     setUserData(res.data.data);
    //     console.log(userId);
    //   });
  }

  useEffect(() => {
   getData();
  }, []);

  // const handleLogout = () =>{
  //   AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
  //   AsyncStorage.setItem('token', '');

  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0, 
  //       routes: [{ name: 'LoginPage' }], 
  //     })
  //   );
  // }

  const getProviderAvailabilty = async () => {
    const response = await axios.get('http://192.168.1.218:4021/getProviderAvailability', {params:{providerId:userId}})
    console.log('getProviderAvailabilty data: ',response.data);
    console.log('getProviderAvailabilty data:', JSON.stringify(response.data, null, 2));

    setAvailability(response.data)
  }

  useEffect(()=>{
    if(userId){
      getProviderAvailabilty();
    }
  }, [userId])
  

  const handleShowDates = ()=>{
    if(!showDates){
      setShowDates(true);
    }
    else{
      setShowDates(false);
    }
  }


  // const handleShowTimings = ()=>{
  //   if(!showTimings){
  //     setShowDates(true);
  //   }
  //   else{
  //     setShowTimings(false);
  //   }
  // }
  

  const handleToggleTimings = (uniqueId) => {

    setExpandedDateIndex(expandedDateIndex === uniqueId ? null : uniqueId);

    if(!downArrow){
      setDownArrow(true);
    }
    else{
      setDownArrow(false);
    }

  };

  const handleDeleteDate = async (date) => {
    console.log('deleted', date);
    console.log(userId);

    if(!date){
      console.log('no date');
      return;
    }

    const response = await axios.patch('http://192.168.1.218:4021/removeDate', {date: date, providerId: userId})
    console.log(response.data);
    getProviderAvailabilty();
  }


  const handleDeleteTimings = async (timeItem, date, userId) => {
    console.log('deleted',timeItem)

    console.log('deleted', date);
    console.log(userId);

    if(!date){
      console.log('no date');
      return;
    }

    const response = await axios.patch('http://192.168.1.218:4021/removeTime', {date: date,time:timeItem, providerId: userId})
    console.log(response.data);
    getProviderAvailabilty();
  }

  const handleSave = ()=>{
    getProviderAvailabilty();
  }

  const handleShowScheduler = () => {
    if(!showScheduler){
      setShowScheduler(true);
    }else{
      setShowScheduler(false);
    }
  }

    const renderAvailabilityItem = ({ item }) => (
      <View style={styles.mainRender}>
        {showDates ? (
          item.dates.map((dateItem) => {
            const date = dateItem.date;
  
            return (
              <View key={date} style={styles.datesAndTimeList}>
                <View style={styles.dateAndArrow}>
                  <View>
                    <Text style={styles.dateText}>{dateItem.date}</Text>
                  </View>
                  <View style={styles.icons}>
                    <TouchableOpacity onPress={() => handleDeleteDate(date)}>
                      <MaterialIcons name='delete-outline' size={25} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleTimings(date)}>
                      <MaterialIcons
                        name={expandedDateIndex === date ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={25}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {expandedDateIndex === date && (
                  // <View style={styles.timeList}>
                  //   {dateItem.time.map((time, timeIndex) => (
                  //     <View style={styles.timeAndRemoveIcon}>
                  //       <Text key={timeIndex} style={styles.timeText}>{time}</Text>
                  //       <MaterialIcons name='highlight-remove' size={20}/>
                  //     </View>
                  //   ))}
                  // </View>
                  <FlatList
                  data={dateItem.time}
                  renderItem={({item})=>(
                    <View style={styles.timeAndRemoveIcon}>
                      <Text style={styles.timeText}>{item}</Text>
                      <TouchableOpacity onPress={()=>{handleDeleteTimings(item, dateItem.date, userId)}}>
                        <MaterialIcons name='highlight-remove' size={20} />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(time, index) => index.toString()} 
                  horizontal={false}
                  numColumns={3} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.timeList}
                />
                )}
              </View>
            );
          })
        ) : null}
      </View>
    );


  return (

    <View style={styles.pageContainer}>      
      <View>
        <View style={styles.myActivityView}>
          <Text style={styles.myActivityText}>My Availabily</Text>
        </View>
        <View>
        <TouchableOpacity 
          style={styles.datesTimesDropdown}
          onPress={()=>{handleShowDates()}}
          >
              <Text style={styles.dropdownHeading}>Dates and Timings </Text>
              <MaterialIcons
                name={showDates ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={25}
                color="black"
              />
        </TouchableOpacity>
        </View>
        <View>
          <FlatList
          data={availability}
          keyExtractor={(item) => item._id}
          renderItem={renderAvailabilityItem}         
         />
        </View>
      </View>
      <View>
      <Button onPress={handleShowScheduler}
      style={styles.button}
      labelStyle={styles.buttonText}>Add or Update Schedule</Button>

      {showScheduler ? (
        <MultiSelectComponent onSave={()=>{handleSave()}}/>
      ):(null)}
      
        
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  pageContainer:{
    backgroundColor: 'white',
    flex: 1,
  },
  datesTimesDropdown:{
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    // backgroundColor: 'yellow',
    borderRadius: 8,
    padding: 8
  },
  timeList:{
    flexDirection: 'row',
  },
  dateAndArrow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    // backgroundColor: 'red',
    marginHorizontal: 8,
  },
  icons:{
    flexDirection: 'row',
    columnGap: 20
  },
  timeAndRemoveIcon:{
    flexDirection: 'row',
    columnGap: 20,
    backgroundColor: 'white',
    elevation: 2,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    width: 120,
    borderRadius: 8,
    height: 30
  },
  dateText:{
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  timeText:{
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  mainRender:{
    // backgroundColor: 'green',
    width: '90%',
    marginHorizontal: 15
  },
  dropdownHeading:{
    fontSize: 16,
    fontWeight: '500',
    color: 'black'
  },
  myActivityView:{
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myActivityText:{
    fontSize: 20,
    fontWeight: '600',
  },
  button:{
    backgroundColor: '#00634B',
    borderRadius: 8,
    width: '90%',
    margin: 15
  },
  buttonText:{
    color: 'white',
    fontSize: 15
  }
})

export default ProviderScreen