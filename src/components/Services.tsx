// import { StyleSheet, Text, View, FlatList, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
// import React, { useCallback, useEffect, useState } from 'react';
// import axios from 'axios';
// import { SelectList } from 'react-native-dropdown-select-list';
// import { useFocusEffect } from '@react-navigation/native';
// import { Button } from 'react-native-paper';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { launchImageLibrary } from 'react-native-image-picker';
// import UpdateProfile from './UpdateProfile';

// const Services = () => {

//     const [services, setServices] = useState([]);
//     const [serviceId, setServiceId] = useState('');
//     const [serviceName, setServiceName] = useState('');
//     const [description, setDescription] = useState('');
//     const [category, setCategory] = useState('');
//     const [price, setPrice] = useState('');
//     const [showInputs, setShowInputs] = useState(false); 

//     const [imageUri, setImageUri] = useState(null);

//     const [categories, setCategories] = useState([]);
//     // const [services, setServices] = useState({});
//     // const [selectedCategory, setSelectedCategory] = useState('');
//     // const [newCategory, setNewCategory] = useState('');
//     const [shownNewCategory, setShowNewCategory] = useState(false);

//     const [editable, setEditable] = useState(false);

//     const getServices = async () => {

//         try {
//             const response = await axios.get('http://192.168.1.218:4021/get-services-ad');
//             // setServices(response.data.data);
//             // console.log(response.data.data);

//             // Assuming response.data.data contains the array of services
//         const servicesWithFullURL = response.data.data.map(service => ({
//             ...service,
//             serviceImage: `http://192.168.1.218:4021/${service.serviceImage}`, // Ensure the full URL
//         }));

//         setServices(servicesWithFullURL);
//         } catch (error) {
//             console.error('Error fetching services:', error);
//         }
//     };


//     const addService = async () => {
//         if (!serviceName || !description || !category || !imageUri) {
//             Alert.alert('Please fill in all fields.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('image', {
//             uri: imageUri,
//             type: 'image/jpeg', // Use the provided type, default to 'image/jpeg'
//             name: 'photo.jpg', // Use the provided name, default to 'photo.jpg'
//         });

//         formData.append('serviceName', serviceName);
//         formData.append('description', description);
//         formData.append('category', category);
//         formData.append('price', price);

//         console.log(formData);
//         try {
//             // await axios.post('http://192.168.1.218:4021/new-service', {
//             //     serviceName,
//             //     description,
//             //     category,
//             // });

//             await axios.post('http://192.168.1.218:4021/new-service', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             Alert.alert('Service added successfully!');
//             console.log(formData);
//             getServices(); 
//             setServiceName('');
//             setDescription('');
//             setCategory('');
//             // selectedCategory('');
//             setShowInputs(false);
//             setEditable(false);
//             setImageUri(null); 
//             setPrice('');
//         } catch (error) {
//             console.error('Error adding service:', error);
//             Alert.alert('Failed to add service.');
//         }
//     };

//     // useEffect(() => {
//     //     getServices();
//     // }, []);

//     useFocusEffect(
//         useCallback(() => {
//             getServices();
//         },[services])
//     )

//     const fetchServicesData = async () => {
//         try {
//             const response = await axios.get('http://192.168.1.218:4021/services');
//             setCategories(response.data.categories);

//             // console.log(response.data.categories);
//             console.log(response.data);
//             setServices(response.data.categorizedServices);
//         } catch (error) {
//             console.error('Error fetching services:', error);
//         }
//     };

//     useEffect(() => {
//         fetchServicesData();
//     }, []);

//     const deleteService = async (id) =>{
//         // console.log(id);
//         Alert.alert(
//             "Confirm Deletion",
//             "Are you sure you want to delete?",
//             [
//                 {
//                     text: "Cancel",
//                     onPress: () => console.log("Delete canceled"),
//                     style: "cancel"
//                 },{ 
//                     text: "Delete",
//                     onPress: async () =>{
//                         const response = await axios.delete('http://192.168.1.218:4021/deleteService', {params: {id}})
//                         console.log(response);
//                         if(response.data.status === 'ok'){
//                             getServices();
//                             Alert.alert('service deleted succesfully');
//                         }
//                     }                
//                 }
//             ],
//             { cancelable: true }
//         )
        
//     }


