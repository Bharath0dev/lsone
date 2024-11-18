import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {

  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // const [providers, setProviders] = useState([]);

    // const getProviders = async () => {
    //     try {
    //         const response = await axios.get('http://192.168.1.218:4021/getProviders',);
    //         console.log(response.data);
    //         setProviders(response.data.serviceProviderId);
    //     } catch (error) {
    //         console.error('Error fetching providers:', error);
    //     }
    // };

    const getCategories = async () => {
        const response = await axios.get('http://192.168.1.218:4021/getCategories');
        console.log(response.data);

        // Create a map to count occurrences of each category
        const categoryCountMap = {};

        response.data.forEach(item => {
            const category = item.category;
            if (categoryCountMap[category]) {
                categoryCountMap[category].count += 1;
            } else {
                categoryCountMap[category] = { ...item, count: 1 };
            }
        });

        // Convert the map back to an array of unique categories
        const uniqueCategories = Object.values(categoryCountMap);
        setCategories(uniqueCategories);
    };

  const getServices = async () => {
    try {
        const response = await axios.get('http://192.168.1.218:4021/get-services-ad');
        setServices(response.data.data);
    } catch (error) {
        console.error('Error fetching services:', error);
    }
  };

  const mergeData = () => {
    return [ ...services, ...categories ];
  }

  function handleChange(query){
    setSearchQuery(query);

    const mergedData = mergeData();

    // const filtered = mergedData.filter(item =>
    //   item.serviceName.toLowerCase().includes(query.toLowerCase()) ||
    //   item.category.toLowerCase().includes(query.toLowerCase())
    // )
    // setFilteredData(filtered);

    const filteredServices = services.filter(service =>
      service.serviceName.toLowerCase().includes(query.toLowerCase())
    );

    const filteredCategories = categories.filter(category =>
      category.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData({ services: filteredServices, categories: filteredCategories });
  }

  useEffect(()=>{
    getServices();
    getCategories();
    // getProviders();
  }, []);

  const handleServicePress = (service)=>{
    console.log('service details ',service);
    console.log('service id ',service._id);
    console.log('service name ',service.serviceName);
    
    navigation.navigate('ServiceProviders', { serviceId: service._id});
  }

  const handleCategoryPress = (category)=>{
    console.log(category);
    console.log('category id ',category._id);
    console.log('category name ',category.category);

    navigation.navigate('ServicesScreen', { category: category.category});
  }

  return (
    <View style={ styles.container}>
      <View style={styles.searchMain}>
        <Ionicons name='search' size={24} style={{ marginHorizontal: 8}}/>
        <TextInput
            placeholder='Search for services you need'
            style={styles.textInput}
            value={searchQuery}
            onChangeText={handleChange}
        />
      </View>
      <View>
        <FlatList
            // data={services}
            data={ searchQuery.length>0 ? filteredData.services : services}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TouchableOpacity 
                style={styles.Item}
                onPress={()=> handleServicePress(item)}
                >
                    <Text style={styles.itemName}>{item.serviceName}</Text>
                    {/* <Text>{item.description}</Text> */}
                    <View >
                      <MaterialIcons 
                      name='arrow-forward-ios'
                      size= {18}
                      // color= '#212121'
                      style={styles.arrow}
                      />
                  </View>
                </TouchableOpacity>
            )}
        />
        <FlatList
            // data={categories}
            data={ searchQuery.length>0 ? filteredData.categories : categories}
            keyExtractor={(item, index) => `category- ${index}`}
            renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.Item}
                  onPress={()=> handleCategoryPress(item)}
                >
                  <View>
                  <Text style={styles.itemName}>{item.category}</Text>
                  </View>
                    
                  <View >
                      <MaterialIcons 
                      name='arrow-forward-ios'
                      size= {18}
                      // color= '#212121'
                      style={styles.arrow}
                      />
                  </View>
                </TouchableOpacity>
            )}
        />
      </View>
      

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
    marginVertical: 20,
    marginHorizontal: 10
},
textInput:{
    fontSize: 16
},
Item:{
  backgroundColor: 'white',
  marginVertical: 5,
  height: 70,
  alignItems: 'center',
  justifyContent: 'space-between',
  marginHorizontal: 10,
  elevation: 4,
  borderRadius: 10,
  flexDirection: 'row'
},
container:{
  backgroundColor: 'white',
  flex: 1,
},
itemName:{
  marginHorizontal: 20,
  fontSize: 16,
  color: '#333',
},
arrow:{
  marginRight: 20
}
})
export default SearchScreen