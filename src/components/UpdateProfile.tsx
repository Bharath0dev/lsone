import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Image,
  Alert,
} from 'react-native';
import {Avatar, Button} from 'react-native-paper';
import styles from './stylesProfileEdit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Back from 'react-native-vector-icons/Ionicons';

import {RadioButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import UserData from './UserData';
import Dropdown from './Dropdown';
import { SelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import { FlatList } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const UpdateProfile = () => {

  const navigation = useNavigation();
    // const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    // const [city, setCity] = useState('');
    // const [zipcode, setZipcode] = useState('');

    const [imageUri, setImageUri] = useState(null);
    
    const [images, setImages] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);

    const [selectedImagesToUpload, setSelectedImagesToUpload] = useState([]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    
    const [userData, setUserData]= useState('');

    const route=useRoute();

    useEffect(() => {
      const { data } = route.params;
      setUserData(data);
      setEmail(data.email);
      setName(data.name);
      setRole(data.role);
      setMobile(data.mobile);
      setAddress(data.address);

      // setImageUri(data.profileImage);
      setProfilePicture(data.profileImage);
      if (data.role === 'ServiceProvider') {

        setImages(data.providerDetails.providerServiceImages || []);
      }
    }, [route.params]);

    useEffect(()=>{
      console.log('imageUri-',imageUri);
      console.log('userData.profileImage-',userData.profileImage);
      console.log('profilePicture',profilePicture);
    })

    const createFormData = () => {
      const formData = new FormData();

      if (imageUri) {
        const finalImageUri = {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'photo.jpg',
        };
        formData.append('image', finalImageUri);
    
      } else {
        if(profilePicture){
          formData.append('image', profilePicture)
        }
        console.error('No imageUri provided for the profile image');
        // return null;
      }
  
      if (selectedImagesToUpload.length > 0) {
        selectedImagesToUpload.forEach((image, index) => {
            const imageName = image.name || `serviceImage${index + 1}.jpg`;
            const imageForServiceImages = {
              uri: image.uri,
              type: image.type || 'image/jpeg', 
              name: imageName
          }
          if(imageForServiceImages.uri){
            formData.append('providerServiceImages', imageForServiceImages);
          }
        });
      }else if(images.length > 0){
        images.forEach((image, index) => {
          console.log('image.uri-',image.uri);
          const imageName = image.name || `serviceImage${index + 1}.jpg`;
          const imageForServiceImages = {
            uri: image.uri,
            type: image.type || 'image/jpeg', 
            name: imageName
        }
        console.log('imageForServiceImages-',imageForServiceImages);
        console.log('imageForServiceImages-',imageForServiceImages.uri);
        if(imageForServiceImages.uri){
          formData.append('providerServiceImages', imageForServiceImages);
        }
      });
    }

    
      formData.append('name', name);
      formData.append('email', email);
      formData.append('role', role);
      formData.append('mobile', mobile);
      formData.append('address', address);
      // formData.append('city', city);
      // formData.append('zipcode', zipcode);
  
      console.log(formData);
      return formData;
    };
  
    const updateProfile = async () => {
      const formData = createFormData();
      console.log('FormData:', formData);

      if (!formData) {
        console.error('FormData creation failed.'); // Added logging
        return;
      }
    
    
      try {
        console.log('Sending request to server...');
        const response = await axios.post('http://192.168.1.218:4021/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // Increased timeout
        });
        console.log('Response:', response.data);
        navigation.goBack();
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        console.error('Error details:', error);
        if (error.response) {
          console.error('Server responded with status:', error.response.status);
          console.error('Response data:', error.response.data);
          Alert.alert('Error', 'Failed to update profile: ' + error.response.data.message);
        } else if (error.request) {
          console.error('No response received, request:', error.request);
          Alert.alert('Error', 'Network error: Unable to connect to the server.');
        } else {
          console.error('Error setting up request:', error.message);
          Alert.alert('Error', 'There was a problem updating the profile.');
        }
      }
    };

    const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        const imageType = asset.type;
        console.log('Selected Image Type:', imageType);
      }
    });
  };


