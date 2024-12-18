import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-native-paper';
import Scheduler from '../components/Scheduler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StarRatingComponent from '../components/StarRatingComponent';

const imageMap = {
    'Plumbing': require('../assets/serviceImages/Plumbing.jpg'),
    'Carpentry': require('../assets/serviceImages/AC-Repair.jpg'),

    'AC Repair': require('../assets/serviceImages/AC-Repair.jpg'),
    'Washing Machine Repair': require('../assets/serviceImages/Washing-Machine-Repair.jpg'),
    'TV Repair': require('../assets/serviceImages/TV-Repair.jpg'),
    
    'TV Mounting': require('../assets/serviceImages/TV-Mounting.jpg'),
    'AC Mounting': require('../assets/serviceImages/AC-Mounting.jpg'),
    'Ceiling Fan Installation': require('../assets/serviceImages/CeilingFanInstallation&Mounting.jpg'),
    'Doorbell Installation': require('../assets/serviceImages/Doorbell-Installation.jpg'),
    'CC Camera Installation': require('../assets/serviceImages/CC-Camera-Installation.jpg'),

    'Exterior Painting': require('../assets/serviceImages/Exterior-Painting.jpg'),
    'Interior Painting': require('../assets/serviceImages/Interior-Painting.jpg'),

    'Floor Cleaning': require('../assets/serviceImages/Floor-Cleaning.jpg'),
    'Deep Cleaning': require('../assets/serviceImages/Deep-Cleaning.jpg'),
    'Garage Cleaning': require('../assets/serviceImages/Garage-Cleaning.jpg'),
    'AC Cleaning': require('../assets/serviceImages/AC-Cleaning.jpg'),
    'Carpet Cleaning': require('../assets/serviceImages/Carpet-Cleaning.jpg'),
    'Move In Cleaning': require('../assets/serviceImages/Move-In-Cleaning.jpg'),
    'Move Out Cleaning': require('../assets/serviceImages/Move-Out-Cleaning.jpg'),

    'Office Cleaning': require('../assets/serviceImages/Office-Cleaning.jpg'),
    'Office Desks Assembling': require('../assets/serviceImages/Office-Desks-Assembling.png'),
    'Office Chairs Assembling': require('../assets/serviceImages/Office-Desks-Assembling.png'),

    'Book Shelf Assembling': require('../assets/serviceImages/Book-Shelf-Assembling.jpg'),
    'Desk Assembling': require('../assets/serviceImages/Desk-Assembling.jpg'),
    'Wardrobe Assembling': require('../assets/serviceImages/Wardrobe-Assembling.jpg'),
    'Couch Assembling': require('../assets/serviceImages/Couch-Assembling.jpg'),

    'Furniture Removal': require('../assets/serviceImages/Furniture-Removal.jpg'),
    'Appliance Removal': require('../assets/serviceImages/Appliance-Removal.jpg'),
    'Furniture Movers': require('../assets/serviceImages/Furniture-Movers.jpg'),
    'Storage Unit Movers': require('../assets/serviceImages/Storage-Unit-Movers.jpg'),

    'Tree Trimming Service': require('../assets/serviceImages/Tree-Trimming-Service.jpg'),
    'Weed Removal': require('../assets/serviceImages/Weed-Removal-Service.jpeg'),
}