//     const [selectedService, setSelectedService] = useState(null);


//     const updateService = async (item) => {

//         setEditable(true);
//         setShowInputs(true);
//         setSelectedService(item);
//         setServiceId(item._id);
//         setServiceName(item.serviceName);
//         setDescription(item.description);
//         setPrice(item.price);
//         setCategory(item.category);
//         setImageUri(item.serviceImage);

//     }
    
//     // FormData creation should be here, using updated state
//     const submitUpdatedData = async() => {
//         const formData = new FormData();
//         if (imageUri) {
//             formData.append('image', {
//                 uri: imageUri,
//                 type: 'image/jpeg',
//                 name: 'photo.jpg',
//             });
//         }
        
//         formData.append('serviceId', serviceId); // Using item._id directly
//         formData.append('serviceName', serviceName);
//         formData.append('description', description);
//         formData.append('category', category);
//         formData.append('price', price);

    
// console.log(formData);
    
//         try {
//             const response = await axios.post('http://192.168.1.218:4021/updateService', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
    
//             if (response.data.status === 'ok') {
//                 getServices();
//                 Alert.alert('Service updated successfully!');
//                 setEditable(false);

//                 setServiceName('');
//                 setDescription('');
//                 setCategory('');
//                 // selectedCategory('');
//                 setShowInputs(false);
//                 setEditable(false);
//                 setImageUri(null); 
//                 setPrice('');
//             } else {
//                 Alert.alert('Update failed:', response.data.message || 'Unknown error');
//             }
//         } catch (error) {
//             console.error('Error updating service:', error.response?.data || error);
//             Alert.alert('Failed to update service. Please try again.');
//         }
//     }


//     const selectImage = () => {
//         launchImageLibrary({ mediaType: 'photo' }, (response) => {
//             if (response.didCancel) {
//                 console.log('User cancelled image picker');
//             } else if (response.error) {
//                 console.log('ImagePicker Error: ', response.error);
//             } else {
//                 const asset = response.assets[0]; // Get the first selected asset
//                 const source = { uri: asset.uri };
//                 setImageUri(source.uri);
//                 // uploadImage(source.uri, asset.type, asset.fileName);
//             }
//         });
//     };


//     return (
//         <View style={styles.container}>
//             <View style={styles.flatlistContainer}>
//                 <FlatList
//                     data={services}
//                     keyExtractor={(item) => item._id}
//                     renderItem={({ item }) => (
//                         <View style={styles.flatlistItem}>
//                             <View style={styles.imageName}>
//                                 <View>
//                                     <Image source={{ uri: item.serviceImage }} style={styles.image}/>
//                                 </View>

//                                 <View style={styles.serviceItem}>
//                                     <Text style={styles.serviceName}>{item.serviceName}</Text>
//                                     <Text style={styles.description}>{item.description}</Text>
//                                     <Text style={styles.category}>{item.category}</Text>
//                                     <Text style={styles.servicePrice}>
//                                         <FontAwesome name='rupee' size={15} style={styles.rupeeIcon}/>
//                                         {' '}{item.price}</Text>
//                                 </View>
//                             </View>
                            
//                             <View style={styles.Icons}>
//                                 <AntDesign name='edit' size={25} color={'#00634B'}
//                                     onPress={()=> updateService(item)}
//                                     style={styles.editIcon}
//                                     />
//                                 <MaterialCommunityIcons name='delete-outline' size={25} color={'#00634B'}
//                                     onPress={()=> deleteService(item._id)}
//                                     style={styles.deleteIcon}
//                                     />
//                             </View>
//                         </View>
//                     )}
//                 />
                
//             </View>
            
//             {!showInputs && (
//                 <Button onPress={() => {
//                     setShowInputs(true)
//                     setShowNewCategory(false)

//                     setEditable(false); // Ensure we're adding a new service
//                     setServiceName('');
//                     setDescription('');
//                     setCategory('');
//                     setPrice('');
//                     setImageUri(null);
//                 }}
//                 style={styles.button}
//                 labelStyle={styles.buttonText}>Add New Service</Button>
//             )}

//             {showInputs && (
//                 <View style={ styles.inputsContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Service Name"
//                         value={serviceName}
//                         onChangeText={setServiceName}
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Description"
//                         value={description}
//                         onChangeText={setDescription}
//                     />

