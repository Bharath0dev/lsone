import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UpdateServicesMOdal = ({visible, onClose, data}) => {

    const [services, setServices] = useState([]);
    const [serviceId, setServiceId] = useState(data._id);
    const [serviceName, setServiceName] = useState(data.serviceName);
    const [description, setDescription] = useState(data.description);
    const [category, setCategory] = useState(data.category);
    const [price, setPrice] = useState(data.price);
    const [imageUri, setImageUri] = useState(data.serviceImage);

    const [categories, setCategories] = useState([]);
    const [shownNewCategory, setShowNewCategory] = useState(false);


    const fetchServicesData = async () => {
        try {
            const response = await axios.get('http://192.168.1.218:4021/services');
            setCategories(response.data.categories);
            // console.log(response.data.categories);
            console.log(response.data);
            setServices(response.data.categorizedServices);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        fetchServicesData();
    }, []);


    // FormData creation should be here, using updated state
    const submitUpdatedData = async() => {
        const formData = new FormData();
        if (imageUri) {
            formData.append('image', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });
        }
        
        formData.append('serviceId', serviceId); // Using item._id directly
        formData.append('serviceName', serviceName);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);

        console.log(formData);
    
        try {
            const response = await axios.post('http://192.168.1.218:4021/updateService', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data); // Additional logging
            if (response.data.status === 'ok') {
                Alert.alert('Service updated successfully!');
                setServiceName('');
                setDescription('');
                setCategory('');
                setImageUri(null); 
                setPrice('');
                onClose();
            } else {
                Alert.alert('Update failed:', response.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            console.log('Error response data:', error.response?.data);
            Alert.alert('Failed to update service. Please try again.');
        }
    }

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const asset = response.assets[0]; // Get the first selected asset
                const source = { uri: asset.uri };
                setImageUri(source.uri);
                // uploadImage(source.uri, asset.type, asset.fileName);
            }
        });
    };


  return (
    <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose} 
            >
                <View style={styles.modalContainer}>
                <View style={ styles.inputsContainer}>
                <Button onPress={onClose} style={{ margin: 20, alignItems: 'flex-end' }}>Close</Button>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Service Name"
                        value={serviceName}
                        onChangeText={setServiceName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Description"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Price"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType='numeric'
                    />

                    {shownNewCategory ? (
                        <TextInput
                        style={styles.input}
                        placeholder="Enter New Category"
                        value={category}
                        onChangeText={setCategory}
                        />
                    ) : (
                        <View style={styles.dropdownContainer}>
                        <View style={styles.categorySelectList}>
                        <SelectList 
                            setSelected={(value) => {
                                // setSelectedCategory(value);
                                setCategory(value);
                                // setSelectedService(''); // Reset service when category changes
                            }} 
                            data={categories.map(category => ({ key: category, value: category }))} 
                            save="value"
                            placeholder='Select category'
                            boxStyles={styles.dropdown}
                            search={false}
                        />
                        </View>
                    </View>
                    
                    )}
                    <View style={styles.buttonContainer}>
                        {shownNewCategory ? (
                            <Button onPress={()=> setShowNewCategory(false)}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                            >Select a Category</Button>
                            ): (
                            <Button onPress={()=> setShowNewCategory(true)}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                            >New Category</Button>
                            )}
                    </View>   

                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={selectImage}
                            >
                            <MaterialCommunityIcons name='image-edit' size={25} color='#00634B'/>
                        </TouchableOpacity>
                        
                        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 2, }} />}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button 
                            onPress={onClose}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >Cancel</Button>
                        <Button 
                            onPress={ ()=>{submitUpdatedData()}}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >Submit</Button>
                    </View>

                </View>
                </View>
            </Modal>
        </View>
  )
}

export default UpdateServicesMOdal

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    modalContainer:{
        flex:1,
        backgroundColor: 'white',
      },
      inputsContainer:{
        margin: 15
      },
    input: {
        height: 45,
        borderColor: '#00634B',
        borderWidth: 1.5,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button:{
        backgroundColor: '#00634B',
        borderRadius: 8
    },
    buttonText:{
        color: 'white',
    },
    dropdown:{
        borderColor: '#00634B',
        borderWidth: 1.5
    }
})