const selectImages = () => {
  const options = {
    mediaType: 'photo',
    selectionLimit: 0, // No limit on selection
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.assets && response.assets.length > 0) {
      const selectedImages = response.assets.map(asset => {
        const extension = asset.fileName?.split('.').pop() || 'jpg';
        const name = asset.fileName || `image_${Date.now()}.${extension}`;

        return {
          uri: asset.uri,
          type: asset.type,
          name: name,
        };
      });
      setSelectedImagesToUpload(selectedImages);
    } else {
      console.log('No images selected');
    }
  });
};


  const handleDeleteImage = async (index) =>{
    const imageToDelete = images[index];
    console.log('userdata in handleDeleteImage: ',userData);
    const userId = userData._id;
    console.log(index, userId);

    try{
    const response = await axios.delete('http://192.168.1.218:4021/deleteProviderServiceImage', {data: {userId:userId, image: imageToDelete }})
  
      if (response.status === 200) {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        
        Alert.alert("Success", "Image deleted successfully.");
        
      } else {
        Alert.alert("Error", "There was a problem deleting the image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "There was a problem deleting the image.");
    }
  }
  

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View>
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Back
              name="arrow-back"
              size={30}
              style={styles.backIcon}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.nameText}>Edit Profile</Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={styles.camDiv}>

          <TouchableOpacity onPress={()=> selectImage()} style={styles.camIconDiv}>
            <Entypo name="camera" size={25} style={styles.cameraIcon} />
          </TouchableOpacity>

          <View  style={styles.profileImageView}>
            {imageUri ? (<Image style={styles.profileImage} source={{ uri: `http://192.168.1.218:4021/${imageUri}` }}/>):(

              userData.profileImage ? (
                <Image style={styles.profileImage} source={{ uri: `http://192.168.1.218:4021/${userData.profileImage}` }}/>
              ) : (<Image style={styles.profileImage} source={require('../assets/userProfilePic.png')}/>)
            )
            
          }
          </View> 

        </View>

        <View
          style={{
            marginTop: 10,
            marginHorizontal: 22,
          }}>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Username</Text>
            <TextInput
              placeholder="Your Name"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              // value={this.state.username}
            //   onChange={(e) => this.handleName(e)}
            onChange={ (e) => setName(e.nativeEvent.text)}
            defaultValue={name}
            multiline={true}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Email</Text>
            <TextInput
              editable={false}
              placeholder="Your Email"
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              // value={this.state.uemail}
            //   onChange={(e) => this.handleEmail(e)}
            onChange={ (e) => setEmail(e.nativeEvent.text)}
            defaultValue={email}
            multiline={true}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Role</Text>
            <TextInput
              placeholder="Role"
              editable={false}
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={ (e) => setRole(e.nativeEvent.text)}
              defaultValue={role}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>Mobile No</Text>
            <TextInput
              placeholder="Your Mobile No"
              placeholderTextColor={'#999797'}
              keyboardType="numeric"
              maxLength={10}
              style={styles.infoEditSecond_text}
              onChange={ (e) => setMobile(e.nativeEvent.text)}
              defaultValue={mobile}
              multiline={true}
            />
          </View>
          <View style={styles.infoEditView}>
              <Text style={styles.infoEditFirst_text}>Address</Text>
              <TextInput
                placeholder="Address"
                placeholderTextColor={'#999797'}
                style={styles.infoEditSecond_text}
                onChange={ (e) => setAddress(e.nativeEvent.text)}
                defaultValue={address}
                multiline={true}
              />
              </View>

          {role == 'ServiceProvider' ? (
            <>
              <View>
                <Text style={styles.infoEditFirst_text}>Service Images</Text>
                <FlatList
                data={images}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index})=>(
                  <TouchableOpacity onPress={() => setSelectedImageIndex(index)}>
                    <View>
                      <Image source={{ uri: `http://192.168.1.218:4021/${item}` }} style={styles.serviceImages} />
                    </View>
                    {selectedImageIndex === index && (
                      <TouchableOpacity
                        style={styles.deleteIconView}
                        onPress={() => handleDeleteImage(index)}
                      >
                        <MaterialCommunityIcons name='delete-outline' size={30} color='white' style={styles.deleteIcon} />
                      </TouchableOpacity>
                    )}                    
                  </TouchableOpacity>
                )}/>
                <Button 
                style={styles.imagesButton} 
                labelStyle={styles.buttonText}
                onPress={()=>{selectImages()}}>Add more</Button>
              </View>
            </>
            
          ):(null) 
          // )
          }
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={updateProfile} style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>Update Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default UpdateProfile;
