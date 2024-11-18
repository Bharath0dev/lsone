import { StyleSheet, Text, View, FlatList, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import UpdateProfile from './UpdateProfile';
import AddNewServiceModal from '../Modals/AddNewServiceModal';
import UpdateServicesMOdal from '../Modals/UpdateServicesModal';

const Services = () => {

    const [services, setServices] = useState([]);
    const [showAddNewServiceModal, setShowAddNewServiceModal] = useState(false);
    const [showUpdateServicesModal, setShowUpdateServicesModal] = useState(false);
    const getServices = async () => {
        try {
            const response = await axios.get('http://192.168.1.218:4021/get-services-ad');
        const servicesWithFullURL = response.data.data.map(service => ({
            ...service,
            serviceImage: `http://192.168.1.218:4021/${service.serviceImage}`, // Ensure the full URL
        }));

        setServices(servicesWithFullURL);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    useFocusEffect(
        useCallback(() => {
            getServices();
        },[services])
    )

    const deleteService = async (id) =>{
        // console.log(id);
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Delete canceled"),
                    style: "cancel"
                },{ 
                    text: "Delete",
                    onPress: async () =>{
                        const response = await axios.delete('http://192.168.1.218:4021/deleteService', {params: {id}})
                        console.log(response);
                        if(response.data.status === 'ok'){
                            getServices();
                            Alert.alert('service deleted succesfully');
                        }
                    }                
                }
            ],
            { cancelable: true }
        )
        
    }

    const updateService = async (item) => {
        return(
            <View>
                <UpdateServicesMOdal
                    visible={showUpdateServicesModal}
                    onClose={() => setShowUpdateServicesModal(false)} // Function to close the modal
                    // customerId={customer_Id} serviceId={service_Id} providerId={providerId}
                    data={item}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.flatlistContainer}>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.flatlistItem}>
                            <View style={styles.imageName}>
                                <View>
                                    <Image source={{ uri: item.serviceImage }} style={styles.image}/>
                                </View>

                                <View style={styles.serviceItem}>
                                    <Text style={styles.serviceName}>{item.serviceName}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                    <Text style={styles.category}>{item.category}</Text>
                                    <Text style={styles.servicePrice}>
                                        <FontAwesome name='rupee' size={15} style={styles.rupeeIcon}/>
                                        {' '}{item.price}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.Icons}>
                                <AntDesign name='edit' size={25} color={'#00634B'}
                                    onPress={()=> updateService(item)}
                                    style={styles.editIcon}
                                    />
                                <MaterialCommunityIcons name='delete-outline' size={25} color={'#00634B'}
                                    onPress={()=> deleteService(item._id)}
                                    style={styles.deleteIcon}
                                    />
                            </View>
                        </View>
                    )}
                />
                
            </View>

            {!showAddNewServiceModal && (
                <Button onPress={() => {
                    setShowAddNewServiceModal(true)
                }}
                style={styles.button}
                labelStyle={styles.buttonText}>Add New Service</Button>
            )}
            <AddNewServiceModal
            visible={showAddNewServiceModal}
            onClose={() => setShowAddNewServiceModal(false)} // Function to close the modal
            />
        </View>
    );
};

export default Services;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cancelButton: {
        color: 'red',
        alignSelf: 'center',
        marginLeft: 10,
    },
    dropdown:{
        borderRadius: 0
    },
    flatlistContainer:{
        flex: 1,
        flexDirection: 'row'
    },
    
    flatlistItem:{
        flex: 1,
        flexDirection: 'row',
        marginBottom: 16,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 4,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    serviceItem:{
        flex: 1,
        marginVertical: -8,
    },
    image:{
        height: 90,
        width: 90,
        borderRadius: 10,
        marginHorizontal: 10
    },
    Icons:{
        height: 100,
        justifyContent:'space-around',
    },
    rupeeIcon:{
        color: 'grey',
    },
    inputsContainer:{
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        padding: 10,
        alignSelf: 'center',
        marginVertical: '50%',
        borderRadius: 15,
        borderWidth: 1,
    },
    button:{
        backgroundColor: '#00634B',
        borderRadius: 16
    },
    buttonText:{
        color: 'white',
    },
    imageName:{
        flexDirection: 'row',
        flex: 2,
        justifyContent: 'space-between',
    },
    serviceName:{
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    servicePrice:{
        fontSize: 16,
        fontWeight: '500',
        color:'black',
    }
});