//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Price"
//                         value={price}
//                         onChangeText={setPrice}
//                         keyboardType='numeric'
//                     />

//                     {shownNewCategory ? (
//                         <TextInput
//                         style={styles.input}
//                         placeholder="Enter New Category"
//                         value={category}
//                         onChangeText={setCategory}
//                         />
//                     ) : (
//                         <View style={styles.dropdownContainer}>
//                         <View style={styles.categorySelectList}>
//                         <SelectList 
//                             setSelected={(value) => {
//                                 // setSelectedCategory(value);
//                                 setCategory(value);
//                                 // setSelectedService(''); // Reset service when category changes
//                             }} 
//                             data={categories.map(category => ({ key: category, value: category }))} 
//                             save="value"
//                             placeholder='Select category'
//                             boxStyles={styles.dropdown}
//                             search={false}
//                         />
//                         </View>
//                         {/* <View style={styles.categorySelectList}>
//                             <SelectList 
//                                 setSelected={setSelectedService} 
//                                 data={selectedCategory && services[selectedCategory] ? services[selectedCategory].map(service => ({ key: service._id, value: service.serviceName })) : []}  
//                                 save="value"
//                                 placeholder='Select service'
//                                 boxStyles={styles.dropdown}
//                                 search={false}
//                             />
//                         </View> */}
//                     </View>
                    
//                     )}
                    

//                     <View style={styles.buttonContainer}>
//                         {shownNewCategory ? (
//                             <Button onPress={()=> setShowNewCategory(false)}
//                             style={styles.button}
//                             labelStyle={styles.buttonText}
//                             >Select a Category</Button>
//                             ): (
//                             <Button onPress={()=> setShowNewCategory(true)}
//                             style={styles.button}
//                             labelStyle={styles.buttonText}
//                             >New Category</Button>
//                             )}
//                     </View>   


//                     <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//                         <Button onPress={selectImage}
//                         style={styles.button}
//                         labelStyle={styles.buttonText}
//                         >choose file</Button>
//                         {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 2, }} />}
//                     </View>


//                     <View style={styles.buttonContainer}>
//                         <Button onPress={ !editable ? (()=>{addService()}):(()=>{submitUpdatedData()})}
//                             style={styles.button}
//                             labelStyle={styles.buttonText}
//                             >Submit</Button>
//                         <TouchableOpacity onPress={() => setShowInputs(false)}>
//                             <Text style={styles.cancelButton}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             )}
//             <View>
//             {editable && (
//                 <View style={ styles.inputsContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Service Name"
//                         value={serviceName}
//                         onChangeText={setServiceName}
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Description"
//                         value={description}
//                         onChangeText={setDescription}
//                     />

//                     <TextInput
//                         style={styles.input}
//                         placeholder="Price"
//                         value={price}
//                         onChangeText={setPrice}
//                         keyboardType='numeric'
//                     />

//                     {shownNewCategory ? (
//                         <TextInput
//                         style={styles.input}
//                         placeholder="Category"
//                         value={category}
//                         onChangeText={setCategory}
//                         />
//                     ) : (
//                     <View style={styles.dropdownContainer}>
//                         <View style={styles.categorySelectList}>
//                         <SelectList 
//                             setSelected={(value) => {
//                                 // setSelectedCategory(value);
//                                 setCategory(value);
//                                 // setSelectedService(''); // Reset service when category changes
//                             }} 
//                             data={categories.map(category => ({ key: category, value: category }))} 
//                             save="value"
//                             placeholder='Select category'
//                             boxStyles={styles.dropdown}
//                             search={false}
//                         />
//                         </View>
//                     </View>
                    
//                     )}
                    

//                     <View style={styles.buttonContainer}>
//                         {shownNewCategory ? (
//                             <Button onPress={()=> setShowNewCategory(false)}>Select a Category</Button>
//                             ): (
//                             <Button onPress={()=> setShowNewCategory(true)}>New Category</Button>
//                             )}
//                     </View>   


//                     <View style={{ width: '100%', height: 100, alignItems: 'center' }}>
//                         {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
//                         <Button onPress={selectImage}>choose file</Button>
//                     </View>


