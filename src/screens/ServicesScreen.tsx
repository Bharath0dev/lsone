import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const ServicesScreen = ({ route }) => {
  const navigation = useNavigation();

  const { category } = route.params;
  console.log(category);
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [numColumns, setNumColumns] = useState(2);

  const getServices = async () => {
    try {
        const response = await axios.get('http://192.168.1.218:4021/get-services', { params: { category }});
        // setServices(response.data.data);
        // console.log(response.data.data);

        const servicesWithImage = response.data.data.map(service => ({
          ...service,
          serviceImage: `http://192.168.1.218:4021/${service.serviceImage}`, // Ensure the full URL
        }));

      setServices(servicesWithImage);
    } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services');
    }finally {
      setLoading(false);
    }
};

useEffect(() => {
  getServices();
}, []);

if (loading) {
  return <ActivityIndicator size="large" color="#0000ff" />;
}

if (error) {
  return (
    <View style={styles.container}>
      <Text>{error}</Text>
    </View>
  );
}

  return (
    <View style={styles.container}>
      <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
              <TouchableOpacity style={styles.serviceItem}
              onPress={() => navigation.navigate('ServiceProviders', { serviceId: item._id, serviceName:item.serviceName, serviceImage: item.serviceImage, serviceDescription: item.description })}
              >
                  <View>
                    <Image source={{ uri: item.serviceImage }} style={styles.image}/>
                  </View>
                  <View style={styles.serviceText}> 
                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.price}>
                    <FontAwesome name='rupee' size={14} color='black' />{' '}
                      {item.price}</Text>
                  </View>
                  
                  {/* <Text style={styles.category}>{item.category}</Text> */}

                  {/* <Text>{item.description}</Text> */}
              </TouchableOpacity>
          )}
          // numColumns={numColumns}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items available</Text>
            </View>
        }   
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  serviceItem: {
    flex: 1,
    margin: 8,
    // padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    // height: 270,
    elevation: 4,
    paddingBottom: 15
  },
  image:{
    height: 190,
    width: '100%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginBottom: 10
  },
  serviceName:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  serviceText:{
    marginHorizontal: 10,
    rowGap: 5,
  },
  price:{
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  
})

export default ServicesScreen

