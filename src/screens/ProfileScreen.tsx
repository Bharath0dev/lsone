import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';
import React, { useCallback } from 'react';
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Check from 'react-native-vector-icons/Feather';
import Back from 'react-native-vector-icons/Ionicons';
import Gender from 'react-native-vector-icons/Foundation';
import Mobile from 'react-native-vector-icons/Entypo';
import Error from 'react-native-vector-icons/MaterialIcons';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import Profession from 'react-native-vector-icons/AntDesign';
import City from 'react-native-vector-icons/MaterialCommunityIcons'
import Location from 'react-native-vector-icons/MaterialIcons'
import {CommonActions, DrawerActions, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Toast from 'react-native-toast-message';
// import { useRoute } from '@react-navigation/native';

function ProfileScreen() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const [deleteImage, setDeleteImage] = useState(false);


   const getData = async()=> {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    const response = await axios.post('http://192.168.1.218:4021/userdata', {token: token})
        console.log('consoling userData in profileScreen: ',response.data);
        setUserData(response.data.data);
  }

  const distributeData = () => {
    console.log('userdata in distribute data: ',userData)

    if(userData && userData.providerDetails && userData.providerDetails.providerServiceImages){
      console.log('images....: ',userData.providerDetails.providerServiceImages)
      setImages(userData.providerDetails.providerServiceImages);
    }
  }
  
  useFocusEffect(
    useCallback(() => {
      getData();
    },[]),
  );

  useEffect(()=>{
      // getData();
      distributeData();
  },[userData])

  const handleLogout = async () => {
    
    await AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
    await AsyncStorage.setItem('token', '');
    // navigation.navigate('LoginPage');

    navigation.dispatch(
      CommonActions.reset({
        index: 0, 
        routes: [{ name: 'LoginPage' }], 
      })
    );
  }

  // const handleDeleteIcon = () => {
  //   if(!deleteImage){
  //     setDeleteImage(true);
  //   }else{
  //     setDeleteImage(false);
  //   }
  // }

  // const handleDeleteImage = async (index) =>{
  //   const imageToDelete = images[index];
  //   console.log('userdata in handleDeleteImage: ',userData);
  //   const userId = userData._id;
  //   console.log(index, userId);

  //   try{
  //   const response = await axios.delete('http://192.168.1.218:4021/deleteProviderServiceImage', {data: {userId:userId, image: imageToDelete }})
  
  //     if (response.status === 200) {
  //       const updatedImages = images.filter((_, i) => i !== index);
  //       setImages(updatedImages);
  //       Alert.alert("Success", "Image deleted successfully.");
  //     } else {
  //       Alert.alert("Error", "There was a problem deleting the image.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //     Alert.alert("Error", "There was a problem deleting the image.");
  //   }
  // }
  

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>

        <View style={styles.profileImageView}>

          <Image 
            style={styles.profileImage} 
            source={userData.profileImage
              ? { uri: `http://192.168.1.218:4021/${userData.profileImage}` } 
              : require('../assets/userProfilePic.png')} 
          />
        </View>

          <View style={styles.nameView}>
            <Text style={styles.userName}>{userData.name}</Text>
          </View>

        <View style={{ marginHorizontal: 25}}>
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#ff9500'}]}>
                <Email name="email" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Email</Text>
                <Text style={styles.infoLarge_Text} numberOfLines={1}>
                  {userData.email}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#774BBC'}]}>
                <Profession name="profile" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Role</Text>
                <Text style={styles.infoLarge_Text}>
                  
                  {userData.role == '' ||
                  userData.role == undefined ||
                  userData.role == null
                    ? ''
                    : userData.role}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#f2276e'}]}>
                <Mobile name="mobile" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Mobile</Text>
                <Text style={styles.infoLarge_Text}>{userData.mobile}</Text>
              </View>
            </View>
          </View>

          {userData && userData.role == 'ServiceProvider' ? (

          <View>
              {/* <View style={styles.infoMain}>
              <View style={styles.infoCont}>
                <View style={[styles.infoIconCont, {backgroundColor: '#52be80'}]}>
                  <Location name="location-on" size={24} style={{color: 'white'}} />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoSmall_Text}>Services</Text>
                  <Text style={styles.infoLarge_Text}>{userData.services}</Text>
                </View>
              </View>
              </View> */}
              
            <View>
              <Text style={styles.infoServiceImageText}>Service Images</Text>
              {images.length > 0 ? (
                <FlatList
                  data={images}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <View>
                      <Image source={{ uri: `http://192.168.1.218:4021/${item}` }} style={styles.serviceImages} />
                    </View>
                  )}
                />
              ) : (
                <Text style={{ textAlign: 'center', color: '#b3b3b3' }}>No service images available</Text>
              )}
            </View>            
          </View>
          ) : (null)}
        </View>

        {userData && userData.role != 'Admin' ?(
          <View>
              <View style={[styles.infoMain, {marginLeft: 25}]}>
                <View style={styles.infoCont}>
                  <View style={[styles.infoIconCont, {backgroundColor: '#52be80'}]}>
                    <Location name="location-on" size={24} style={{color: 'white'}} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoSmall_Text}>Address</Text>
                    <Text style={styles.infoLarge_Text}>{userData.address}</Text>
                  </View>
                </View>
              </View>
          <View>
            <Button
              style={styles.editIcon}
              labelStyle={styles.buttonText}
              onPress={() => {
                navigation.navigate('UpdateProfile', {data: userData});}}
              > Edit Profile</Button>
          </View>
          </View>
          
        ):(null)}
        <View>
          <Button
              style={styles.editIcon}
              labelStyle={styles.buttonText}
              onPress={() => handleLogout()}
              > Log out</Button>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  editIcon: {
    backgroundColor: '#00634B',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    height: 40,
  },
  buttonText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  backIcon: {
    zIndex: 1,
    color: 'white',
    position: 'absolute',
    left: 2,
    margin: 15,
  },
  nameText: {
    color: 'black',
    fontSize: 28,
    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookCountMain: {
    borderColor: '#b0b0b0',
    borderWidth: 1,
    marginTop: 18,
    marginHorizontal: 20,

    borderRadius: 20,
    flexDirection: 'row',
    width: '88%',
  },
  bookCount: {
    width: '50%',
    borderColor: '#b0b0b0',
    borderRightWidth: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCountNum: {
    color: '#5D01AA',
    fontSize: 34,
    fontWeight: '800',
  },
  bookCountText: {
    color: '#b3b3b3', 
    fontSize: 14, 
    fontWeight: '500'
  },
  infoMain: {
    marginTop: 10,
  },
  infoCont: {
    width: '100%',
    flexDirection: 'row',
  },
  infoIconCont: {
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,

    alignItems: 'center',
    elevation: -5,
    borderColor: 'black',
    backgroundColor: 'black',
  },

  infoText: {
    width: '80%',
    flexDirection: 'column',
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#e6e6e6',
  },
  infoSmall_Text: {
    fontSize: 16,
    color: '#b3b3b3',
    fontWeight: '500',
  },
  infoLarge_Text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  booksUploadedMain: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    marginTop: 20,
  },
  flatlistDiv: {
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  booksUploadedText: {
    fontSize: 26,
    color: 'black',
    fontWeight: '700',
    paddingLeft: 20,
    paddingBottom: 8,
  },
  booksUploadedCard: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 9,
    marginBottom: 9,

    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 3,
  },
  booksUploadedImgDiv: {
    width: '28%',
  },
  booksUploadedImg: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  cardMidDiv: {
    paddingHorizontal: 10,
    width: '55%',
    position: 'relative',
  },
  approvedText: {
    fontSize: 12,
    color: '#0d7313',
    fontWeight: '600',
    marginLeft: 5,
  },
  cardBookNameText: {
    fontSize: 24,
    color: 'black',
    fontWeight: '700',
    marginTop: 2,
  },
  cardBookAuthor: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
    marginTop: 1,
  },
  cardRating: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  cardRatingCount: {
    fontSize: 14,
    marginTop: -2,
    paddingLeft: 4,
    color: '#303030',
  },
  cardEditDiv: {
    width: '17%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEditBtn: {
    height: 44,
    width: 44,
    backgroundColor: '#774BBC',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',

    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#f5a002',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    paddingHorizontal: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  profileImage:{
    height: 150,
    width: 150,
    // backgroundColor: 'green',
    borderRadius: 100,

  },
  profileImageView:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  nameView:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  userName: {
    fontSize: 25,
    fontWeight: '600',
    color: 'black',
  },
  imagesButton:{
    backgroundColor: '#00634B',
    borderRadius: 8,
    width: 100,
  },
  serviceImages:{
    width: 100,
    height: 100,
    margin: 5
  },
  deleteIconView:{
    position: 'absolute',
    backgroundColor: 'black',
    margin: 5,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5 
  },
  infoServiceImageText:{
    marginBottom: 10
  }
});
export default ProfileScreen;