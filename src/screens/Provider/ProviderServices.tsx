import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProviderServices = () => {
    const [userId, setUserId] = useState('');
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [servicesByProvider, setServicesByProvider] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);

    const getAsyncData = async () => {
        const asyncUserId = await AsyncStorage.getItem('userId');
        console.log('Fetched Async userId:', asyncUserId);
        setUserId(asyncUserId);
    };

    useEffect(() => {
        getAsyncData();
    }, []);

    const fetchServicesData = async () => {
        try {
            const response = await axios.get('http://192.168.1.218:4021/services');
            setCategories(response.data.categories);
            console.log(response.data);
            setServices(response.data.categorizedServices);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const getServicesByProviders = async () => {
        if (!userId) {
            console.log('User ID is not set. Skipping fetch.');
            return;
        }

        try {
            const response = await axios.get('http://192.168.1.218:4021/getServicesByProviders', { params: { id: userId } });
            setServicesByProvider(response.data.data);
            console.log('Services by provider:', response.data.data);
        } catch (error) {
            console.log('getServicesByProviders error:', error);
        }
    };

    useEffect(() => {
        fetchServicesData();
    }, []);

    useEffect(() => {
        if (userId) {
            getServicesByProviders();
        }
    }, [userId]);

    const handleServiceSelect = async () => {
        if (selectedService) {
            console.log("Selected Service ID:", selectedService);
            try {
                const response = await axios.post(`http://192.168.1.218:4021/services/${selectedService}/provider`, {
                    providerId: userId
                });
                console.log(response.data);
                getServicesByProviders();
                setShowDropDown(false);
            } catch (error) {
                console.error('Error adding service provider:', error);
            }
        }
    };

    const handleShowDropDown = () => {
        setShowDropDown(!showDropDown);
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.servicesContainer}>
                <View style={styles.headingView}>
                    <Text style={styles.heading}>My Services</Text>
                </View>
                <FlatList
                    data={servicesByProvider}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.flatListContainer}>
                            <Text style={styles.serviceName}>{item.serviceName}</Text>
                            <Text style={styles.serviceText}>{item.category}</Text>
                            <Text style={styles.serviceText}>{item.price}</Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.buttonContainer}>

                {!showDropDown ? (
                    <Button
                    style={styles.button}
                    labelStyle={styles.buttonLabels}
                    // onPress={handleShowDropDown}
                    onPress={()=>setShowDropDown(true)}
                    >
                        Add Service
                    </Button>
                ):(null)}
                
                
            </View>

            {showDropDown && (
                <View style={styles.ddContainer}>
                    <View style={styles.dropdownContainer}>
                        <View style={styles.categorySelectList}>
                            <SelectList
                                setSelected={(value) => {
                                    setSelectedCategory(value);
                                    setSelectedService(''); // Reset service when category changes
                                }}
                                data={categories.map(category => ({ key: category, value: category }))}
                                save="value"
                                placeholder='Select category'
                                boxStyles={styles.dropdown}
                                search={false}
                            />
                        </View>
                        <View style={styles.categorySelectList}>
                            <SelectList
                                setSelected={setSelectedService}
                                data={selectedCategory && services[selectedCategory] ? services[selectedCategory].map(service => ({ key: service._id, value: service.serviceName })) : []}
                                save="value"
                                placeholder='Select service'
                                boxStyles={styles.dropdown}
                                search={false}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.button}
                            labelStyle={styles.buttonLabels}
                            onPress={handleServiceSelect}
                            disabled={!selectedService}
                        >
                            Submit
                        </Button>
                        <Button
                            style={styles.button}
                            labelStyle={styles.buttonLabels}
                            onPress={()=>setShowDropDown(false)}
                        >
                            Cancel
                        </Button>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        flex: 1,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headingView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    servicesContainer: {},
    flatListContainer: {
        backgroundColor: 'white',
        elevation: 3,
        margin: 10,
        padding: 10,
        borderRadius: 8,
    },
    serviceName: {
        fontSize: 16,
        color: 'black',
        fontWeight: '500',
        marginVertical: 8,
    },
    serviceText:{
        marginBottom: 8,
    },
    ddContainer: {
        position: 'absolute',
        top: '40%',
        left: '18%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        width: '90%',
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        marginHorizontal: 'auto',
        marginVertical: 6,
    },
    handleDropDownButton: {
        backgroundColor: '#00634B',
        marginHorizontal: 10,
        borderRadius: 10,
        width: 200,
    },
    buttonLabels: {
        color: 'white',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#00634B',
        borderRadius: 10,
        marginHorizontal: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
    },
});

export default ProviderServices;