const ServiceProviders = ({ route }) => {
    const { serviceId, serviceName, serviceImage, serviceDescription } = route.params;
    console.log(serviceId, serviceName);

    const [providers, setProviders] = useState([]);

    const [customerId, setCustomerId] = useState('');
    // const [providerId, setProviderId] = useState('');

    const [serviceMainImageUri, setServiceMainImageUri] = useState('');

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const [showFilterModal, setShowFilterModal] = useState(false);

    const navigation = useNavigation();

    const getProviders = async () => {
        try {
            const response = await axios.get('http://192.168.1.218:4021/getProviders', { params: { serviceId } });
            console.log(response.data);
            setProviders(response.data.serviceProviderId);
            console.log(response.data.serviceProviderId);
            // setProviderId(response.data.serviceProviderId[0]._id);
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    const getUserId = async ()=>{
        const userId= await AsyncStorage.getItem('userId');
        setCustomerId(userId);
    }

    useEffect(() => {
        getProviders();
    }, [serviceId]);

    useEffect(()=>{
        getUserId();
    }, [])

    // useEffect(()=>{
    //     if(serviceName){
    //         const uri = serviceMainImages.forEach(element => {
    //             // console.log('service image name uri-',element.name);
    //             if(element.name == serviceName){
    //                 // console.log('matched');
    //                 // console.log('matched', element.uri);
    //                 setServiceMainImageUri(imageMap[serviceName]);

    //             }
    //         });
    //     }
    // })

    useEffect(() => {
        if (serviceName) {
            // Use imageMap to find the image associated with the serviceName
            const imageUri = imageMap[serviceName]   // Fallback to default image if service not found
            setServiceMainImageUri(imageUri);
        }
    }, [serviceName]);


    // Function to truncate description and show only the first 20 words
    const getTruncatedDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return description;
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    // const handleSortData = () =>{
    //     console.log('sorted');
    //     providers.filter((item)=> {
    //         console.log(item.providerDetails.rating)
    //     })
    // }

    const handleSortData = () => {
        console.log('Sorting providers by rating');
        // Sort the providers by rating in descending order
        const sortedProviders = [...providers].sort((a, b) => {
            // Ensure that the rating exists for both providers, and sort based on rating
            const ratingA = a.providerDetails?.rating || 0;
            const ratingB = b.providerDetails?.rating || 0;
            return ratingB - ratingA;  // Sort in descending order
        });
    
        // Update the state with the sorted data
        setProviders(sortedProviders);
        setShowFilterModal(false);
    };
    

    const FilterModal = () => {

        
        return(
                <Modal
                    visible={showFilterModal}
                    transparent={true} // Ensures the background is semi-transparent
                    animationType="fade" // You can choose animation like fade, slide, etc.
                >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setShowFilterModal(false)} style={{alignItems: 'flex-end'}}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{ handleSortData()}} style={{borderWidth: 1, borderRadius: 8,padding: 10, marginVertical: 10, alignItems: 'center'}}>
                            <Text style={{fontSize: 20, color: '#333', fontWeight: '600'}}>Sort By Rating</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Modal>
        )
    }

    const handleShowModal = () => {
        console.log('showing');
        setShowFilterModal(true);
    }
    
    return (
        <View style={styles.container}>
            {/* <Text>ServiceProviders</Text>
            <Text>{serviceId}</Text>
            <Text>{serviceName}</Text> */}

            <View>
                {/* <Image style= {styles.mainImage} source={ require('../assets/serviceImages/AC-Repair.jpg')  }/> */}
                {serviceMainImageUri && <Image style={styles.mainImage} source={serviceMainImageUri} />}
            </View>

            <View style={styles.header}>
                <Text style={[styles.headerText, {color: '#333'}]}>{serviceName}</Text>
            </View>

            {/* <View style={styles.description}>
                <Text style={{fontSize: 15, color: '#333', fontWeight: '400'}}>{serviceDescription}</Text>
            </View> */}

            <View style={styles.description}>
                <Text style={{ fontSize: 15, color: '#333', fontWeight: '400' }}>
                    {isDescriptionExpanded ? serviceDescription : getTruncatedDescription(serviceDescription)}
                    {serviceDescription.split(' ').length > 20 && (
                    <TouchableOpacity onPress={toggleDescription}>
                        <Text style={{ color: 'blue',marginBottom: -4 }}>
                            {isDescriptionExpanded ? 'See Less' : ' See More'}
                        </Text>
                    </TouchableOpacity>
                    )}
                </Text>

            </View>

            <View style={styles.header}>
            <Text style={styles.headerText}>{serviceName} Providers</Text>
            <TouchableOpacity onPress={()=>handleShowModal()}>
                <Image source={ require('../assets/filter.png')} style={styles.filterImage}/>
            </TouchableOpacity>
            </View>

            <View>
                <FlatList
                    data={providers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <>
                        
                        <TouchableOpacity 
                        style={styles.flatlistContainer}
                        onPress={()=>{navigation.navigate('ProviderDetailsScreen', {providerId: item._id, customer_Id: customerId, service_Id: serviceId })}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{ marginHorizontal: 10}}>
                                        <Image source={{uri: `http://192.168.1.218:4021/${item.profileImage}`}}
                                        style={{height: 90, width: 90, borderRadius: 8}}/>
                                </View>
                                <View style={styles.flatlistText}>
                                    <Text style={styles.text}>{item.name}</Text>
                                    <Text style={styles.text}>{item.email}</Text>
                                    {/* <Text style={styles.text}>{item.mobile}</Text> */}
                                    {/* <Text>{<StarRatingComponent rating={item.providerDetails.rating}/>} </Text> */} 
                                    {item.providerDetails.rating ? (
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 10}}> 
                                        {/* Display only stars */}
                                        <Text>{<StarRatingComponent rating={item.providerDetails.rating} displayType="stars" />}</Text>
                                        
                                        <Text>{item.providerDetails.rating}</Text>
                                    </View>
                                    ): (
                                        <Text>No ratings</Text>
                                    )}
                                    
                                </View>
                                
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
                      </>
                        
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No providers available</Text>
                        </View>
                    }       
                />
            </View>
            <FilterModal/>
        </View>
    );
};

const styles = StyleSheet.create({
    flatlistContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 10,
        height: 120,
        alignItems: 'center',
        elevation: 4,
        shadowColor: 'black'       
    },
    container:{
        flex: 1,
        backgroundColor: 'white'
    },
    header:{
        height: 50,
        justifyContent: 'space-between',
        // alignItems: 'center'
        flexDirection: 'row',
        marginHorizontal: 15
    },
    headerText:{
        fontSize: 19,
        fontWeight: 'bold'
    },
    filterImage:{
        height: 30,
        width: 30
    },
    flatlistText:{
        // margin: 10,
    },
    text:{
        marginBottom: 6,
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
    },
    mainImage:{
        height: 210,
        width: '95%',
        margin: 10,
        borderRadius: 8
    },
    arrow:{
        marginRight: 20
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
      description:{
        margin: 15,
        
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '80%',
        // height: 200,
    },
    // Close button styling
    closeButton: {
        fontSize: 16,
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default ServiceProviders;