//                     <View style={styles.buttonContainer}>
//                         <Button onPress={ !editable ? (()=>{addService()}):(()=>{submitUpdatedData()}) }>Submit</Button>
//                         <TouchableOpacity onPress={() => setEditable(false)}>
//                             <Text style={styles.cancelButton}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             )}
//             </View>


//         </View>
//     );
// };

// export default Services;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: 'white',
//     },
//     input: {
//         height: 45,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 12,
//         paddingHorizontal: 8,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 12,
//     },
//     cancelButton: {
//         color: 'red',
//         alignSelf: 'center',
//         marginLeft: 10,
//     },
//     dropdown:{
//         borderRadius: 0
//     },
//     flatlistContainer:{
//         flex: 1,
//         flexDirection: 'row'
//     },
    
//     flatlistItem:{
//         flex: 1,
//         flexDirection: 'row',
//         marginBottom: 16,
//         paddingVertical: 10,
//         backgroundColor: 'white',
//         borderRadius: 8,
//         elevation: 4,
//         justifyContent: 'space-around',
//         alignItems: 'center',
//     },
//     serviceItem:{
//         flex: 1,
//         marginVertical: -8,
//     },
//     image:{
//         height: 90,
//         width: 90,
//         borderRadius: 10,
//         marginHorizontal: 10
//     },
//     Icons:{
//         // flexDirection: 'row'
        
//         height: 100,
//         justifyContent:'space-around',
//     },
//     rupeeIcon:{
//         color: 'grey',
//     },
//     inputsContainer:{
//         backgroundColor: 'white',
//         position: 'absolute',
//         width: '100%',
//         padding: 10,
//         alignSelf: 'center',
//         marginVertical: '50%',
//         borderRadius: 15,
//         borderWidth: 1,
//     },
//     button:{
//         backgroundColor: '#00634B',
//         borderRadius: 16
//     },
//     buttonText:{
//         color: 'white',
//     },
//     imageName:{
//         flexDirection: 'row',
//         flex: 2,
//         justifyContent: 'space-between',
//     },
//     serviceName:{
//         fontSize: 18,
//         fontWeight: '600',
//         color: 'black',
//     },
//     servicePrice:{
//         fontSize: 16,
//         fontWeight: '500',
//         color:'black',
//     }

// });


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
import UpdateServicesModal from '../Modals/UpdateServicesModal';

const Services = () => {

    const [services, setServices] = useState([]);
    const [showAddNewServiceModal, setShowAddNewServiceModal] = useState(false);
    const [showUpdateServicesModal, setShowUpdateServicesModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);


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

    const handleEditPress = (item) => {
        setSelectedService(item);
        setShowUpdateServicesModal(true);
    };


    // Function to truncate description and show only the first 20 words
    const getTruncatedDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 15) {
            return words.slice(0, 15).join(' ') + '...';
        }
        return description;
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };
    

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
                                    {/* <Text style={styles.description}>{item.description}</Text> */}

                                    <View style={styles.description}>
                                    <Text style={{ fontSize: 13, color: '#333', fontWeight: '400' }}>
                                        {isDescriptionExpanded ? item.description : getTruncatedDescription(item.description)}
                                        {item.description.split(' ').length > 15 && (
                                        <TouchableOpacity onPress={toggleDescription}>
                                            <Text style={{ color: 'blue',marginBottom: -4 }}>
                                                {isDescriptionExpanded ? 'See Less' : ' See More'}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                    </Text>
                                    </View>

                                    <Text style={styles.category}>{item.category}</Text>
                                    <Text style={styles.servicePrice}>
                                        <FontAwesome name='rupee' size={15} style={styles.rupeeIcon}/>
                                        {' '}{item.price}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.Icons}>
                                <AntDesign name='edit' size={25} color={'#00634B'}
                                    onPress={() => handleEditPress(item)}
                                    style={styles.editIcon}
                                    />
                                <MaterialCommunityIcons name='delete-outline' size={25} color={'#00634B'}
                                    onPress={()=> deleteService(item._id)}
                                    style={styles.deleteIcon}
                                    />
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                            <Text>No services available</Text>
                        </View>
                    
                } 
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

            {showUpdateServicesModal && selectedService && (
                <UpdateServicesModal
                    visible={showUpdateServicesModal}
                    onClose={() => setShowUpdateServicesModal(false)}
                    data={selectedService}
                />
            )}
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

