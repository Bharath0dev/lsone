import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddNewServiceModal = ({visible, onClose,}) => {

    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState(null);

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


    const addService = async () => {
        if (!serviceName || !description || !category || !imageUri) {
            Alert.alert('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg', // Use the provided type, default to 'image/jpeg'
            name: 'photo.jpg', // Use the provided name, default to 'photo.jpg'
        });

        formData.append('serviceName', serviceName);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);

        console.log(formData);
        try {
            await axios.post('http://192.168.1.218:4021/new-service', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            Alert.alert('Service added successfully!');
            console.log(formData);
            setServiceName('');
            setDescription('');
            setCategory('');
            setImageUri(null); 
            setPrice('');
            onClose();
        } catch (error) {
            console.error('Error adding service:', error);
            Alert.alert('Failed to add service.');
        }
    };

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
                        multiline={true}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline={true}
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
                        multiline={true}
                        />
                    ) : (
                    <View style={styles.dropdownContainer}>
                        <SelectList 
                            setSelected={(value) => {
                                setCategory(value);
                            }} 
                            data={categories.map(category => ({ key: category, value: category }))} 
                            save="value"
                            placeholder='Select category'
                            boxStyles={styles.dropdown}
                            search={false}
                        />
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
                        <TouchableOpacity
                        onPress={selectImage}
                        style={{marginRight: 10}}
                        >
                        <MaterialCommunityIcons name='image-plus' size={35} color='#00634B'/>
                        </TouchableOpacity>
                    </View>   

                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>                        
                        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 2, }} />}
                    </View>


                    <View style={styles.buttonContainer}>
                        <Button onPress={onClose}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                            >Cancel</Button>
                        <Button onPress={()=>{addService()}}
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

export default AddNewServiceModal

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
        height: 50,
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